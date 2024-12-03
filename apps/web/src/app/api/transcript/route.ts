import ytdl from "ytdl-core";
import { v7 as uuidv7 } from "uuid";

import { dbDrizzle, videosSchema } from "@repo/database";
import { embedTranscript } from "@/lib/llm/embedding";
import {
  generateMarkdown,
  getTranscript,
  mergeTranscript,
} from "@/lib/llm/transcript";
import { generateSummary } from "@/lib/llm/summarize";
import { OpenAIError } from "@/lib/llm/llm-error";

export const POST = async function POST(req: Request) {
  const { url } = await req.json();

  if (!url) {
    return Response.json({ message: "No URL provided" }, { status: 400 });
  }

  try {
    const videoId = uuidv7();
    const videoInfo = await ytdl.getInfo(url);
    const videoTitle = videoInfo.videoDetails.title;
    const transcripts = await getTranscript(url);
    const mergedTranscript = mergeTranscript(transcripts);
    const summaryText = await generateSummary(mergedTranscript);

    // store embedding and its offset(time) for lookup when generating links(timestamps)
    await embedTranscript(transcripts, {
      videoId: videoId,
    });

    const generatedMarkdown = await generateMarkdown(summaryText, url, {
      videoId: videoId,
    });

    await dbDrizzle.insert(videosSchema).values({
      id: videoId,
      title: videoTitle,
      url: url,
      summary: generatedMarkdown,
    });

    return Response.json(
      { message: "Embedded Transcript", vId: videoId },
      { status: 201 },
    );
  } catch (error) {
    console.log("🚀 ~ file: route.ts:50 ~ POST ~ error:", error);

    if (error instanceof OpenAIError) {
      return Response.json({ message: error.message }, { status: 500 });
    }

    return Response.json(
      { message: "Failed to embed transcript" },
      { status: 500 },
    );
  }
};
