import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { drizzleClient, schema } from "@repo/database";
import { NoContent } from "./no-content";
import { RecentContents } from "./recent-contents";
import { getSession } from "@/lib/queries/auth";

export const dynamic = "force-dynamic";

export default async function UserHomepage() {
  const session = await getSession();

  if (!session) {
    return redirect("/");
  }

  const recentVideos = await drizzleClient
    .select()
    .from(schema.videosSchema)
    .where(eq(schema.videosSchema.userId, session.user.id));

  return (
    <main className="flex flex-1 flex-col items-center overflow-auto bg-background px-4">
      {recentVideos.length > 0 ? <RecentContents /> : <NoContent />}
    </main>
  );
}
