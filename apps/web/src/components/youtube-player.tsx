"use client";

import { useYouTubeStore } from "../lib/store/use-youtube-store";
import * as React from "react";

export const YouTubePlayer = React.memo(({ videoId }: { videoId: string }) => {
  const { startTime, setStartTime } = useYouTubeStore();
  const playerRef = React.useRef<YT.Player | null>(null);
  const videoIdRef = React.useRef<string | null>(videoId);

  React.useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

    if (!window.YT) {
      // YouTube's API will call onYouTubeIframeAPIReady automatically
      window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      // API already loaded, call initPlayer immediately
      initPlayer();
    }

    function initPlayer() {
      // NOTE: useEffect's cleanup function will destroy the player when effect re-runs
      // if (playerRef.current) {
      //   playerRef.current.destroy();
      // }

      if (!playerRef.current) {
        playerRef.current = new YT.Player("youtube-player", {
          videoId: videoId,
          playerVars: {
            origin: window.location.origin,
          },
          events: {
            onReady: onPlayerReady,
          },
        });
      }
    }

    function onPlayerReady(event: YT.PlayerEvent) {
      if (startTime > 0) {
        event.target.seekTo(startTime, true);
      }
    }

    return () => {
      // NOTE: only destroy when component unmounts or videoId changes
      if (playerRef.current && videoIdRef.current !== videoId) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [videoId, startTime]);

  React.useEffect(() => {
    if (playerRef.current && playerRef.current.seekTo) {
      playerRef.current.seekTo(startTime, true);
    }
  }, [startTime]);

  return (
    <div className="aspect-video">
      <div id="youtube-player" className="h-full w-full"></div>
    </div>
  );
});

YouTubePlayer.displayName = "YouTubePlayer";
