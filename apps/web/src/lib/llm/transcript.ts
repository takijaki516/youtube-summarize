import { YoutubeTranscript } from "youtube-transcript";
import { eq } from "drizzle-orm";

import { dbDrizzle, videosSchema, tempVideosSchema } from "@repo/database";
import { TranscriptSegment } from "../../types/types";
import { similarText } from "./embedding";

export async function getTranscript(url: string): Promise<TranscriptSegment[]> {
  const transcripts = await YoutubeTranscript.fetchTranscript(url);
  let cur = 0;

  // NOTE: how to evaluate if this is a good chunk size?
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

type GenerateMarkdownOptions =
  | {
      videoId: number;
      isTemp: true;
      userId?: never;
    }
  | {
      videoId: number;
      userId: string;
      isTemp?: false;
    };

export async function generateMarkdown(
  transcript: string,
  url: string,
  { videoId, isTemp, userId }: GenerateMarkdownOptions,
) {
  const placeholders = transcript.match(/<.+?>/g);

  if (!placeholders) {
    return;
  }

  if (isTemp) {
    for (const placeholder of placeholders) {
      const replacementText = await processPlaceholder(placeholder, url, {
        videoId,
        isTemp,
      });

      transcript = transcript.replace(placeholder, replacementText);
    }

    await dbDrizzle
      .update(tempVideosSchema)
      .set({
        summary: transcript,
      })
      .where(eq(tempVideosSchema.id, videoId));
  } else {
    for (const placeholder of placeholders) {
      const replacementText = await processPlaceholder(placeholder, url, {
        videoId,
        userId,
      });

      transcript = transcript.replace(placeholder, replacementText);
    }

    await dbDrizzle
      .update(videosSchema)
      .set({
        summary: transcript,
      })
      .where(eq(videosSchema.id, videoId));
  }
}

type ProcessPlaceholderOptions =
  | {
      videoId: number;
      isTemp: true;
      userId?: never;
    }
  | {
      videoId: number;
      userId: string;
      isTemp?: false;
    };

async function processPlaceholder(
  placeholder: string,
  url: string,
  { videoId, userId, isTemp }: ProcessPlaceholderOptions,
) {
  // remove the timestamp from the url
  let sanitizedURL = url.replace(/&t=\d+s/, "");

  if (isTemp) {
    if (placeholder.startsWith("<HYPERLINK:")) {
      const text = placeholder.slice(11, -1);
      const result = await similarText(text, { videoId, isTemp });

      const timestamp = result.start;
      const formattedTime = secondsToHMS(timestamp);

      const hyperlink = `${sanitizedURL}&t=${timestamp}s`;

      return `[YOUTUBE VIDEO: ${formattedTime}](${hyperlink})`;
    } else {
      return placeholder;
    }
  } else {
    if (placeholder.startsWith("<HYPERLINK:")) {
      const text = placeholder.slice(11, -1);
      const result = await similarText(text, { videoId, userId });

      const timestamp = result.start;
      const formattedTime = secondsToHMS(timestamp);

      const hyperlink = `${sanitizedURL}&t=${timestamp}s`;

      return `[YOUTUBE VIDEO: ${formattedTime}](${hyperlink})`;
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
