import { cookies } from "next/headers";
import { and, eq } from "drizzle-orm";
import { drizzleClient, schema } from "@repo/database";

import { SummaryView } from "@/components/summary-view";

export default async function GuestPage({
  params,
}: {
  params: { id: string };
}) {
  const cookieStore = cookies();
  const clientUUID = cookieStore.get("clientUUID")?.value;

  if (!clientUUID) {
    return <div>Not found</div>;
  }

  const video = await drizzleClient
    .select()
    .from(schema.tempVideosSchema)
    .where(
      and(
        eq(schema.tempVideosSchema.id, Number(params.id)),
        eq(schema.tempVideosSchema.clientUUID, clientUUID),
      ),
    )
    .limit(1);

  if (!video[0]) {
    return <div>Not found</div>;
  }

  const { originalTranscriptLanguage, translatedSummary, summary } = video[0];

  if (!summary) {
    return <div>error</div>;
  }

  return (
    <main className="container h-full flex-1 overflow-hidden">
      <SummaryView
        videoId={video[0].videoId}
        originalLanguage={originalTranscriptLanguage}
        originalSummary={summary}
        translatedSummary={translatedSummary}
      />
    </main>
  );
}
