"use server";

import { signIn as nextauthSignIn, signOut } from "@/auth";

export async function googleSignIn() {
  await nextauthSignIn("google");
}

export async function signOutAction() {
  await signOut();
}
