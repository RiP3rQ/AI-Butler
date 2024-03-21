import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/drizzle";
import { $posts } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { qa } from "@/lib/openai";

export const POST = async (req: Request) => {
  const { question }: any = await req.json();
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ data: "Unauthorized" }, { status: 401 });
  }

  const posts = await db.select().from($posts).where(eq($posts.userId, userId));

  const answer = await qa(question, posts);
  return NextResponse.json({ data: answer });
};
