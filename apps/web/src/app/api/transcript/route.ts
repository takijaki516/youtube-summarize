import ytdl from "ytdl-core";
import { v7 as uuidv7 } from "uuid";
import { z } from "zod";

import { dbDrizzle, videosSchema } from "@repo/database";
import { embedTranscript } from "@/lib/llm/embedding";
import {
  generateMarkdown,
  getTranscript,
  mergeTranscript,
} from "@/lib/llm/transcript";
import { generateSummary } from "@/lib/llm/summarize";
import { OpenAIError } from "@/lib/llm/llm-error";
import { embeddingFactory, providerFactory } from "@/lib/llm/model";
import { TranscriptRequestSchema } from "@/types/types";

export const POST = async function POST(req: Request) {
  try {
    // validation
    const body = await req.json();
    const result = TranscriptRequestSchema.safeParse(body);
    if (!result.success) {
      return new Response(JSON.stringify({ error: result.error }), {
        status: 400,
      });
    }
    const {
      model: modelName,
      provider,
      url,
      embeddingModel: embeddingModelName,
      embeddingProvider,
    } = result.data;

    // get LLM and embedding model
    const modelProvider = providerFactory(provider);
    const llmModel = modelProvider(modelName);
    const embeddingModelProvider = embeddingFactory(embeddingProvider);
    const embeddingModel = embeddingModelProvider(embeddingModelName);

    // prepare for summary generation
    const videoId = uuidv7();
    const videoInfo = await ytdl.getInfo(url);
    const videoTitle = videoInfo.videoDetails.title;
    const transcripts = await getTranscript(url);
    const mergedTranscript = mergeTranscript(transcripts);

    // LLM processing starts here
    const generatedSummaryText = await generateSummary(
      mergedTranscript,
      llmModel,
    );
    // store embedding and its offset(time) for lookup when generating links(timestamps)
    await embedTranscript({
      embeddingModel: embeddingModel,
      transcript: transcripts,
      videoId: videoId,
    });
    const generatedMarkdown = await generateMarkdown({
      embeddingModel: embeddingModel,
      summary: generatedSummaryText,
      url: url,
      videoId: videoId,
    });

    // save to database
    await dbDrizzle.insert(videosSchema).values({
      id: videoId,
      title: videoTitle,
      url: body.url,
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
