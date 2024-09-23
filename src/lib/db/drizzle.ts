import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../env";

if (!env.DATABASE_URL) {
  throw new Error("POSTGRES_URL environment variable is not set");
}

export const client = postgres(env.DATABASE_URL);
export const db = drizzle(client);
