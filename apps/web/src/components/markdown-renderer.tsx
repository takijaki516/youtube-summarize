"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import { useYouTubeStore } from "../lib/store/use-youtube-store";

type MarkdownRendererProps = {
  content: string;
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const { setStartTime } = useYouTubeStore();

  return (
    <div className="prose h-full max-w-none overflow-y-auto p-10 dark:prose-invert">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          a({ href, children }) {
            const hhmmss = (children as string).slice(
              (children as string).length - 8,
            );
            // hhmmss to seconds
            const [hours, minutes, seconds] = hhmmss.split(":").map(Number);
            // TODO: handle undefined
            const timestamp =
              (hours ?? 0) * 3600 + (minutes ?? 0) * 60 + (seconds ?? 0);

            return (
              <span
                onClick={() => setStartTime(timestamp)}
                className="underline underline-offset-2 opacity-80 transition-opacity duration-200 hover:opacity-100"
              >
                {children}
              </span>
            );
          },
          img({ src, alt }) {
            return null;
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
