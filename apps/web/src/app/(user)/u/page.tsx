import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { dbDrizzle, videosSchema } from "@repo/database";
import { NoContent } from "./no-content";
import { RecentContents } from "./recent-contents";

export default async function UserHomepage() {
  const session = await auth();

  if (!session?.user) {
    return redirect("/");
  }

  const recentVideos = await dbDrizzle
    .select()
    .from(videosSchema)
    .where(eq(videosSchema.userId, session.user.id));

  return (
    <main className="mt-20 flex flex-1 flex-col items-center overflow-auto bg-background px-4">
      {recentVideos.length > 0 ? <RecentContents /> : <NoContent />}
    </main>
  );
}
