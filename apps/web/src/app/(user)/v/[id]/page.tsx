import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { drizzleClient, schema } from "@repo/database";

import { getSession } from "@/lib/queries/auth";
import { SummaryView } from "@/components/summary-view";

export default async function VideoPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();

  if (!session) {
    return redirect("/");
  }

  const video = await drizzleClient
    .select()
    .from(schema.videosSchema)
    .where(eq(schema.videosSchema.id, Number(params.id)))
    .limit(1);

  if (!video[0]) {
    return <div>Not found</div>;
  }

  const { originalTranscriptLanguage, id, url, translatedSummary, summary } =
    video[0];

  if (!summary) {
    return <div>ERROR</div>;
  }

  let finalSummary = summary;
  if (originalTranscriptLanguage !== "ko") {
    finalSummary = translatedSummary as string;
  }

  return (
    <main className="flex flex-1 items-center bg-background">
      <SummaryView videoId={video[0].videoId} summary={finalSummary} />
    </main>
  );
}
