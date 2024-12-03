import { dbDrizzle, videosSchema } from "@repo/database";
import { WelcomePage } from "../components/welcome-page";
import { RecentPage } from "@/components/recent-pages";

export default async function HomePage() {
  const recentVideos = await dbDrizzle.select().from(videosSchema);

  if (!recentVideos.length) {
    return <WelcomePage />;
  }

  return <RecentPage />;
}
