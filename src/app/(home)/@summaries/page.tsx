import Link from "next/link";
import { MoveRight } from "lucide-react";
import ytdl from "ytdl-core";

import { prismaDB } from "@/lib/prisma-db";
import { VideoWidget } from "@/components/video-widget";
import { Button } from "@/components/ui/button";

const SummariesPage = async () => {
  const summaries = await prismaDB.summaries.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  });

  return (
    <section>
      <div>
        {summaries.map(async (summary) => {
          const videoInfo = await ytdl.getInfo(summary.videosId);

          return (
            videoInfo && (
              <Link href={`/${summary.id}`}>
                <VideoWidget
                  title={videoInfo.videoDetails.title}
                  thumbnail={videoInfo.videoDetails.thumbnails.reverse()[0].url}
                />
              </Link>
            )
          );
        })}

        <Button variant={"link"} asChild className="text-xs">
          <Link href={"/summaries"}>
            View More
            <MoveRight className="ml-2 size-3" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default SummariesPage;
