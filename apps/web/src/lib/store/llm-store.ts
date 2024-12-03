import { create } from "zustand";

export const EMBEDDING_MODELS: EMBEDDING_PROVIDER[] = [
  {
    provider: "openai",
    model: "text-embedding-3-small",
  },
  {
    provider: "ollama",
    model: "bge-m3",
  },
] as const;

export const LLMS: LLM[] = [
  {
    provider: "openai",
    model: "gpt-4o",
  },
  {
    provider: "openai",
    model: "gpt-4o-mini",
  },
  {
    provider: "anthropic",
    model: "claude-3-5-sonnet-20241022",
  },
  {
    provider: "anthropic",
    model: "claude-3-5-sonnet-20240620",
  },
  {
    provider: "gemini",
    model: "gemini-1.5-pro",
  },
  {
    provider: "gemini",
    model: "gemini-1.5-flash",
  },
  {
    provider: "ollama",
    model: "llama3.1-8b",
  },
] as const;

export type LLM =
  | {
      provider: "openai";
      model: "gpt-4o" | "gpt-4o-mini";
    }
  | {
      provider: "anthropic";
      model: "claude-3-5-sonnet-20241022" | "claude-3-5-sonnet-20240620";
    }
  | {
      provider: "gemini";
      model: "gemini-1.5-flash" | "gemini-1.5-pro";
    }
  | {
      provider: "ollama";
      model: string;
    };

export type EMBEDDING_PROVIDER =
  | {
      provider: "openai";
      model: "text-embedding-3-small";
    }
  | {
      provider: "ollama";
      model: "bge-m3";
    };

type LLMStore = {
  currentLLM: LLM | null;
  setCurrentLLM: (llm: LLM | null) => void;
  currentEmbedding: EMBEDDING_PROVIDER | null;
  setCurrentEmbedding: (embedding: EMBEDDING_PROVIDER | null) => void;
};

export const useLLMStore = create<LLMStore>((set) => ({
  currentLLM: null,
  setCurrentLLM: (llm) => set({ currentLLM: llm }),
  currentEmbedding: null,
  setCurrentEmbedding: (embedding) => set({ currentEmbedding: embedding }),
}));
