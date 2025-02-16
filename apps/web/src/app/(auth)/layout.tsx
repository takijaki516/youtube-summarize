import { redirect } from "next/navigation";

import { getSession } from "@/lib/queries/auth";
import { Navbar } from "@/components/navbar";
import { cn } from "@/lib/utils";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (session) {
    return redirect("");
  }

  return (
    <div className={cn("flex h-dvh flex-col")}>
      <Navbar />
      {children}
    </div>
  );
}
