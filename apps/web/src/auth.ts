import NextAuth, { NextAuthResult } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

import { authConfig } from "@/auth.config";
import {
  dbDrizzle,
  accountsSchema,
  sessionsSchema,
  usersSchema,
  verificationTokensSchema,
} from "@repo/database";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
}: NextAuthResult = NextAuth({
  secret: process.env.AUTH_SECRET,
  adapter: DrizzleAdapter(dbDrizzle, {
    usersTable: usersSchema,
    accountsTable: accountsSchema,
    sessionsTable: sessionsSchema,
    verificationTokensTable: verificationTokensSchema,
  }),
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // NOTE: associated with middleware
    // async authorized({ auth, request: { nextUrl } }) {
    //   const isLoggedIn = !!auth?.user;

    //   const isOnLoginPage = nextUrl.pathname.startsWith("/login");
    //   const isOnSignupPage = nextUrl.pathname.startsWith("/signup");
    //   const isOnTempPage = nextUrl.pathname.startsWith("/temp");
    //   const isOnHomePage = nextUrl.pathname === "/";

    //   if (isLoggedIn) {
    //     if (isOnLoginPage || isOnSignupPage) {
    //       return Response.redirect(new URL("/", nextUrl));
    //     }
    //   }

    //   if (!isLoggedIn) {
    //     if (!isOnHomePage && !isOnTempPage) {
    //       // REVIEW: returning false will redirect to login page not sure
    //       return false;
    //     }
    //   }
    // },
    // NOTE: user is available when triggered by signIn or signUp
    async jwt({ token, user }) {
      // first time
      if (user) {
        token = { ...token, id: user.id };
      }

      return token;
    },
    // NOTE: token is only available when using JWT session
    async session({ token, session }) {
      if (token) {
        const { id } = token;
        const { user } = session;
        session = { ...session, user: { ...user, id: id as string } };
      }

      return session;
    },
  },
  ...authConfig,
});
