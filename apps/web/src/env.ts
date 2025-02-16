import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  server: {
    GEMINI_API_KEY: z.string().min(1),
    AUTH_GOOGLE_SECRET: z.string().min(1),
    AUTH_GOOGLE_ID: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().url(),
    DATABASE_URL: z.string().min(1),
    NODE_ENV: z.enum(["development", "production", "test"]),
    MY_PROXY_URL: z.string().min(1),
    GOOGLE_YOUTUBE_API_KEY: z.string().min(1),
  },
  client: {},
  runtimeEnv: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    MY_PROXY_URL: process.env.MY_PROXY_URL,
    GOOGLE_YOUTUBE_API_KEY: process.env.GOOGLE_YOUTUBE_API_KEY,
  },
});
