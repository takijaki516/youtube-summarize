"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";

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
        // remarkPlugins={[remarkGfm]}
        components={{
          // code({ node, inline, className, children, ...props }) {
          //   const match = /language-(\w+)/.exec(className || "");
          //   return !inline && match ? (
          //     <SyntaxHighlighter
          //       style={atomDark}
          //       language={match[1]}
          //       PreTag="div"
          //       {...props}
          //     >
          //       {String(children).replace(/\n$/, "")}
          //     </SyntaxHighlighter>
          //   ) : (
          //     <code className={className} {...props}>
          //       {children}
          //     </code>
          //   );
          // },

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
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
