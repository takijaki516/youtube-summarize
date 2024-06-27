import Link from "next/link";
import { MoveRight } from "lucide-react";
import ytdl from "ytdl-core";

import { prismaDB } from "@/lib/prisma-db";
import { VideoWidget } from "@/components/video-widget";
import { Button } from "@/components/ui/button";

const SummariesPage = async () => {
  const videos = await prismaDB.videos.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  });

  return (
    // REVIEW: container 관련
    <section className="container mt-10 flex flex-col md:max-w-screen-md items-center justify-center gap-5">
      {videos.map(async (video) => {
        const videoInfo = await ytdl.getInfo(video.videoId);

        return (
          videoInfo && (
            <Link
              href={`/${video.videoId}`}
              className="w-full rounded-xl bg-secondary p-2 transition-all
              duration-200 hover:-translate-y-1 "
            >
              <VideoWidget
                title={videoInfo.videoDetails.title}
                thumbnail={videoInfo.videoDetails.thumbnails.reverse()[0].url}
              />
            </Link>
          )
        );
      })}
    </section>
  );
};

export default SummariesPage;
