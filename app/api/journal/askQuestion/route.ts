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

    if (!posts.length) {
      return NextResponse.json({ data: "No posts found" }, { status: 404 });
    }

    for (const post of posts) {
      post.editorState = post?.editorState?.replace(/<\/?(h1|h2|h3|h4|h5|h6|p|li|strong|ul|ol|em|s|code|pre)>/g, "") || "";
    }
    const answer = await qa(question, posts);

    return NextResponse.json({ data: answer });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ data: "Internal server error" }, { status: 500 });
  }
}
