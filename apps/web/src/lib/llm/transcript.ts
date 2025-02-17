import { generateText } from "ai";
import { eq } from "drizzle-orm";
import { drizzleClient, schema } from "@repo/database";

import { YoutubeTranscript } from "../youtube-transcript";
import { similarText } from "./embedding";
import type { RequestOptions, TranscriptSegment } from "@/types/types";
import { google } from "./google";

export async function getTranscript(url: string): Promise<TranscriptSegment[]> {
  const transcripts = await YoutubeTranscript.fetchTranscript(url);

  let cur = 0;

  // chunking transcript for embedding vectors
  while (cur < transcripts.length - 1) {
    if (transcripts[cur]!.text.length < 125) {
      transcripts[cur]!.text += ` ${transcripts[cur + 1]!.text}`;
      transcripts.splice(cur + 1, 1);
    } else {
      cur++;
    }
  }

  return transcripts;
}

export function mergeTranscript(transcripts: TranscriptSegment[]): string {
  let mergedTranscript = "";

  for (const segment of transcripts) {
    mergedTranscript += `${segment.text} `;
  }

  return mergedTranscript;
}

export async function generateMarkdown(
  transcript: string,
  url: string,
  lang: string,
  { videoSchemaId, isGuest, userId, clientUUID }: RequestOptions,
) {
  const placeholders = transcript.match(/<.+?>/g);

  if (!placeholders) {
    return;
  }

  if (isGuest) {
    for (const placeholder of placeholders) {
      const replacementText = await processPlaceholder(placeholder, url, {
        clientUUID,
        videoSchemaId,
        isGuest,
      });

      transcript = transcript.replace(placeholder, replacementText);
    }

    if (lang !== "ko") {
      const res = await generateText({
        model: google("gemini-2.0-flash-001"),
        system: "translate to korean",
        prompt: transcript,
      });

      await drizzleClient
        .update(schema.tempVideosSchema)
        .set({
          summary: transcript,
          translatedSummary: res.text,
        })
        .where(eq(schema.tempVideosSchema.id, videoSchemaId));
    } else {
      await drizzleClient
        .update(schema.tempVideosSchema)
        .set({
          summary: transcript,
        })
        .where(eq(schema.tempVideosSchema.id, videoSchemaId));
    }
  } else {
    // not guest
    for (const placeholder of placeholders) {
      const replacementText = await processPlaceholder(placeholder, url, {
        videoSchemaId,
        userId,
      });

      transcript = transcript.replace(placeholder, replacementText);
    }

    if (lang !== "ko") {
      const res = await generateText({
        model: google("gemini-2.0-flash-001"),
        system: "translate to korean",
        prompt: transcript,
      });

      await drizzleClient
        .update(schema.videosSchema)
        .set({
          summary: transcript,
          translatedSummary: res.text,
        })
        .where(eq(schema.videosSchema.id, videoSchemaId));
    } else {
      await drizzleClient
        .update(schema.videosSchema)
        .set({
          summary: transcript,
        })
        .where(eq(schema.videosSchema.id, videoSchemaId));
    }
  }
}

async function processPlaceholder(
  placeholder: string,
  url: string,
  { videoSchemaId, userId, isGuest, clientUUID }: RequestOptions,
) {
  let sanitizedURL = url.replace(/[?&]t=\d+s?/, "");

  // NOTE: isTemp is for user
  if (isGuest) {
    if (placeholder.startsWith("<HYPERLINK:")) {
      const text = placeholder.slice(11, -1);
      const result = await similarText(text, {
        videoSchemaId,
        clientUUID,
        isGuest,
      });

      const timestamp = result.start_offset;
      const formattedTime = secondsToHMS(timestamp);

      return `[${formattedTime}](${sanitizedURL}&t=${timestamp}s)`;
    } else {
      return placeholder;
    }
  } else {
    if (placeholder.startsWith("<HYPERLINK:")) {
      const text = placeholder.slice(11, -1);
      const result = await similarText(text, {
        videoSchemaId,
        userId,
      });

      const timestamp = result.start_offset;
      const formattedTime = secondsToHMS(timestamp);

      return `[${formattedTime}](${sanitizedURL}&t=${timestamp}s)`;
    } else {
      return placeholder;
    }
  }
}

function secondsToHMS(time: number): string {
  const hours = Math.floor(time / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((time % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}
