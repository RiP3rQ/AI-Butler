import { db } from "@/lib/drizzle";
import { $posts } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
  const { userId } = auth();

  console.log("userId", userId);

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { postId } = await req.json();
  await db.delete($posts).where(eq($posts.id, parseInt(postId)));

  revalidatePath("/api/journal/journalPosts");
  return new NextResponse("ok", { status: 200 });
}