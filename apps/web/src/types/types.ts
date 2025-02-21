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

export type LLMRequestOption =
  | {
      isGuest: true;
      clientUUID: string;
      userId?: never;
    }
  | {
      isGuest?: false | null | undefined;
      clientUUID?: never;
      userId: string;
    };

export type LLMRequest = { videoSchemaId: number } & LLMRequestOption;

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
  }
}

export const TRANSCRIPT_STATUS = {
  "1": "데이터 수집...",
  "2": "영상 해석중...",
  "3": "해석 완료. 요약 중...",
  "4": "포맷 변환 중...",
  "5": "번역/저장 중...",
  "6": "완료",
} as const;

export const TRANSCRIPT_STATUS_KEYS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
] as const satisfies (keyof typeof TRANSCRIPT_STATUS)[];
