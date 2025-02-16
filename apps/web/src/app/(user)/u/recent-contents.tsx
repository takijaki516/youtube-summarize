"use client";

import * as React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { schema } from "@repo/database";

import { useDebounce } from "@/lib/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { VideoCard } from "./video-card";

interface VideosResponse {
  videos: schema.Video[];
  nextPage: number | null;
  totalCount: number;
}

export function RecentContents() {
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
    <div className="flex w-full max-w-3xl flex-col">
      <h1 className="mt-32 text-center text-4xl font-bold">최신 컨텐츠</h1>

      <div className="mt-8 w-full">
        <Input
          type="text"
          placeholder="찾아보기..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md focus:outline-none"
        />
      </div>

      <ul className="mt-14 flex flex-col gap-4">
        {status === "pending" ? (
          <div>찾는중...</div>
        ) : status === "error" ? (
          <div>찾지 못했습니다. 다시 시도해주세요.</div>
        ) : (
          <>
            {data.pages.map((page) =>
              page.videos.map((video: schema.Video) => {
                return (
                  <li key={video.id}>
                    <VideoCard video={video} />
                  </li>
                );
              }),
            )}

            <li ref={ref} className="h-10">
              {isFetchingNextPage ? "더 보기" : null}
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
