import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { checkRateLimit, RateLimitError } from "@/lib/rate-limit";
import { drizzleClient, schema } from "@repo/database";

import { embedTranscript } from "@/lib/llm/embedding";
import {
  generateMarkdown,
  getTranscript,
  mergeTranscript,
} from "@/lib/llm/transcript";
import { generateSummary } from "@/lib/llm/summarize";

import { getMinimalVideoInfoFromAPI } from "@/lib/queries/youtube-info";

// TODO: implement rate limiting
export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    let clientUUID = cookieStore.get("clientUUID")?.value;

    if (!clientUUID) {
      clientUUID = uuidv4();

      // REVIEW:
      cookieStore.set("clientUUID", clientUUID, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    // 3 requests per 10 minutes per clientUUID
    await checkRateLimit(clientUUID, 3, 10 * 60 * 1000);

    const { url } = await req.json();

    if (!url) {
      return Response.json({ error: "URL is required" }, { status: 400 });
    }

    const videoInfoRes = await getMinimalVideoInfoFromAPI(url);

    const videoTitle = videoInfoRes.title;
    const videoId = videoInfoRes.videoId;

    const transcripts = await getTranscript(videoId);
    const originalTranscriptLanguage = transcripts[0]?.lang;

    if (!originalTranscriptLanguage) {
      return NextResponse.json(
        {
          message: "Transcript not available",
        },
        {
          status: 500,
        },
      );
    }

    const mergedTranscript = mergeTranscript(transcripts);
    const tempSummaryText = await generateSummary(mergedTranscript);

    const insertedVideo = await drizzleClient
      .insert(schema.tempVideosSchema)
      .values({
        title: videoTitle,
        url: url,
        summary: "not yet generated",
        originalTranscriptLanguage: originalTranscriptLanguage,
        clientUUID: clientUUID,
        videoId: videoId,
      })
      .returning({
        id: schema.tempVideosSchema.id,
      });

    if (!insertedVideo[0]) {
      return Response.json(
        { error: "Failed to insert video" },
        { status: 500 },
      );
    }

    await embedTranscript(transcripts, {
      isGuest: true,
      videoSchemaId: insertedVideo[0].id,
      clientUUID,
    });
    await generateMarkdown(tempSummaryText, url, originalTranscriptLanguage, {
      isGuest: true,
      videoSchemaId: insertedVideo[0].id,
      clientUUID,
    });

    return Response.json(
      { message: "Embedded Transcript", vId: insertedVideo[0].id },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error in /api/guest:", error);

    if (error instanceof RateLimitError) {
      return Response.json({ error: "Too many requests" }, { status: 429 });
    }

    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
