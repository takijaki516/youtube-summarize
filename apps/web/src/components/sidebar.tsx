import { redirect } from "next/navigation";

import { getSession } from "@/lib/queries/auth";
import { ModeToggle } from "./theme-toggle";
import { SidebarDashboardButton } from "./sidebar-dashboard-button";
import { AddVideoDialog } from "./sidebar-add-button";
import { SidebarUserButton } from "./sidebar-user-button";
import { TooltipProvider } from "@/components/ui/tooltip";

export async function Sidebar() {
  const session = await getSession();

  if (!session) {
    return redirect("/");
  }

  return (
    <TooltipProvider delayDuration={100} disableHoverableContent>
      <nav className="flex h-full w-16 flex-col items-center justify-center gap-4 border-r bg-background">
        <SidebarDashboardButton />
        <AddVideoDialog />
        <SidebarUserButton />
        <ModeToggle side="right" align="start" />
      </nav>
    </TooltipProvider>
  );
}
