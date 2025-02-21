"use client";

import * as React from "react";
import { Star } from "lucide-react";
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
          h1({ node, children, ...props }) {
            return (
              <h1 className="mb-6 text-2xl font-medium sm:text-3xl" {...props}>
                <div className="flex items-start gap-px text-pink-500">
                  <Star className="size-4" />
                  <Star className="size-4" />
                  <Star className="size-4" />
                </div>
                {children}
              </h1>
            );
          },
          h2({ node, children, ...props }) {
            return (
              <h2 className="mb-2 text-lg font-medium sm:text-xl" {...props}>
                <div className="flex items-start gap-px text-pink-500">
                  <Star className="size-4" />

                  <Star className="size-4" />
                </div>
                {children}
              </h2>
            );
          },
          h3({ node, children, ...props }) {
            return (
              <h3 className="mb-1 text-base font-medium sm:text-lg" {...props}>
                <div className="flex items-start gap-px text-pink-500">
                  <Star className="size-4" />
                </div>
                {children}
              </h3>
            );
          },
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
                className="ml-1 underline underline-offset-2 opacity-60 transition-opacity duration-200 hover:cursor-pointer hover:opacity-100"
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
          hr: () => null,
          p: ({ node, ...props }) => <p className="mb-4" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
