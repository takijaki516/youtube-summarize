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
            if (!href) {
              return null;
            }

            const timeMatch = href.match(/[?&]t=(\d+)s/);
            const seconds = timeMatch?.[1];

            if (!seconds) {
              return null;
            }

            const timestamp = parseInt(seconds);

            return (
              <span
                onClick={() => setStartTime(timestamp)}
                className="text-green-500 underline underline-offset-2 opacity-70 transition-opacity duration-200 hover:cursor-pointer hover:opacity-100"
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
