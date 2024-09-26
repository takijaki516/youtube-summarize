import React from "react";
import ReactMarkdown from "react-markdown";

type MarkdownRendererProps = {
  content: string;
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose max-w-none overflow-y-auto p-10 dark:prose-invert">
      <ReactMarkdown
      // remarkPlugins={[remarkGfm]}
      // components={{
      //   code({ node, inline, className, children, ...props }) {
      //     const match = /language-(\w+)/.exec(className || "");
      //     return !inline && match ? (
      //       <SyntaxHighlighter
      //         style={atomDark}
      //         language={match[1]}
      //         PreTag="div"
      //         {...props}
      //       >
      //         {String(children).replace(/\n$/, "")}
      //       </SyntaxHighlighter>
      //     ) : (
      //       <code className={className} {...props}>
      //         {children}
      //       </code>
      //     );
      //   },
      // }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
