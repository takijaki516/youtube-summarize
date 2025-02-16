import { eq } from "drizzle-orm";
import { drizzleClient, schema } from "@repo/database";

import { MarkdownRenderer } from "@/components/markdown-renderer";
import { YouTubePlayer } from "@/components/youtube-player";
import { ResizableView } from "@/components/resizable-view";

export default async function VideoPage({
  params,
}: {
  params: { id: string };
}) {
  const video = await drizzleClient
    .select()
    .from(schema.videosSchema)
    .where(eq(schema.videosSchema.id, Number(params.id)))
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
    <main className="flex flex-1 items-center bg-background">
      <ResizableView>
        <YouTubePlayer videoId={video[0].videoId} />
        <MarkdownRenderer content={summary} />
      </ResizableView>
    </main>
  );
}
