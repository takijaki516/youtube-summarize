"use client";

import * as React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import type { Video } from "@repo/database";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { VideoCard } from "@/components/video-card";

interface VideosResponse {
  videos: Video[];
  nextPage: number | null;
  totalCount: number;
}

export function RecentPage() {
  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search, 500);
  const { ref, inView } = useInView();

  async function fetchVideos({ pageParam = 1 }): Promise<VideosResponse> {
    const response = await fetch(
      `/api/videos?page=${pageParam}&limit=10&search=${encodeURIComponent(
        debouncedSearch,
      )}`,
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["videos", debouncedSearch],
      queryFn: fetchVideos,
      getNextPageParam: (lastPage) => lastPage.nextPage,
      initialPageParam: 1,
    });

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div className="flex w-full flex-1 flex-col items-center px-4">
      <h1 className="animate-gradient mt-32 inline-block max-w-3xl bg-gradient-to-r from-red-500 to-white bg-clip-text text-center text-5xl font-bold text-transparent">
        Recent Contents
      </h1>

      <div className="mt-8 w-full max-w-lg">
        <Input
          type="text"
          placeholder="Search videos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md focus:outline-none"
        />
      </div>

      <ul className="mt-14 flex w-full max-w-lg flex-col gap-4">
        {status === "pending" ? (
          <div>Loading...</div>
        ) : status === "error" ? (
          <div>Error loading videos</div>
        ) : (
          <>
            {data.pages.map((page) =>
              page.videos.map((video: Video) => {
                return (
                  <li key={video.id} className="w-full">
                    <VideoCard video={video} />
                  </li>
                );
              }),
            )}

            <li ref={ref} className="h-10">
              {isFetchingNextPage ? "Loading more..." : null}
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
