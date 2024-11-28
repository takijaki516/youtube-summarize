"use client";

import { useYouTubeStore } from "../lib/store/use-youtube-store";
import * as React from "react";

export const YouTubePlayer = React.memo(({ videoId }: { videoId: string }) => {
  const { startTime, setCurrentTime } = useYouTubeStore();
  const playerRef = React.useRef<YT.Player | null>(null);

  React.useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

    if (!window.YT) {
      window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }

    function initPlayer() {
      if (playerRef.current) {
        playerRef.current.destroy();
      }

      playerRef.current = new YT.Player("youtube-player", {
        videoId: videoId,
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    }

    function onPlayerReady(event: YT.PlayerEvent) {
      if (startTime > 0) {
        event.target.seekTo(startTime, true);
      }
    }

    function onPlayerStateChange(event: YT.OnStateChangeEvent) {
      if (event.data === YT.PlayerState.PLAYING) {
        const updateTime = () => {
          if (playerRef.current && playerRef.current.getCurrentTime) {
            setCurrentTime(playerRef.current.getCurrentTime());
          }
        };

        const intervalId = setInterval(updateTime, 1000);

        return () => clearInterval(intervalId);
      }
    }

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new YT.Player("youtube-player", {
        videoId: videoId,
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId, startTime, setCurrentTime]);

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
