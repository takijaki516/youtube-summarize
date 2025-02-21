import { eq, sql } from "drizzle-orm";
import { createDataStreamResponse, generateText, streamText } from "ai";
import { drizzleClient, schema } from "@repo/database";

import { LLMRequestOption, TRANSCRIPT_STATUS_KEYS } from "@/types/types";
import { getMinimalVideoInfoFromAPI } from "@/lib/queries/youtube-info";
import { google } from "@/lib/llm/google";
import { embedTranscript } from "@/lib/llm/embedding";
import {
  generateMarkdown,
  getTranscript,
  mergeTranscript,
} from "@/lib/llm/transcript";
import { SUMMARY_SYSTEMPROMPT } from "@/lib/llm/summarize";

export function createSummaryStream(
  videoUrl: string,
  llmRequestOptions: LLMRequestOption,
) {
  return createDataStreamResponse({
    execute: async (dataStream) => {
      //
      const step1 = TRANSCRIPT_STATUS_KEYS[0];
      dataStream.writeData(`${step1}-`);

      const videoInfoRes = await getMinimalVideoInfoFromAPI(videoUrl);
      const duration = videoInfoRes.duration;

      if (duration > 1800) {
        throw new Error("영상 길이가 30분 이상입니다.");
      }

      const videoTitle = videoInfoRes.title;
      const videoId = videoInfoRes.videoId;

      //
      const step2 = TRANSCRIPT_STATUS_KEYS[1];
      dataStream.writeData(`${step2}-`);

      const transcripts = await getTranscript(videoId);

      const originalTranscriptLanguage = transcripts[0]?.lang;
      if (!originalTranscriptLanguage) {
        throw new Error("영상 데이터 수집 실패");
      }

      const mergedTranscript = mergeTranscript(transcripts);

      //
      const step3 = TRANSCRIPT_STATUS_KEYS[2];
      dataStream.writeData(`${step3}-`);

      const summaryStream = streamText({
        model: google("gemini-2.0-flash-001"),
        system: SUMMARY_SYSTEMPROMPT,
        prompt: `Here is the transcript: ${mergedTranscript}. This is very important to me!! TRY YOUR BEST!!!`,
        temperature: 0.1,
        onFinish: async (result) => {
          const rawGeneratedSummary = result.text;

          let insertedVideo;
          if (llmRequestOptions.isGuest) {
            insertedVideo = await drizzleClient
              .insert(schema.tempVideosSchema)
              .values({
                url: videoUrl,
                title: videoTitle,
                rawSummary: rawGeneratedSummary,
                originalTranscriptLanguage: originalTranscriptLanguage,
                clientUUID: llmRequestOptions.clientUUID,
                videoId: videoId,
              })
              .returning({
                id: schema.tempVideosSchema.id,
              });
          } else {
            insertedVideo = await drizzleClient
              .insert(schema.videosSchema)
              .values({
                url: videoUrl,
                title: videoTitle,
                rawSummary: rawGeneratedSummary,
                originalTranscriptLanguage: originalTranscriptLanguage,
                userId: llmRequestOptions.userId,
                videoId: videoId,
              })
              .returning({
                id: schema.videosSchema.id,
              });
          }

          if (!insertedVideo[0]) {
            throw new Error("비디오 저장 실패");
          }

          //
          const step4 = TRANSCRIPT_STATUS_KEYS[3];
          dataStream.writeData(`${step4}-`);

          // store embedding and its offset(time) for vector search when generating links(timestamps)
          await embedTranscript(transcripts, {
            videoSchemaId: insertedVideo[0].id,
            ...llmRequestOptions,
          });

          const generatedMarkdown = await generateMarkdown(
            rawGeneratedSummary,
            videoUrl,
            {
              videoSchemaId: insertedVideo[0].id,
              ...llmRequestOptions,
            },
          );

          if (!generatedMarkdown) {
            throw new Error("요약생성 실패");
          }

          //
          const step5 = TRANSCRIPT_STATUS_KEYS[4];
          dataStream.writeData(`${step5}-${insertedVideo[0].id}`);

          if (llmRequestOptions.isGuest) {
            await drizzleClient
              .update(schema.tempVideosSchema)
              .set({
                summary: generatedMarkdown,
              })
              .where(eq(schema.tempVideosSchema.id, insertedVideo[0].id));
          } else {
            await drizzleClient
              .update(schema.videosSchema)
              .set({
                summary: generatedMarkdown,
              })
              .where(eq(schema.videosSchema.id, insertedVideo[0].id));
          }

          if (originalTranscriptLanguage !== "ko") {
            const translateSummaryResult = await generateText({
              model: google("gemini-2.0-flash-001"),
              system: "translate to korean",
              prompt: generatedMarkdown,
            });

            if (llmRequestOptions.isGuest) {
              await drizzleClient
                .update(schema.tempVideosSchema)
                .set({
                  translatedSummary: translateSummaryResult.text,
                })
                .where(eq(schema.tempVideosSchema.id, insertedVideo[0].id));
            } else {
              await drizzleClient
                .update(schema.videosSchema)
                .set({
                  translatedSummary: translateSummaryResult.text,
                })
                .where(eq(schema.videosSchema.id, insertedVideo[0].id));
            }
          }

          // increase a count rate limit
          const now = new Date();
          const newResetAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
          if (llmRequestOptions.isGuest) {
            const clientUUID = llmRequestOptions.clientUUID;

            await drizzleClient
              .insert(schema.rateLimitsSchema)
              .values({
                clientUUID,
                count: 1,
                resetAt: newResetAt,
              })
              .onConflictDoUpdate({
                target: schema.rateLimitsSchema.clientUUID,
                set: {
                  count: sql`CASE 
            WHEN ${schema.rateLimitsSchema.resetAt} <= ${now.toISOString()} THEN 1 
            ELSE ${schema.rateLimitsSchema.count} + 1 
          END`,
                  // NOTE:
                  resetAt: sql`CASE 
            WHEN ${schema.rateLimitsSchema.resetAt} <= ${now.toISOString()} THEN ${newResetAt.toISOString()} 
            ELSE ${schema.rateLimitsSchema.resetAt}
          END`,
                  updatedAt: now,
                },
              });
          } else {
            const userId = llmRequestOptions.userId;

            await drizzleClient
              .insert(schema.userRateLimitSchema)
              .values({
                userId,
                count: 1,
                resetAt: newResetAt,
              })
              .onConflictDoUpdate({
                target: schema.userRateLimitSchema.userId,
                set: {
                  count: sql`CASE 
            WHEN ${schema.userRateLimitSchema.resetAt} <= ${now.toISOString()} THEN 1 
            ELSE ${schema.userRateLimitSchema.count} + 1 
          END`,
                  resetAt: sql`CASE 
            WHEN ${schema.userRateLimitSchema.resetAt} <= ${now.toISOString()} THEN ${newResetAt.toISOString()} 
            ELSE ${schema.userRateLimitSchema.resetAt}
          END`,
                  updatedAt: now,
                },
              });
          }

          const step6 = TRANSCRIPT_STATUS_KEYS[5];
          dataStream.writeData(`${step6}-${insertedVideo[0].id}`);
        },
      });

      summaryStream.mergeIntoDataStream(dataStream);
    },
    onError: (error) => {
      if (error instanceof Error) return error.message;
      return "에러 발생";
    },
  });
}
