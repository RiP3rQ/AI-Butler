import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

export default {
  driver: "pg",
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dbCredentials: {
    connectionString: process.env.SUPABASE_DATABASE_URL!,
  },
} satisfies Config;
