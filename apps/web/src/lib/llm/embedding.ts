import { sql } from "drizzle-orm";
import pgvector from "pgvector";

import { dbDrizzle, embeddingsSchema } from "@repo/database";
import { SimilarSearchResult, TranscriptSegment } from "@/types/types";
import { openai } from "./openai";
import { OpenAIError } from "./llm-error";

// Function to get embedding from OpenAI
async function getEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    return response.data[0]?.embedding ?? [];
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
};

export async function embedTranscript(
  transcript: TranscriptSegment[],
  { videoId }: EmbedTranscriptOptions,
): Promise<void> {
  for (const segment of transcript) {
    const embedding = await getEmbedding(segment.text);

    await storeEmbedding(segment, embedding, { videoId });
  }
}

type SimilarTextOptions = {
  videoId: string;
};

export async function similarText(
  text: string,
  { videoId }: SimilarTextOptions,
): Promise<SimilarSearchResult> {
  const queryEmbedding = await getEmbedding(text);

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
