import ytdl from "ytdl-core";

import { auth } from "@/auth";
import { dbDrizzle, videosSchema, userRateLimitsSchema } from "@repo/database";
import { embedTranscript } from "@/lib/llm/embedding";
import {
  generateMarkdown,
  getTranscript,
  mergeTranscript,
} from "@/lib/llm/transcript";
import { generateSummary } from "@/lib/llm/summarize";
import { eq, gt } from "drizzle-orm";

export const POST = auth(async function POST(req) {
  if (!req.auth) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userId = req.auth.user.id;

  // Check rate limit
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  const userLimit = await dbDrizzle
    .select()
    .from(userRateLimitsSchema)
    .where(eq(userRateLimitsSchema.userId, userId));

  if (userLimit[0]) {
    if (userLimit[0].lastReset < tenMinutesAgo) {
      // Reset counter if 10 minutes have passed
      await dbDrizzle
        .update(userRateLimitsSchema)
        .set({ requestCount: 1, lastReset: new Date() })
        .where(eq(userRateLimitsSchema.userId, userId));
    } else if (userLimit[0].requestCount >= 5) {
      return Response.json({ message: "Rate limit exceeded" }, { status: 429 });
    } else {
      // Increment counter
      await dbDrizzle
        .update(userRateLimitsSchema)
        .set({ requestCount: userLimit[0].requestCount + 1 })
        .where(eq(userRateLimitsSchema.userId, userId));
    }
  } else {
    // Create new rate limit record
    await dbDrizzle.insert(userRateLimitsSchema).values({
      userId,
      requestCount: 1,
      lastReset: new Date(),
    });
  }

  const { url } = await req.json();

  const videoInfo = await ytdl.getInfo(url);
  const videoTitle = videoInfo.videoDetails.title;

  const transcripts = await getTranscript(url);
  const mergedTranscript = mergeTranscript(transcripts);
  const summaryText = await generateSummary(mergedTranscript);

  // TODO: change video ID to be uuid so we can use when storing embeddings which makes inserting video later with generated summary
  const insertedVideo = await dbDrizzle
    .insert(videosSchema)
    .values({
      url,
      title: videoTitle,
      summary: "not yet generated",
      userId,
    })
    .returning({
      id: videosSchema.id,
    });

  if (!insertedVideo[0]) {
    return Response.json(
      { message: "Failed to insert video" },
      { status: 500 },
    );
  }

  // store embedding and its offset(time) for lookup when generating links(timestamps)
  await embedTranscript(transcripts, {
    videoId: insertedVideo[0].id,
    userId,
  });
  await generateMarkdown(summaryText, url, {
    videoId: insertedVideo[0].id,
    userId,
  });

  return Response.json(
    { message: "Embedded Transcript", vId: insertedVideo[0].id },
    { status: 201 },
  );
});
