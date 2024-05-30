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
      id: params.id,
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
        <div className="flex flex-col items-start bg-secondary p-5">
          <div
            className="flex flex-col w-full items-center 
          justify-between gap-5 md:flex-row md:items-center"
          >
            <Embed
              thumbnail={videoInfo.videoDetails.thumbnails.reverse()[0].url}
            />

            <div className="flex w-full flex-col gap-2">
              <h1
                className="text-md text-center font-extrabold
              leading-tight tracking-tighter md:text-left md:text-lg"
              >
                {videoInfo.videoDetails.title}
              </h1>
              <p className="text-center text-xs text-muted-foreground md:text-left">
                {videoInfo.videoDetails.description &&
                videoInfo.videoDetails.description?.length > 100
                  ? videoInfo.videoDetails.description
                      ?.slice(0, 100)
                      .concat("...")
                  : videoInfo.videoDetails.description}
              </p>
              <div
                className="mt-3 flex flex-row items-center justify-center
              gap-4 md:items-center md:justify-start"
              >
                <Badge>
                  <Tv className="size-3 mr-2" />
                  {videoInfo.videoDetails.author.name}
                </Badge>

                <Badge variant={"outline"}>
                  <Eye className="size-3 mr-2" />
                  {videoInfo.videoDetails.viewCount}
                </Badge>
              </div>
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

      <div className="flex w-full flex-col gap-10">
        <FactCheck summary={videoSummary.summary!} />
      </div>
    </section>
  );
};

export default VideoSummaryPage;
