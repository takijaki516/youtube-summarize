import { sql } from "drizzle-orm";
import pgvector from "pgvector";
import { type EmbeddingModel, embed } from "ai";

import { dbDrizzle, embeddingsSchema } from "@repo/database";
import { SimilarSearchResult, TranscriptSegment } from "@/types/types";
import { OpenAIError } from "./llm-error";

interface GetEmbeddingOptions {
  text: string;
  embeddingModel: EmbeddingModel<string>;
}

// Function to get embedding from OpenAI
async function getEmbedding({
  text,
  embeddingModel,
}: GetEmbeddingOptions): Promise<number[]> {
  try {
    const { embedding } = await embed({
      model: embeddingModel,
      value: text,
    });

    return embedding;
  } catch (error) {
    throw new OpenAIError("Failed to get embedding");
  }
}

type StoreEmbeddingOptions = {
  videoId: string;
};

async function storeEmbedding(
  segment: TranscriptSegment,
  embedding: number[],
  { videoId }: StoreEmbeddingOptions,
): Promise<void> {
  const language = segment.lang || "en";

  await dbDrizzle.insert(embeddingsSchema).values({
    embedding: embedding,
    text: segment.text,
    lang: language,
    videoId: videoId,
    start: Math.ceil(segment.offset),
  });
}

type EmbedTranscriptOptions = {
  videoId: string;
  transcript: TranscriptSegment[];
  embeddingModel: EmbeddingModel<string>;
};

export async function embedTranscript({
  embeddingModel,
  transcript,
  videoId,
}: EmbedTranscriptOptions): Promise<void> {
  for (const segment of transcript) {
    const embedding = await getEmbedding({
      text: segment.text,
      embeddingModel: embeddingModel,
    });

    await storeEmbedding(segment, embedding, { videoId });
  }
}

type SimilarTextOptions = {
  videoId: string;
  embeddingModel: EmbeddingModel<string>;
  text: string;
};

export async function similarText({
  embeddingModel,
  text,
  videoId,
}: SimilarTextOptions): Promise<SimilarSearchResult> {
  const queryEmbedding = await getEmbedding({
    text: text,
    embeddingModel: embeddingModel,
  });

  const pgQueryEmbedding = pgvector.toSql(queryEmbedding);

  const result = await dbDrizzle.execute(sql`
    SELECT text, start, lang, 1 - (embedding <=> ${pgQueryEmbedding}) AS cosine_similarity
    FROM ${embeddingsSchema}
    WHERE ${embeddingsSchema.videoId} = ${videoId}
    ORDER BY cosine_similarity DESC
      LIMIT ${1}
    `);

  return result[0] as SimilarSearchResult;
}
