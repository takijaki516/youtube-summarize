"use client";

import { useMatchesMedia } from "@/lib/hooks/use-match-media";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";

// TODO: add drag an drop feature
export function ResizableView({ children }: { children: React.ReactNode }) {
  if (!Array.isArray(children)) {
    return null;
  }

  const isLarge = useMatchesMedia("(min-width: 1024px)");

  return (
    <ResizablePanelGroup
      direction={isLarge ? "horizontal" : "vertical"}
      className="w-full overflow-x-clip"
    >
      <ResizablePanel defaultSize={50}>{children[0]}</ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={50} style={{ overflowY: "auto" }}>
        {children[1]}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
