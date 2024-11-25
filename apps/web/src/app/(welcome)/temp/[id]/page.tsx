import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { dbDrizzle, tempVideosSchema } from "@repo/database";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { YouTubePlayer } from "@/components/youtube-player";
import { ResizableView } from "@/components/resizable-view";
import { getYouTubeVideoId } from "@/lib/utils";

export default async function TempPage({ params }: { params: { id: string } }) {
  const session = await auth();

  if (session) {
    return redirect("/u");
  }

  const video = await dbDrizzle
    .select()
    .from(tempVideosSchema)
    .where(eq(tempVideosSchema.id, Number(params.id)))
    .limit(1);

  if (!video[0]) {
    return <div>Not found</div>;
  }

  return (
    <main className="container h-full flex-1 overflow-hidden">
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
