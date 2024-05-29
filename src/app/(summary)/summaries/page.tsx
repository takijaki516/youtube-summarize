import Link from "next/link";
import ytdl from "ytdl-core";
import { Eye, Tv } from "lucide-react";

import { prismaDB } from "@/lib/prisma-db";
import { Embed } from "@/components/embed";
import { Badge } from "@/components/ui/badge";

const SummariesPage = async () => {
  const summaries = await prismaDB.videos.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  if (!summaries) {
    return (
      <section>
        <div>
          <h1>No Data Found</h1>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div>
        {summaries.map(async (summary) => {
          const videoInfo = await ytdl.getInfo(summary.videoId);

          return (
            videoInfo && (
              <Link href={`/${summary.videoId}`}>
                <div>
                  <Embed
                    thumbnail={
                      videoInfo.videoDetails.thumbnails.reverse()[0].url
                    }
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
                      <Badge>
                        <Eye />
                        {videoInfo.videoDetails.viewCount}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Link>
            )
          );
        })}
      </div>
    </section>
  );
};

export default SummariesPage;
