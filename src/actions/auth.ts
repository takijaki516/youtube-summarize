"use server";

import { signIn as nextauthSignIn } from "@/auth";

export async function googleSignIn() {
  await nextauthSignIn("google");
}
