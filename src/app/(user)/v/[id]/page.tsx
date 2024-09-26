import { eq } from "drizzle-orm";

import { MarkdownRenderer } from "@/components/markdown-renderer";
import { dbDrizzle } from "@/lib/db/drizzle";
import { videos } from "@/lib/db/schema/video";
import { YouTubePlayer } from "@/components/youtube-player";
import { ResizableView } from "@/components/resizable-view";

export default async function ChagePage({
  params,
}: {
  params: { id: string };
}) {
  const video = await dbDrizzle
    .select()
    .from(videos)
    .where(eq(videos.id, +params.id))
    .limit(1);

  // console.log("🚀 ~ file: page.tsx:17 ~ video:", video);
  // console.log("🚀 ~ file: page.tsx:17 ~ video:", video[0]);
  // console.log("🚀 ~ file: page.tsx:17 ~ video:", video.length);

  const VID = getYouTubeVideoId(video[0].url!);
  console.log("🚀 ~ file: page.tsx:24 ~ VID:", VID);

  return (
    <main className="flex flex-1 items-center bg-background">
      <ResizableView>
        {!VID ? <div>Not found</div> : <YouTubePlayer videoId={VID} />}

        {!video[0] ? (
          <div>Not found</div>
        ) : (
          <MarkdownRenderer content={video[0].summary!} />
        )}
      </ResizableView>
    </main>
  );
}

function getYouTubeVideoId(url: string) {
  const regex = /v=([^&]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
