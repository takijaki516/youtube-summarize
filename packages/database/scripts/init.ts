import "dotenv/config";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000;

async function init() {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      console.log("Attempting database connection...");
      const client = postgres(process.env.DATABASE_URL!);
      const db = drizzle(client);

      console.log("Running migrations...");
      await migrate(db, {
        migrationsFolder: "./migrations",
      });

      console.log("Migrations completed successfully!");
      await client.end();

      // success
      // docker looks at the process exit code
      process.exit(0);
    } catch (error) {
      console.error("Migration failed:", error);
      retries++;

      if (retries === MAX_RETRIES) {
        console.error("max retries reached. exiting.");
        process.exit(1);
      }

      console.log(`retrying in ${RETRY_DELAY / 1000} seconds....`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    }
  }
}

init();
