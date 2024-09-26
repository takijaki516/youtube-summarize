"use client";

import { useYouTubeStore } from "@/lib/store/use-youtube-store";
import * as React from "react";

export const YouTubePlayer = React.memo(({ videoId }: { videoId: string }) => {
  const { startTime } = useYouTubeStore();
  const playerRef = React.useRef<YT.Player | null>(null);

  React.useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new YT.Player("youtube-player", {
        videoId: videoId,
        events: {
          onReady: onPlayerReady,
          // onStateChange: onPlayerStateChange,
        },
      });
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  React.useEffect(() => {
    if (playerRef.current && playerRef.current.seekTo) {
      playerRef.current.seekTo(startTime, true);
    }
  }, [startTime]);

  const onPlayerReady = (event: YT.PlayerEvent) => {
    if (startTime > 0) {
      event.target.seekTo(startTime, true);
    }
  };

  // REVIEW: 굳이???
  // const onPlayerStateChange = (event: YT.OnStateChangeEvent) => {
  //   if (event.data === YT.PlayerState.PLAYING) {
  //     const updateTime = () => {
  //       if (playerRef.current && playerRef.current.getCurrentTime) {
  //         setCurrentTime(playerRef.current.getCurrentTime());
  //       }
  //     };

  //     const intervalId = setInterval(updateTime, 1000);

  //     return () => clearInterval(intervalId);
  //   }
  // };

  return (
    <div className="aspect-video pt-10">
      <div id="youtube-player" className="h-full w-full"></div>
    </div>
  );
});

YouTubePlayer.displayName = "YouTubePlayer";
