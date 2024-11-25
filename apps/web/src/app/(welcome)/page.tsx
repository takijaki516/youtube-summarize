import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { MainPage } from "./main-page";

export default async function WelcomePage() {
  const session = await auth();

  if (session) {
    redirect("/u");
  }

  return <MainPage />;
}
