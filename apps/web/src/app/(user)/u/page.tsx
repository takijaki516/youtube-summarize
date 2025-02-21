import { redirect } from "next/navigation";

import { getSession } from "@/lib/queries/auth";
import { GenerateSummary } from "./generate-summary";
import { Contents } from "./contents";
import { drizzleClient, schema } from "@repo/database";
import { eq } from "drizzle-orm";

export default async function UserHomepage() {
  const session = await getSession();

  if (!session) {
    return redirect("/");
  }

  const userLimitStatus = await drizzleClient
    .select({
      count: schema.userRateLimitSchema.count,
    })
    .from(schema.userRateLimitSchema)
    .where(eq(schema.userRateLimitSchema.userId, session.user.id))
    .limit(1);

  return (
    <main className="flex flex-1 flex-col items-center overflow-auto bg-background px-4">
      <GenerateSummary count={userLimitStatus[0]?.count ?? 0} />
      <Contents />
    </main>
  );
}
