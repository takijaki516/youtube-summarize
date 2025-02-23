import { Skeleton } from "@/components/ui/skeleton";

export default function SummaryViewLoading() {
  return (
    <div className="h-screen w-full overflow-y-auto bg-background p-4">
      {/* Video player skeleton */}
      <div className="mx-auto max-w-7xl">
        <div className="aspect-video w-full">
          <Skeleton className="h-full w-full rounded-lg" />
        </div>

        {/* Tabs skeleton */}
        <div className="flex gap-2 py-4">
          <Skeleton className="h-9 w-20 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>

        {/* Content skeleton with paragraph simulation */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[95%]" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[85%]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
