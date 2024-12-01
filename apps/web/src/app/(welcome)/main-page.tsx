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

  const generateSummary = async () => {
    try {
      setIsLoading(true);

      const res = await fetch("/api/temp", {
        method: "POST",
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        if (res.status === 429) {
          toast.error(
            "Rate limit exceeded. Please try again later, or Sign up for more requests.",
          );
          return;
        }

        toast.error("Failed to generate summary");
        return;
      }

      const { vId } = await res.json();
      router.push(`/temp/${vId}`);
    } catch (error) {
      toast.error("Not possible to generate summary");
    } finally {
      setIsLoading(false);
    }
  };

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
                Summarize YouTube Videos In Seconds
              </span>
            </motion.h1>

            <motion.p
              className="max-w-[700px] text-xl text-foreground md:text-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              Get concise summaries of any YouTube video using our advanced
              AI-powered transcript summarizer.
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
                onClick={generateSummary}
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
