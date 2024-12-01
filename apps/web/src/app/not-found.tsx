import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <h2 className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text pb-8 text-5xl font-bold text-transparent">
        404 - Page Not Found
      </h2>

      <p className="mx-auto max-w-[500px] pb-8 text-xl text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <div className="flex justify-center gap-4">
        <Button
          asChild
          className="bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600"
        >
          <Link href="/">Go back home</Link>
        </Button>
      </div>
    </div>
  );
}
