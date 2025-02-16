"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Send, RotateCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function MainPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [url, setUrl] = React.useState("");

  async function genSummary() {
    try {
      setIsLoading(true);

      const res = await fetch("/api/guest", {
        method: "POST",
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        if (res.status === 429) {
          toast.error("사용량을 초과하였어요. 잠시 후 다시 시도해주세요");
          return;
        }

        throw new Error("Failed to generate summary");
      }

      const body = await res.json();

      toast.success("성공했어요");
      router.push(`/guest/${body.vId}`);
    } catch (error) {
      toast.error("실패했어요. 다시 시도해주세요");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex flex-col bg-background py-14">
      <section className="w-full">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-10 text-center">
            <motion.h1
              className="max-w-xl text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="animate-gradient inline-block bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent">
                원하는 유튜브 영상의 요약해드릴께요
              </span>
            </motion.h1>

            <motion.p
              className="max-w-[700px] text-xl text-foreground md:text-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              최신 AI를 활용해 유튜브 동영상을 간결하게 요약해드립니다.
            </motion.p>

            <motion.div
              className="relative mt-10 w-full max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            >
              <Input
                type=""
                id="url"
                placeholder="youtube url"
                className="w-full"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />

              <Button
                className="absolute right-0 top-0 mt-0 hover:bg-primary hover:text-primary-foreground"
                size="icon"
                variant={"ghost"}
                onClick={genSummary}
              >
                {isLoading ? <RotateCw className="animate-spin" /> : <Send />}
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
