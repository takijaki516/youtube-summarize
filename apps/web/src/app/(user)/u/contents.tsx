"use client";

import * as React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { schema } from "@repo/database";

import { useDebounce } from "@/lib/hooks/use-debounce";
import { VideoCard } from "./video-card";
import { Input } from "@/components/ui/input";

interface VideosResponse {
  videos: schema.Video[];
  nextPage: number | null;
  totalCount: number;
}

export function Contents() {
  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search, 500);
  const { ref, inView } = useInView();

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

  return (
    <div className="flex w-full max-w-lg flex-col items-center">
      <Input
        type="text"
        placeholder="제목으로 검색..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mt-8 w-full max-w-sm rounded-md focus:outline-none"
      />

      <ul className="mt-8 flex w-full max-w-lg flex-col gap-4">
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
              {isFetchingNextPage ? "로딩중..." : null}
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
