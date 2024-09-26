"use client";

import * as React from "react";

type YouTubePlayerProps = {
  videoId: string;
};

export const YouTubePlayer = React.memo(({ videoId }: YouTubePlayerProps) => {
  const playerRef = React.useRef<any>(null);

  React.useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new YT.Player("youtube-player", {
        videoId: videoId,
        events: {
          onStateChange: onPlayerStateChange,
        },
      });
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  const onPlayerStateChange = (event: YT.OnStateChangeEvent) => {};

  return (
    <div className="aspect-video pt-10">
      <div id="youtube-player" className="h-full w-full"></div>
    </div>
  );
});

YouTubePlayer.displayName = "YouTubePlayer";
