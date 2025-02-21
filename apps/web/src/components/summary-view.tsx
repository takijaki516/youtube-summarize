"use client";

import * as React from "react";

import { MarkdownRenderer } from "@/components/markdown-renderer";
import { YouTubePlayer } from "@/components/youtube-player";
import { ResizableView } from "@/components/resizable-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SummaryViewProps {
  translatedSummary: string | null;
  originalSummary: string;
  originalLanguage: string;
  videoId: string;
}

export function SummaryView({
  originalSummary,
  translatedSummary,
  originalLanguage,
  videoId,
}: SummaryViewProps) {
  return (
    <ResizableView>
      <YouTubePlayer videoId={videoId} />

      <Tabs defaultValue={originalLanguage}>
        <TabsList className="flex w-full items-center justify-center gap-1 rounded-none bg-background">
          <TabsTrigger className="border border-muted" value={originalLanguage}>
            {originalLanguage}
          </TabsTrigger>
          {translatedSummary && (
            <TabsTrigger className="border border-muted" value="ko">
              ko
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value={originalLanguage}>
          <MarkdownRenderer content={originalSummary} />
        </TabsContent>
        {translatedSummary && (
          <TabsContent value="ko">
            <MarkdownRenderer content={translatedSummary} />
          </TabsContent>
        )}
      </Tabs>
    </ResizableView>
  );
}
