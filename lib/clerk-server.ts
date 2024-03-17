import { Clerk } from "@clerk/backend";

export const clerk = Clerk({
  secretKey: process.env.CLERK_SECRET_KEY
});