import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle as drizzleHttp } from "drizzle-orm/neon-http";

import { env } from "../env.mjs";

let connectionString = env.DATABASE_URL;

if (env.NODE_ENV === "development") {
  connectionString =
    "postgres://postgres:postgres@db.localtest.me:5432/youtube_chat";
  neonConfig.fetchEndpoint = (host) => {
    const [protocol, port] =
      host === "db.localtest.me" ? ["http", 4444] : ["https", 443];
    return `${protocol}://${host}:${port}/sql`;
  };
}

const sql = neon(connectionString);
export const drizzleClient = drizzleHttp(sql);
