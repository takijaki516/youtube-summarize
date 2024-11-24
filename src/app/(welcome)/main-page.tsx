"use client";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function MainPage() {
  return (
    <main className="flex flex-col bg-background">
      <section className="w-full pt-28">
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
              className="w-full max-w-md space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            >
              <form className="flex flex-col space-y-4 sm:flex-row sm:space-x-2 sm:space-y-0">
                <Input
                  className="flex-1"
                  placeholder="Paste YouTube URL here"
                  type="url"
                />
                <Button type="submit" size="lg">
                  Summarize
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
