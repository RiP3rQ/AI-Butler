"use server";

import { validate } from "uuid";
import { $files } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { db } from "@/lib/drizzle";

export const getFiles = async (folderId: string) => {
  const isValid = validate(folderId);
  if (!isValid) return { data: null, error: "Error" };
  try {
    const results = (await db
      .select()
      .from($files)
      .orderBy($files.createdAt)
      .where(eq($files.folderId, folderId))) as File[] | [];
    return { data: results, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};
