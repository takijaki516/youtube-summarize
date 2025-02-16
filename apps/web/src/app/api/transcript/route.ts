import { NextResponse, type NextRequest } from "next/server";
import { drizzleClient, schema } from "@repo/database";

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

  const userId = session.user.id;

  // TODO: 10 query per day Check rate limit
  // const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  // const userLimit = await drizzleClient
  //   .select()
  //   .from(schema.userRateLimitsSchema)
  //   .where(eq(schema.userRateLimitsSchema.userId, userId));

  // if (userLimit[0]) {
  //   if (userLimit[0].lastReset < tenMinutesAgo) {
  //     // Reset counter if 10 minutes have passed
  //     await drizzleClient
  //       .update(schema.userRateLimitsSchema)
  //       .set({ requestCount: 1, lastReset: new Date() })
  //       .where(eq(schema.userRateLimitsSchema.userId, userId));
  //   } else if (userLimit[0].requestCount >= 5) {
  //     return Response.json({ message: "Rate limit exceeded" }, { status: 429 });
  //   } else {
  //     // Increment counter
  //     await drizzleClient
  //       .update(schema.userRateLimitsSchema)
  //       .set({ requestCount: userLimit[0].requestCount + 1 })
  //       .where(eq(schema.userRateLimitsSchema.userId, userId));
  //   }
  // } else {
  //   // Create new rate limit record
  //   await drizzleClient.insert(schema.userRateLimitsSchema).values({
  //     userId,
  //     requestCount: 1,
  //     lastReset: new Date(),
  //   });
  // }

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
  const summaryText = await generateSummary(mergedTranscript);

  // TODO: change video ID to be uuid so we can use when storing embeddings which makes inserting video later with generated summary
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
