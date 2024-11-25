import { redirect } from "next/navigation";

import { auth } from "../auth";
import { ModeToggle } from "./theme-toggle";
import { SidebarDashboardButton } from "./sidebar-dashboard-button";
import { AddVideoDialog } from "./sidebar-add-button";
import { SidebarUserButton } from "./sidebar-user-button";
import { TooltipProvider } from "./ui/tooltip";

export async function Sidebar() {
  const session = await auth();

  if (!session || !session.user) {
    return redirect("/");
  }

  return (
    <TooltipProvider delayDuration={100} disableHoverableContent>
      <nav className="flex h-full w-16 flex-col items-center justify-center gap-4 border-r bg-background">
        <SidebarDashboardButton />

        <AddVideoDialog />

        <SidebarUserButton session={session} />

        <ModeToggle side="right" align="start" />
      </nav>
    </TooltipProvider>
  );
}
