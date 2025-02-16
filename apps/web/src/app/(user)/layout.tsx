import { redirect } from "next/navigation";

import { getSession } from "@/lib/queries/auth";
import { QueryProviders } from "@/components/query-provider";
import { Sidebar } from "@/components/sidebar";
import { Toaster } from "@/components/ui/sonner";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    return redirect("/");
  }

  return (
    <QueryProviders>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        {children}
        <Toaster richColors={true} />
      </div>
    </QueryProviders>
  );
}
