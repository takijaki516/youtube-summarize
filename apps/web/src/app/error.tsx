"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-4 text-center">
      <div className="space-y-4">
        <h2 className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-3xl font-bold tracking-tighter text-transparent">
          에러가 발생했어요
        </h2>

        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
          >
            홈 페이지
          </Button>
        </div>
      </div>
    </div>
  );
}
