"use client";

import * as React from "react";

import { MarkdownRenderer } from "@/components/markdown-renderer";
import { YouTubePlayer } from "@/components/youtube-player";
import { ResizableView } from "@/components/resizable-view";

interface SummaryViewProps {
  summary: string;
  videoId: string;
}

export function SummaryView({ summary, videoId }: SummaryViewProps) {
  return (
    <ResizableView>
      <YouTubePlayer videoId={videoId} />
      <MarkdownRenderer content={summary} />
    </ResizableView>
  );
}
