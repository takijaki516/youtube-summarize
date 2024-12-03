"use client";

import { useRouter } from "next/navigation";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SidebarHomeButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push("/")}
      variant="ghost"
      size="icon"
      className="cursor-pointer"
    >
      <Home />
    </Button>
  );
}
