import { db } from "@/lib/drizzle";
import { $posts } from "@/lib/drizzle/schema";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }

  const posts = await db.select().from($posts).where(eq($posts.userId, userId)).orderBy(desc($posts.updatedAt));

  return NextResponse.json({ posts }, { status: 200 });
}
