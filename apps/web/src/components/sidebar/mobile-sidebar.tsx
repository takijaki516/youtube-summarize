"use client";

import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarHomeButton } from "./sidebar-home-button";
import { SidebarTranscriptVideo } from "./transcript-video";
import { SidebarAISetting } from "./ai-setting";
import { ModeToggle } from "../theme-toggle";

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild className="sm:hidden absolute top-2 left-2">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="flex w-[80px] flex-col items-center justify-center p-0"
      >
        <SidebarHomeButton />
        <SidebarTranscriptVideo />
        <SidebarAISetting />
        <ModeToggle side="right" align="start" />
      </SheetContent>
    </Sheet>
  );
}
