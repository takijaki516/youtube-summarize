import OpenAI from "openai";

import { env } from "../env";
import { TranscriptSegment } from "../types";
import { dbDrizzle } from "../db/drizzle";
import { embeddings } from "../db/schema/embedding";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

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
