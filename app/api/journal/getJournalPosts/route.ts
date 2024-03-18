import { db } from "@/lib/drizzle";
import { $posts } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { userId } = auth();

    console.log(userId);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const posts = await db
      .select()
      .from($posts)
      .where(eq($posts.userId, userId!));

    console.log(posts);

    return NextResponse.json(posts, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(e.message, { status: 500 });
  }
}
