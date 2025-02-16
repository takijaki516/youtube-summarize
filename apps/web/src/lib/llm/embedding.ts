import { embedMany } from "ai";
import { sql } from "drizzle-orm";
import pgvector from "pgvector";
import { drizzleClient, schema } from "@repo/database";

import type {
  RequestOptions,
  SimilarSearchResult,
  TranscriptSegment,
} from "@/types/types";
import { google } from "./google";

export async function getEmbeddings(
  texts: string[],
): Promise<Array<Array<number>>> {
  const response = await embedMany({
    model: google.textEmbeddingModel("text-embedding-004"),
    values: texts,
  });

  return response.embeddings;
}

export async function embedTranscript(
  transcript: TranscriptSegment[],
  { videoSchemaId, userId, isGuest, clientUUID }: RequestOptions,
): Promise<void> {
  const texts = transcript.map((segment) => segment.text);
  const embeddings = await getEmbeddings(texts);

  if (isGuest) {
    transcript.map(async (segment, idx) => {
      const embedding = embeddings[idx];
      const language = segment.lang;

      await drizzleClient.insert(schema.tempEmbeddingsSchema).values({
        embedding: embedding,
        text: segment.text,
        lang: language,
        start: Math.floor(segment.offset),
        videoSchemaId: videoSchemaId,
        clientUUID: clientUUID,
      });
    });
  } else {
    transcript.map(async (segment, idx) => {
      const embedding = embeddings[idx];
      const language = segment.lang;

      await drizzleClient.insert(schema.embeddingsSchema).values({
        embedding: embedding,
        text: segment.text,
        lang: language,
        start: Math.floor(segment.offset),
        videoSchemaId: videoSchemaId,
        userId: userId,
      });
    });
  }
}

export async function similarText(
  text: string,
  { videoSchemaId, clientUUID, isGuest, userId }: RequestOptions,
): Promise<SimilarSearchResult> {
  const queryEmbedding = await getEmbeddings([text]);
  const pgQueryEmbedding = pgvector.toSql(queryEmbedding[0]);

  if (isGuest) {
    const result = await drizzleClient.execute(sql`
    SELECT text as text_field, start as start_offset, lang, 1 - (embedding <=> ${pgQueryEmbedding}) AS cosine_similarity
    FROM ${schema.tempEmbeddingsSchema}
    WHERE ${schema.tempEmbeddingsSchema.videoSchemaId} = ${videoSchemaId} AND ${schema.tempEmbeddingsSchema.clientUUID} = ${clientUUID}
    ORDER BY cosine_similarity DESC
      LIMIT ${1}
    `);

    return result.rows[0] as SimilarSearchResult;
  } else {
    const result = await drizzleClient.execute(sql`
    SELECT text as text_field, start as start_offset, lang, 1 - (embedding <=> ${pgQueryEmbedding}) AS cosine_similarity
    FROM ${schema.embeddingsSchema}
    WHERE ${schema.embeddingsSchema.videoSchemaId} = ${videoSchemaId} AND ${schema.embeddingsSchema.userId} = ${userId}
    ORDER BY cosine_similarity DESC
      LIMIT ${1}
    `);

    return result.rows[0] as SimilarSearchResult;
  }
}
