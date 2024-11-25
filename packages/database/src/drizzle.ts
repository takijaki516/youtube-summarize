import 'dotenv/config'

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

if (!process.env.DATABASE_URL) {
  throw new Error("POSTGRES_URL environment variable is not set");
}

export const client = postgres(process.env.DATABASE_URL!);
export const dbDrizzle = drizzle(client);
