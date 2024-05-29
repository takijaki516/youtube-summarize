import { Skeleton } from "@/components/ui/skeleton";

const VideoSummaryLoading = () => {
  return (
    <section>
      <div>
        <Skeleton />
      </div>
      <div>
        <Skeleton />
        <Skeleton />
      </div>
    </section>
  );
};

export default VideoSummaryLoading;
