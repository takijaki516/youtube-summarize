import { headers } from "next/headers";
import { checkRateLimit, RateLimitError } from "@/lib/rate-limit";
import ytdl from "ytdl-core";

import { dbDrizzle, tempVideosSchema } from "@repo/database";
import { embedTranscript } from "@/lib/llm/embedding";
import {
  generateMarkdown,
  getTranscript,
  mergeTranscript,
} from "@/lib/llm/transcript";
import { generateSummary } from "@/lib/llm/summarize";

// TODO: implement rate limiting
export async function POST(req: Request) {
  try {
    const headersList = headers();
    const ip = headersList.get("x-forwarded-for") || "127.0.0.1";

    // 5 requests per minute per IP
    await checkRateLimit(`temp:${ip}`, 2, 60 * 1000);

    const { url } = await req.json();

    if (!url) {
      return Response.json({ error: "URL is required" }, { status: 400 });
    }

    const videoInfo = await ytdl.getInfo(url);
    const videoTitle = videoInfo.videoDetails.title;

    const transcripts = await getTranscript(url);
    const mergedTranscript = mergeTranscript(transcripts);
    const tempSummaryText = await generateSummary(mergedTranscript);

    // TODO: change video ID to be uuid so we can use when storing embeddings which makes inserting video later with generated summary
    const insertedVideo = await dbDrizzle
      .insert(tempVideosSchema)
      .values({
        url,
        title: videoTitle,
        summary: "not yet generated",
      })
      .returning({
        id: tempVideosSchema.id,
      });

    // store embedding and its offset(time) for lookup when generating links(timestamps)
    await embedTranscript(transcripts, {
      videoId: insertedVideo[0].id,
      isTemp: true,
    });
    await generateMarkdown(tempSummaryText, url, {
      videoId: insertedVideo[0].id,
      isTemp: true,
    });

    return Response.json(
      { message: "Embedded Transcript", vId: insertedVideo[0].id },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error in /api/temp:", error);

    if (error instanceof RateLimitError) {
      return Response.json({ error: "Too many requests" }, { status: 429 });
    }

    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
