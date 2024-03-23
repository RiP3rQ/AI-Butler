import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/drizzle";
import { $posts } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { qa } from "@/lib/openai";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { question }: any = await req.json();
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ data: "Unauthorized" }, { status: 401 });
    }

    const posts = await db.select().from($posts).where(eq($posts.userId, userId));
    console.log("creating response", question);
    console.log("posts", posts);
    const answer = await qa(question, posts);
    console.log("answer", answer);

    return NextResponse.json({ data: answer });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ data: "Internal server error" }, { status: 500 });
  }
}
