"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import { useYouTubeStore } from "@/lib/store/use-youtube-store";
import { Button } from "./ui/button";

type MarkdownRendererProps = {
  content: string;
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const { setStartTime } = useYouTubeStore();

  return (
    <div className="prose max-w-none overflow-y-auto p-10 dark:prose-invert">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          a({ href, children }) {
            const hhmmss = (children as string).slice(
              (children as string).length - 8,
            );
            // hhmmss to seconds
            const [hours, minutes, seconds] = hhmmss.split(":").map(Number);
            const timestamp = hours * 3600 + minutes * 60 + seconds;

            return (
              <Button onClick={() => setStartTime(timestamp)}>
                {children}
              </Button>
            );
          },
          br({ children }) {
            return <br />;
          },
          hr: () => <hr className="my-4 border-t border-gray-300" />,
          p: ({ node, ...props }) => <p className="mb-4" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
