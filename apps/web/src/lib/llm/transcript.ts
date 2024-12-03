import { eq } from "drizzle-orm";

import { YoutubeTranscript } from "../youtube-transcript";
import { dbDrizzle, videosSchema } from "@repo/database";
import { TranscriptSegment } from "@/types/types";
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

type GenerateMarkdownOptions = {
  videoId: string;
};

export async function generateMarkdown(
  summary: string,
  url: string,
  { videoId }: GenerateMarkdownOptions,
): Promise<string> {
  const placeholders = summary.match(/<.+?>/g);

  if (!placeholders) {
    return summary;
  }

  for (const placeholder of placeholders) {
    const replacementText = await processPlaceholder(placeholder, url, {
      videoId,
    });

    summary = summary.replace(placeholder, replacementText);
  }

  return summary;
}

type ProcessPlaceholderOptions = {
  videoId: string;
};

async function processPlaceholder(
  placeholder: string,
  url: string,
  { videoId }: ProcessPlaceholderOptions,
) {
  let sanitizedURL = url.replace(/[?&]t=\d+s?/, "");

  if (placeholder.startsWith("<HYPERLINK:")) {
    const text = placeholder.slice(11, -1);
    const result = await similarText(text, { videoId });

    const timestamp = result.start;
    const formattedTime = secondsToHMS(timestamp);

    return `[YOUTUBE VIDEO: ${formattedTime}](${sanitizedURL}&t=${timestamp}s)`;
  } else {
    return placeholder;
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
