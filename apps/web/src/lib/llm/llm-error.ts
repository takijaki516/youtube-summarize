export class LLMError extends Error {
  constructor(message: string) {
    super(`[LLM] 🚨 ${message}`);
  }
}

export class OpenAIError extends LLMError {
  constructor(message: string) {
    super(`[OpenAI] 🚨 ${message}`);
  }
}
