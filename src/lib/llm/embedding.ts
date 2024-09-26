import { cosineDistance, eq, sql } from "drizzle-orm";
import pgvector from "pgvector";

import { SimilarSearchResult, TranscriptSegment } from "../../types/types";
import { dbDrizzle } from "../db/drizzle";
import { embeddings } from "../db/schema/embedding";
import { openai } from "./openai";

// Function to get embedding from OpenAI
async function getEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return response.data[0].embedding;
}

async function storeEmbedding(
  segment: TranscriptSegment,
  embedding: number[],
  videoId: number,
  userId: string,
): Promise<void> {
  const language = segment.lang || "en";

  await dbDrizzle.insert(embeddings).values({
    embedding: embedding,
    text: segment.text,
    lang: language,
    userId: userId,
    videoId: videoId,
    start: Math.ceil(segment.offset),
  });
}

export async function embedTranscript(
  transcript: TranscriptSegment[],
  videoId: number,
  userId: string,
): Promise<void> {
  for (const segment of transcript) {
    const embedding = await getEmbedding(segment.text);
    await storeEmbedding(segment, embedding, videoId, userId);
  }
}

// Function to find similar text using cosine similarity
export async function similarText(
  text: string,
  videoId: number,
  limit: number = 1,
): Promise<SimilarSearchResult> {
  const queryEmbedding = await getEmbedding(text);

  const pgQueryEmbedding = pgvector.toSql(queryEmbedding);

  const result = await dbDrizzle.execute(sql`
    SELECT text, start, lang, 1 - (embedding <=> ${pgQueryEmbedding}) AS cosine_similarity
    FROM ${embeddings}
    WHERE ${embeddings.videoId} = ${videoId}
    ORDER BY cosine_similarity DESC
    LIMIT ${limit}
  `);

  return result[0] as SimilarSearchResult;
}
