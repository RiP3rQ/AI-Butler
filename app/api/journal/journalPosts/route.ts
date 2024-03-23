import { db } from "@/lib/drizzle";
import { $posts } from "@/lib/drizzle/schema";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

export async function GET(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }

  const posts = await db.select().from($posts).where(eq($posts.userId, userId)).orderBy(desc($posts.updatedAt));

  return NextResponse.json({ data: posts }, { status: 200 });
}
