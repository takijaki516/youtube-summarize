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
    <section className="container mt-10 flex flex-col w-screen items-start gap-5">
      <div
        className="flex flex-row w-full flex-wrap items-center justify-center
      gap-3 md:justify-start md:gap-10"
      >
        {videos.map(async (video) => {
          const videoInfo = await ytdl.getInfo(video.videoId);

          return (
            videoInfo && (
              <Link
                href={`/${video.id}`}
                className="w-full rounded-xl bg-secondary p-2 transition-all
              duration-200 hover:-translate-y-1 md:w-auto"
              >
                <VideoWidget
                  title={videoInfo.videoDetails.title}
                  thumbnail={videoInfo.videoDetails.thumbnails.reverse()[0].url}
                />
              </Link>
            )
          );
        })}

        <Button
          variant={"link"}
          asChild
          className="text-xs text-muted-foreground mx-auto"
        >
          <Link
            href={"/summaries"}
            className="group underline decoration-muted-foreground/50 underline-offset-4"
          >
            View More
            <MoveRight className="ml-2 size-4 transition-all duration-200 group-hover:ml-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default SummariesPage;
