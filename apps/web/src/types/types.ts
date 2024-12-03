import { z } from "zod";

// Transcript object structure
export type TranscriptSegment = {
  text: string;
  duration: number;
  offset: number;
  lang?: string;
};

export type SimilarSearchResult = {
  text: string;
  start: number;
  lang: string;
  cosine_similarity: number;
};

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
  }
}

export const TranscriptRequestSchema = z.object({
  model: z.string(),
  provider: z.enum(["openai", "anthropic", "gemini"]),
  embeddingModel: z.enum(["text-embedding-3-small", "bge-m3"]),
  embeddingProvider: z.enum(["openai", "ollama"]),
  url: z.string().url(),
});

// TODO: better typing
export type TranscriptRequest = z.infer<typeof TranscriptRequestSchema>;
