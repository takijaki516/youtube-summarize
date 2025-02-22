"use client";

import { Info } from "lucide-react";
import * as React from "react";
import { motion } from "framer-motion";

import { GuestGenerateSummary } from "./guest-generate-summary";

export default function WelcomePage() {
  return (
    <main className="flex flex-col bg-background py-14">
      <section className="w-full">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center gap-4 text-center">
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
              className="mt-8 max-w-[700px] text-xl text-foreground md:text-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              최신 AI를 활용해 유튜브 동영상을 간결하게 요약해드립니다.
            </motion.p>

            <motion.div
              className="relative flex w-full max-w-md flex-col gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            >
              <GuestGenerateSummary />
            </motion.div>

            <motion.div
              className="flex max-w-md gap-2 text-sm text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
            >
              <Info className="mt-[2px] size-4" />
              <span>
                3무료로 3개의 동영상을 요약해드립니다.
                <br /> 더 많은 요약을 원하시면 로그인해주세요.
              </span>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
