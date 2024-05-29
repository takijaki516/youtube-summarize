import Link from "next/link";
import ytdl from "ytdl-core";

import { prismaDB } from "@/lib/prisma-db";

const SummariesPage = async () => {
  const summaries = await prismaDB.summaries.findMany({
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
          const videoInfo = await ytdl.getInfo(summary.videosId);
          return (
            videoInfo && (
              <Link>
                <div></div>
              </Link>
            )
          );
        })}
      </div>
    </section>
  );
};

export default SummariesPage;
