import { NextResponse, type NextRequest } from "next/server";
import { drizzleClient, schema } from "@repo/database";
import { eq } from "drizzle-orm";

import { embedTranscript } from "@/lib/llm/embedding";
import {
  generateMarkdown,
  getTranscript,
  mergeTranscript,
} from "@/lib/llm/transcript";
import { generateSummary } from "@/lib/llm/summarize";
import { auth } from "@/lib/auth";
import { getMinimalVideoInfoFromAPI } from "@/lib/queries/youtube-info";

export const POST = async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { url } = await req.json();
  if (!url) {
    return Response.json({ error: "URL is required" }, { status: 400 });
  }
  const videoInfoRes = await getMinimalVideoInfoFromAPI(url);

  const duration = videoInfoRes.duration;

  if (duration > 1800) {
    return NextResponse.json(
      {
        message:
          "동영상이 30분 이상입니다. 현재는 30분 이하의 동영상만 처리 가능합니다.",
      },
      {
        status: 400,
      },
    );
  }

  const userId = session.user.id;

  // NOTE: 10 requests per day
  const now = new Date();
  const limit = 10;
  const newResetAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const existingRecord = await drizzleClient
    .select()
    .from(schema.userRateLimitSchema)
    .where(eq(schema.userRateLimitSchema.userId, userId))
    .limit(1);

  if (existingRecord[0]) {
    const record = existingRecord[0];

    if (now > record.resetAt) {
      // reset count
      await drizzleClient
        .update(schema.userRateLimitSchema)
        .set({
          count: 1,
          resetAt: newResetAt,
          updatedAt: now,
        })
        .where(eq(schema.userRateLimitSchema.userId, userId));
    } else if (record.count >= limit) {
      return NextResponse.json(
        { message: "Rate limit exceeded" },
        { status: 429 },
      );
    } else {
      // count + 1
      await drizzleClient
        .update(schema.userRateLimitSchema)
        .set({ count: record.count + 1, updatedAt: now })
        .where(eq(schema.userRateLimitSchema.userId, userId));
    }
  } else {
    // Create new rate limit record
    await drizzleClient.insert(schema.userRateLimitSchema).values({
      userId,
      count: 1,
      resetAt: newResetAt,
    });
  }

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
  const summaryText = await generateSummary(mergedTranscript);

  const insertedVideo = await drizzleClient
    .insert(schema.videosSchema)
    .values({
      url: url,
      title: videoTitle,
      summary: "not yet generated",
      originalTranscriptLanguage: originalTranscriptLanguage,
      userId,
      videoId: videoId,
    })
    .returning({
      id: schema.videosSchema.id,
    });

  if (!insertedVideo[0]) {
    return Response.json(
      { message: "Failed to insert video" },
      { status: 500 },
    );
  }

  // store embedding and its offset(time) for lookup when generating links(timestamps)
  await embedTranscript(transcripts, {
    videoSchemaId: insertedVideo[0].id,
    userId,
  });
  await generateMarkdown(summaryText, url, originalTranscriptLanguage, {
    videoSchemaId: insertedVideo[0].id,
    userId,
  });

  return Response.json(
    { message: "Embedded Transcript", vId: insertedVideo[0].id },
    { status: 201 },
  );
};
