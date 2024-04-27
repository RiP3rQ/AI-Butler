import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema1 from "./schema";

if (!process.env.DRIZZLE_DATABASE_URL) {
  throw new Error("DRIZZLE_DATABASE_URL is not defined");
}

const sql: NeonQueryFunction<boolean, boolean> = neon(
  process.env.DRIZZLE_DATABASE_URL as string,
);

export const db = drizzle(sql, { schema: { ...schema1 } });
