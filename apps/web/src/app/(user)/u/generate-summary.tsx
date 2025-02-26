"use client";

import * as React from "react";
import { BotMessageSquare, Info, Send } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { type Message, useChat } from "ai/react";

import { TRANSCRIPT_STATUS_KEYS } from "@/types/types";
import { cn } from "@/lib/utils";
import { TranscriptStatus } from "@/components/transcript-status";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface GenerateSummaryProps {
  count: number;
}

export function GenerateSummary({ count }: GenerateSummaryProps) {
  const router = useRouter();
  const [videoUrl, setVideoUrl] = React.useState("");
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const { messages, handleSubmit, data, setData, setMessages, stop } = useChat({
    api: "/api/transcript",
    credentials: "same-origin",
    onError: () => {
      stop();
      toast.error(
        "해당 영상 요약에 실패하였어요. 다른 영상을 시도해보세요.\n 요약실패시 횟수를 차감하지 않아요.",
      );
      setIsSheetOpen(false);
    },
    onResponse: (response) => {
      if (response.status === 429) {
        stop();
        toast.error("한도 초과입니다. 24시간 주기로 초기화 됩니다.");
        setIsSheetOpen(false);
      }
    },
  });

  // NOTE: for auto scroll
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  // NOTE: custom data
  let currentStepData = (data?.[data?.length - 1] as string) ?? "1-";

  const [currentStepKey, currentStepValue] = currentStepData.split("-") as [
    (typeof TRANSCRIPT_STATUS_KEYS)[number],
    string | undefined,
  ];

  if (currentStepKey === "6") {
    stop();
    router.push(`/v/${currentStepValue}`);
    return null;
  }

  return (
    <div className="flex w-full max-w-3xl flex-col items-center">
      <div className="mt-20 max-w-md text-4xl md:text-5xl lg:text-6xl">
        <h1 className="text-center text-foreground">
          원하는 영상을
          <br /> 요약해보세요!
        </h1>
      </div>

      <form
        className="relative mt-10 flex w-full max-w-md flex-col gap-2 text-center"
        onSubmit={(e) => {
          setData(undefined);
          setMessages([]);
          handleSubmit(e, {
            body: {
              videoUrl: videoUrl,
            },
            allowEmptySubmit: true,
          });

          setIsSheetOpen(true);
        }}
      >
        <Input
          placeholder="유튜브 영상 URL을 입력하세요"
          type="url"
          className="w-full border-primary/80 focus:border-none"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />

        <Button
          className="absolute right-0 top-0 hover:bg-primary hover:text-primary-foreground"
          size="icon"
          variant={"ghost"}
          type="submit"
        >
          <Send />
        </Button>
      </form>

      <div className="mt-2 flex w-full max-w-md items-center justify-center gap-2 text-sm text-muted-foreground/70">
        <div className="flex gap-0.5">
          <span>요청횟수</span>
          <span>{count}/10</span>
        </div>

        <span>|</span>

        <div className="flex items-center gap-1">
          <Info className="size-4" />
          <span>현재는 30분 이하의 동영상만 처리 가능합니다.</span>
        </div>
      </div>

      {/* NOTE: set max height */}
      <Sheet open={isSheetOpen}>
        <SheetContent
          side="bottom"
          className="flex h-5/6 flex-col items-center"
        >
          <SheetHeader>
            <SheetTitle className="sr-only">프리뷰</SheetTitle>
          </SheetHeader>

          <div className="flex h-full flex-col items-center gap-4">
            {/* status */}
            <TranscriptStatus currentStatus={currentStepKey} />

            <div
              className={cn(
                "relative w-full max-w-lg overflow-y-auto rounded-md",
                {
                  "border-4": messages?.length > 0,
                  "before:absolute before:inset-0 before:z-10 before:backdrop-blur-sm":
                    parseInt(currentStepKey) >= 4,
                },
              )}
            >
              {parseInt(currentStepKey) >= 4 && (
                <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
                  <BotMessageSquare className="size-16 animate-pulse text-primary/80" />
                </div>
              )}
              <div className="h-full overflow-y-auto" ref={messagesEndRef}>
                {messages?.map((m: Message, idx) => {
                  if (m.role === "assistant") {
                    return <div key={idx}>{m.content}</div>;
                  }
                })}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
