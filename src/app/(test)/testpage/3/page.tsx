import { ResizableView } from "@/components/resizable-view";

export default function TestPage3() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-10 bg-background">
      <ResizableView>
        <h1>Hello</h1>
      </ResizableView>

      <ResizableView>
        <>
          <div>ASk</div>
          <div>WHy</div>
        </>
      </ResizableView>
    </main>
  );
}
