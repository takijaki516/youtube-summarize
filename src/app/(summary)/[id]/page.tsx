import ytdl from "ytdl-core";

import { prismaDB } from "@/lib/prisma-db";
import { Embed } from "@/components/embed";
import { Badge } from "@/components/ui/badge";
import { Eye, Tv } from "lucide-react";
import { RegenerateSummary } from "@/components/regenerate-summary";
import { FactCheck } from "@/components/fact-check";

interface IVideoSummaryPageProps {
  params: { id: string };
}
const VideoSummaryPage = async ({ params }: IVideoSummaryPageProps) => {
  const videoSummary = await prismaDB.videos.findUnique({
    where: {
      videoId: params.id,
    },
  });

  if (!videoSummary) {
    return (
      <section>
        <div>
          <h1>NO SUMMARY</h1>
          <p>No summary found for this video.</p>
        </div>
      </section>
    );
  }

  const videoInfo = await ytdl.getInfo(videoSummary.videoId);

  return (
    <section className="container mt-10 grid w-full grid-cols-1 gap-10 md:grid-cols-3">
      <div className="flex flex-col gap-10 md:col-span-2">
        <div className="flex flex-col items-start bg-muted rounded-md p-5 w-full justify-between gap-5 md:flex-row">
          <Embed
            // REVIEW: 왜 reverse? 여러개임?
            thumbnail={videoInfo.videoDetails.thumbnails.reverse()[0].url}
          />

          <div className="flex w-full flex-col gap-2">
            <h1
              className="text-md font-extrabold leading-tight tracking-tighter md:text-lg"
            >
              {videoInfo.videoDetails.title}
            </h1>

            <div
              className="mt-3 flex flex-row gap-4"
            >
              <Badge className="bg-red-600 text-white flex items-center hover:bg-red-600">
                <Tv className="size-3 mr-2" />
                {videoInfo.videoDetails.author.name}
              </Badge>

              <Badge className="bg-background text-muted-foreground text-xs hover:bg-background">
                <Eye className="size-3 mr-2" />
                {videoInfo.videoDetails.viewCount}
              </Badge>
            </div>
          </div>
        </div>

        <div
          className="flex flex-col w-full items-start gap-5 rounded-xl p-5
        text-justify outline-dashed outline-2 outline-secondary md:text-left"
        >
          {videoSummary.summary}
          <RegenerateSummary videoId={videoSummary.videoId} />
        </div>
      </div>

      <div className="flex h-fit">
        <FactCheck summary={videoSummary.summary!} />
      </div>
    </section>
  );
};

export default VideoSummaryPage;
