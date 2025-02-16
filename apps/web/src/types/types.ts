// Transcript object structure
export type TranscriptSegment = {
  text: string;
  duration: number;
  offset: number;
  lang?: string;
};

export type SimilarSearchResult = {
  text_field: string;
  start_offset: number;
  lang: string;
  cosine_similarity: number;
};

export type RequestOptions = { videoSchemaId: number } & (
  | {
      isGuest: true;
      clientUUID: string;
      userId?: never;
    }
  | {
      isGuest?: false | null | undefined;
      clientUUID?: never;
      userId: string;
    }
);

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
  }
}
