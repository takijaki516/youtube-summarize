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
    <section>
      <div>
        <div>
          <div>
            <Embed
              thumbnail={videoInfo.videoDetails.thumbnails.reverse()[0].url}
            />
            <div>
              <h1>{videoInfo.videoDetails.title}</h1>
              <p>
                {videoInfo.videoDetails.description &&
                videoInfo.videoDetails.description?.length > 100
                  ? videoInfo.videoDetails.description
                      ?.slice(0, 100)
                      .concat("...")
                  : videoInfo.videoDetails.description}
              </p>
              <div>
                <Badge>
                  <Tv />
                  {videoInfo.videoDetails.author.name}
                </Badge>
                <Badge variant={"outline"}>
                  <Eye />
                  {videoInfo.videoDetails.viewCount}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <div>
          {videoSummary.summary}
          <RegenerateSummary videoId={videoSummary.videoId} />
        </div>
      </div>

      <div>
        {/* REVIEW: 만약summary가 없다면? */}
        <FactCheck summary={videoSummary.summary!} />
      </div>
    </section>
  );
};

export default VideoSummaryPage;
