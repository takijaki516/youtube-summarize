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
    <div className="mt-16 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold leading-tight tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-800">
        Summaries
      </h1>

      <div className="m-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 ">
        {summaries.map(async (summary) => {
          const videoInfo = await ytdl.getInfo(summary.videoId);

          return (
            videoInfo && (
              <Link href={`/${summary.videoId}`}>
                <Embed
                  thumbnail={videoInfo.videoDetails.thumbnails.reverse()[0].url}
                />
                <div className="flex flex-col space-y-1 mt-4">
                  <div className="flex justify-between">
                    <Badge className="bg-red-600 text-white flex items-center hover:bg-red-600">
                      <Tv className="w-4 h-4 mr-2" />
                      {videoInfo.videoDetails.author.name}
                    </Badge>
                    <Badge className="bg-muted text-muted-foreground text-xs hover:bg-muted">
                      <Eye className="w-4 h-4 mr-2" />
                      {videoInfo.videoDetails.viewCount}
                    </Badge>
                  </div>
                  {/* TODO: animate text */}
                  <h2 className="font-bold truncate">
                    {videoInfo.videoDetails.title}
                  </h2>
                </div>
              </Link>
            )
          );
        })}
      </div>
    </div>
  );
};

export default SummariesPage;
