"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";

export function ResizableView({ children }: { children: React.ReactNode }) {
  if (!Array.isArray(children)) {
    return null;
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="w-full">
      <ResizablePanel>{children[0]}</ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel style={{ overflowY: "auto" }}>
        {children[1]}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
