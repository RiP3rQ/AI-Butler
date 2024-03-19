import { db } from "@/lib/drizzle";
import { $posts } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
  const { userId } = await req.json();

  console.log("userId", userId);

  if (!userId) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }

  const posts = await db.select().from($posts).where(eq($posts.userId, userId));

  console.log(posts);

  return NextResponse.json({ posts }, { status: 200 });
}
