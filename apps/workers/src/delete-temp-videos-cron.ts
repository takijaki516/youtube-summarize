import cron from "node-cron";
import { lt } from "drizzle-orm";

import { dbDrizzle, tempVideosSchema } from "@repo/database";

cron.schedule("0 0 * * *", async () => {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    await dbDrizzle
      .delete(tempVideosSchema)
      .where(lt(tempVideosSchema.createdAt, oneDayAgo));

    console.log("Old temp videos deleted");
  } catch (error) {
    console.error("Error deleting temp videos:", error);
  }
});

// cron.schedule("*/10 * * * * *", () => {
//   console.log("working");
// });
