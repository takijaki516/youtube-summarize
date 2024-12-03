import { TooltipProvider } from "@/components/ui/tooltip";
import { MobileSidebar } from "./mobile-sidebar";
import { Sidebar as NormalSidebar } from "./sidebar";

export async function Sidebar() {
  return (
    <TooltipProvider delayDuration={100} disableHoverableContent>
      <MobileSidebar />
      <NormalSidebar />
    </TooltipProvider>
  );
}
