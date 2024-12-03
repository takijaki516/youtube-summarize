import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOllama } from "ollama-ai-provider";

import { env } from "@/lib/env";
import type { EMBEDDING_PROVIDER, LLM } from "@/lib/store/llm-store";
import { APIKeyNotSetError } from "./llm-error";

interface IsAPIKeySetOptions {
  provider: LLM["provider"];
}

export function isAPIKeySet({ provider }: IsAPIKeySetOptions): boolean {
  switch (provider) {
    case "openai":
      return !!env.OPENAI_API_KEY;
    case "anthropic":
      return !!env.ANTHROPIC_API_KEY;
    case "gemini":
      return !!env.GEMINI_API_KEY;
    default:
      return true;
  }
}

export function providerFactory(provider: LLM["provider"]) {
  if (!isAPIKeySet({ provider })) {
    throw new APIKeyNotSetError(`${provider} API key not set`);
  }

  switch (provider) {
    case "openai":
      return createOpenAI({ apiKey: env.OPENAI_API_KEY });
    case "anthropic":
      return createAnthropic({ apiKey: env.ANTHROPIC_API_KEY });
    case "gemini":
      return createGoogleGenerativeAI({ apiKey: env.GEMINI_API_KEY });
    case "ollama":
      return createOllama({
        baseURL: "http://localhost:11434/api",
      });
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

export function embeddingFactory(provider: EMBEDDING_PROVIDER["provider"]) {
  if (!isAPIKeySet({ provider })) {
    throw new APIKeyNotSetError(`${provider} API key not set`);
  }

  switch (provider) {
    case "openai":
      return createOpenAI({ apiKey: env.OPENAI_API_KEY }).textEmbeddingModel;

    // NOTE: move baseURL to environment variable
    case "ollama":
      return createOllama({
        baseURL: "http://localhost:11434/api",
      }).textEmbeddingModel;

    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}
