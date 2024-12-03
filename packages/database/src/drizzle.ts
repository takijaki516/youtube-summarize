import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL!;
let client = postgres(connectionString);
export const dbDrizzle = drizzle(client);
