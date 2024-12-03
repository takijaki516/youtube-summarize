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
