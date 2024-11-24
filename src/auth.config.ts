import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { env } from "./lib/env";

export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    }),
  ],
} satisfies NextAuthConfig;
