"use client";

import * as React from "react";
import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import type { Video } from "@/lib/db/schema/video";
import { Calendar } from "lucide-react";

interface VideosResponse {
  videos: Video[];
  nextPage: number | null;
  totalCount: number;
}

export function RecentContents() {
  const { ref, inView } = useInView();

  async function fetchVideos({ pageParam = 1 }): Promise<VideosResponse> {
    const response = await fetch(`/api/videos?page=${pageParam}&limit=10`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["videos"],
      queryFn: fetchVideos,
      getNextPageParam: (lastPage) => lastPage.nextPage,
      initialPageParam: 1,
    });

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (status === "pending") {
    return <div>Loading... </div>;
  }

  if (status === "error") {
    return <div>Error loading videos</div>;
  }

  return (
    <div className="flex flex-col">
      <h1 className="mt-32 text-center text-4xl font-bold">Recent Contents</h1>

      <ul className="mt-14 flex flex-col gap-4">
        {data.pages.map((page) =>
          page.videos.map((video: Video) => {
            return (
              <li key={video.id}>
                <div className="rounded-md border border-border p-4 transition-transform duration-200 ease-in hover:scale-[1.02] hover:cursor-pointer hover:border-foreground">
                  <Link href={`/v/${video.id}`}>{video.title}</Link>

                  <div className="flex items-center gap-2">
                    <Calendar className="size-4" />
                    {new Date(video.updatedAt).toLocaleString("ko-KR")}
                  </div>
                </div>
              </li>
            );
          }),
        )}
        <li ref={ref} className="h-10">
          {isFetchingNextPage ? "Loading more..." : null}
        </li>
      </ul>
    </div>
  );
}
