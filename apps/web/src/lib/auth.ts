import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { schema, drizzleClient } from "@repo/database";

import { env } from "@/env";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    },
  },
  database: drizzleAdapter(drizzleClient, {
    provider: "pg",
    schema: {
      user: schema.user,
      verification: schema.verification,
      session: schema.session,
      account: schema.account,
    },
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  plugins: [nextCookies()],
});
