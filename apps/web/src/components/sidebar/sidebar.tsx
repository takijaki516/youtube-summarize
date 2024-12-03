import { ModeToggle } from "@/components/theme-toggle";
import { SidebarTranscriptVideo } from "./transcript-video";
import { SidebarAISetting } from "./ai-setting";
import { SidebarHomeButton } from "./sidebar-home-button";

export function Sidebar() {
  return (
    <nav className="hidden h-full w-16 flex-col items-center justify-center gap-4 border-r sm:flex">
      <SidebarHomeButton />
      <SidebarTranscriptVideo />
      <SidebarAISetting />
      <ModeToggle side="right" align="start" />
    </nav>
  );
}
