import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

if (!process.env.SUPABASE_DATABASE_URL) {
  throw new Error("SUPABASE_DATABASE_URL is not defined");
}

export const sql = new Pool({
  connectionString: <string>process.env.SUPABASE_DATABASE_URL,
});

export const db = drizzle(sql, { schema });
