import { redirect } from "next/navigation";

import { cn } from "@/lib/utils";
import { getSession } from "@/lib/queries/auth";
import { Navbar } from "@/components/navbar";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  if (session) {
    redirect("/u");
  }

  return (
    <div className={cn("flex h-dvh flex-col")}>
      <Navbar />
      {children}
    </div>
  );
}
