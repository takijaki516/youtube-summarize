import { eq } from "drizzle-orm";

import { dbDrizzle, videosSchema } from "@repo/database";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { YouTubePlayer } from "@/components/youtube-player";
import { ResizableView } from "@/components/resizable-view";
import { getYouTubeVideoId } from "@/lib/utils";

export default async function VideoPage({
  params,
}: {
  params: { id: string };
}) {
  const video = await dbDrizzle
    .select()
    .from(videosSchema)
    .where(eq(videosSchema.id, Number(params.id)))
    .limit(1);

  if (!video[0]) {
    return <div>Not found</div>;
  }

  return (
    <main className="flex flex-1 items-center bg-background">
      <ResizableView>
        {getYouTubeVideoId(video[0].url) ? (
          <YouTubePlayer videoId={getYouTubeVideoId(video[0].url)!} />
        ) : (
          <div>Not found</div>
        )}

        <MarkdownRenderer content={video[0].summary} />
      </ResizableView>
    </main>
  );
}
