import "dotenv/config";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import path from "path";

export const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client);

async function main() {
  console.log("STARTING MIGRATIONS!");

  await migrate(db, {
    migrationsFolder: path.join(__dirname, "../migrations"),
  });

  console.log("MIGRATIONS COMPLETED!");

  await client.end();

  console.log("CONNECTION CLOSED!");
}

main();
