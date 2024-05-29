import ytdl from "ytdl-core";

import { prismaDB } from "@/lib/prisma-db";

interface IVideoSummaryPageProps {
  params: { id: string };
}
const VideoSummaryPage = async ({ params }: IVideoSummaryPageProps) => {
  const videoSummary = await prismaDB.summaries.findMany({
    where: {
      videoId: params.id,
    },
    take: 1,
    select: {
      Video: {
        select: {
          videoId: true,
        },
      },
    },
  });

  const videoInfo = await ytdl.getInfo(videoSummary[0].Video.videoId);
};

export default VideoSummaryPage;
