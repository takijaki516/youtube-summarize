import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <h2 className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text pb-8 text-5xl font-bold text-transparent">
        404 - 존재하지 않는 페이지
      </h2>

      <p className="mx-auto max-w-[500px] pb-8 text-xl text-muted-foreground">
        죄송합니다. 요청하신 페이지를 찾을 수 없습니다.
      </p>

      <div className="flex justify-center gap-4">
        <Button
          asChild
          className="bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600"
        >
          <Link href="/">홈페이지</Link>
        </Button>
      </div>
    </div>
  );
}
