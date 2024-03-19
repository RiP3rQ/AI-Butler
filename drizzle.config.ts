import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({
  path: ".env"
});

export default {
  driver: "pg",
  schema: "./lib/drizzle/schema.ts",
  out: "./lib/drizzle/migrations",
  dbCredentials: {
    connectionString: process.env.DRIZZLE_DATABASE_URL!
  }
} satisfies Config;