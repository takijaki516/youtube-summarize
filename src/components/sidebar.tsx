import { Plus, Clock, Inbox, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./theme-toggle";

export function Sidebar() {
  return (
    <div className="flex h-screen w-16 flex-col border-r bg-background">
      <div className="flex flex-grow flex-col justify-center space-y-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Plus className="h-6 w-6" />
        </Button>

        <Button variant="ghost" size="icon" className="rounded-full">
          <Clock className="h-6 w-6" />
        </Button>

        <Button variant="ghost" size="icon" className="rounded-full">
          <Inbox className="h-6 w-6" />
        </Button>

        <Button variant="ghost" size="icon" className="rounded-full">
          <Flag className="h-6 w-6" />
        </Button>
      </div>

      <div className="p-2">
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-pink-500 to-yellow-500"></div>
      </div>

      <ModeToggle />
    </div>
  );
}
