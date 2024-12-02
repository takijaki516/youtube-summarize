import ytdl from "ytdl-core";
import { eq } from "drizzle-orm";
import { HttpsProxyAgent } from "https-proxy-agent";

import { auth } from "@/auth";
import { dbDrizzle, videosSchema, userRateLimitsSchema } from "@repo/database";
import { embedTranscript } from "@/lib/llm/embedding";
import {
  generateMarkdown,
  getTranscript,
  mergeTranscript,
} from "@/lib/llm/transcript";
import { generateSummary } from "@/lib/llm/summarize";
import { env } from "@/lib/env";

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

  const proxyUrl = env.PROXY_URL;
  const httpProxyAgent = proxyUrl ? new HttpsProxyAgent(proxyUrl) : undefined;

  const videoInfo = await ytdl.getBasicInfo(url, {
    requestOptions: {
      agent: proxyUrl ? httpProxyAgent : undefined,
      headers: {
        // Add common browser headers to look more legitimate
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        Connection: "keep-alive",
      },
    },
  });
  const videoTitle = videoInfo.videoDetails.title;
  const transcripts = await getTranscript(url, {
    agent: httpProxyAgent,
  });
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
