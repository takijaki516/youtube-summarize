"use client";

import { Zap, BookOpen, Share2 } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function WelcomePage() {
  return (
    <main className="flex flex-col">
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

            <p className="mx-auto max-w-[700px] text-xl text-gray-700 md:text-2xl">
              Get concise summaries of any YouTube video using our advanced
              AI-powered transcript summarizer.
            </p>

            <div className="w-full max-w-md space-y-4">
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
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-white/50 py-12 backdrop-blur-sm md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter text-gray-900 sm:text-4xl md:text-5xl">
            Key Features
          </h2>
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <Zap className="mb-4 h-12 w-12 text-yellow-500" />
              <h3 className="text-lg font-bold text-gray-900">
                Instant Summaries
              </h3>
              <p className="text-sm text-gray-600">
                Get quick summaries of long videos in seconds.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <BookOpen className="mb-4 h-12 w-12 text-green-500" />
              <h3 className="text-lg font-bold text-gray-900">
                Comprehensive Analysis
              </h3>
              <p className="text-sm text-gray-600">
                AI-powered insights capture the essence of the content.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Share2 className="mb-4 h-12 w-12 text-blue-500" />
              <h3 className="text-lg font-bold text-gray-900">Easy Sharing</h3>
              <p className="text-sm text-gray-600">
                Share summaries with colleagues or on social media.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
