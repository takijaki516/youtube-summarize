import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL!;

let client;

if (process.env.NODE_ENV === "development") {
  client = postgres(connectionString);
} else {
  // Disable prefetch as it is not supported for "Transaction" pool mode
  client = postgres(connectionString, { prepare: false });
}

export const dbDrizzle = drizzle(client);
