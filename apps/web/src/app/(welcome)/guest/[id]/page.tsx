import { cookies } from "next/headers";
import { and, eq } from "drizzle-orm";
import { drizzleClient, schema } from "@repo/database";

import { MarkdownRenderer } from "@/components/markdown-renderer";
import { YouTubePlayer } from "@/components/youtube-player";
import { ResizableView } from "@/components/resizable-view";

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

  const summary =
    video[0].originalTranscriptLanguage !== "ko"
      ? video[0].translatedSummary
      : video[0].summary;

  if (!summary) {
    return <div>Not found</div>;
  }

  return (
    <main className="container h-full flex-1 overflow-hidden">
      <ResizableView>
        <YouTubePlayer videoId={video[0].videoId} />
        <MarkdownRenderer content={summary} />
      </ResizableView>
    </main>
  );
}
