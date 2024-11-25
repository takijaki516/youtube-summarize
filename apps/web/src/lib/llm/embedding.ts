import { sql } from "drizzle-orm";
import pgvector from "pgvector";

import {
  dbDrizzle,
  embeddingsSchema,
  tempEmbeddingsSchema,
} from "@repo/database";
import { SimilarSearchResult, TranscriptSegment } from "../../types/types";
import { openai } from "./openai";

// Function to get embedding from OpenAI
async function getEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return response.data[0].embedding;
}

type StoreEmbeddingOptions =
  | {
      videoId: number;
      userId?: never;
      isTemp: true;
    }
  | {
      videoId: number;
      userId: string;
      isTemp?: false;
    };

async function storeEmbedding(
  segment: TranscriptSegment,
  embedding: number[],
  { videoId, userId, isTemp }: StoreEmbeddingOptions,
): Promise<void> {
  const language = segment.lang || "en";

  if (isTemp) {
    await dbDrizzle.insert(tempEmbeddingsSchema).values({
      embedding: embedding,
      text: segment.text,
      lang: language,
      videoId: videoId,
      start: Math.ceil(segment.offset),
    });
  } else {
    await dbDrizzle.insert(embeddingsSchema).values({
      embedding: embedding,
      text: segment.text,
      lang: language,
      userId: userId,
      videoId: videoId,
      start: Math.ceil(segment.offset),
    });
  }
}

type EmbedTranscriptOptions =
  | {
      videoId: number;
      userId?: never;
      isTemp: true;
    }
  | {
      videoId: number;
      userId: string;
      isTemp?: false;
    };

export async function embedTranscript(
  transcript: TranscriptSegment[],
  { videoId, userId, isTemp }: EmbedTranscriptOptions,
): Promise<void> {
  if (isTemp) {
    for (const segment of transcript) {
      const embedding = await getEmbedding(segment.text);
      await storeEmbedding(segment, embedding, { videoId, isTemp });
    }
  } else {
    for (const segment of transcript) {
      const embedding = await getEmbedding(segment.text);
      await storeEmbedding(segment, embedding, { videoId, userId });
    }
  }
}

type SimilarTextOptions =
  | {
      videoId: number;
      isTemp: true;
    }
  | {
      videoId: number;
      userId: string;
      isTemp?: false;
    };

export async function similarText(
  text: string,
  { videoId, isTemp }: SimilarTextOptions,
): Promise<SimilarSearchResult> {
  const queryEmbedding = await getEmbedding(text);

  const pgQueryEmbedding = pgvector.toSql(queryEmbedding);

  if (isTemp) {
    const result = await dbDrizzle.execute(sql`
    SELECT text, start, lang, 1 - (embedding <=> ${pgQueryEmbedding}) AS cosine_similarity
    FROM ${tempEmbeddingsSchema}
    WHERE ${tempEmbeddingsSchema.videoId} = ${videoId}
    ORDER BY cosine_similarity DESC
      LIMIT ${1}
    `);

    return result[0] as SimilarSearchResult;
  } else {
    const result = await dbDrizzle.execute(sql`
    SELECT text, start, lang, 1 - (embedding <=> ${pgQueryEmbedding}) AS cosine_similarity
    FROM ${embeddingsSchema}
    WHERE ${embeddingsSchema.videoId} = ${videoId}
    ORDER BY cosine_similarity DESC
      LIMIT ${1}
    `);

    return result[0] as SimilarSearchResult;
  }
}
