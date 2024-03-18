import { db } from "@/lib/drizzle";
import { $posts } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const { postId } = await req.json();
  await db.delete($posts).where(eq($posts.id, parseInt(postId)));

  revalidatePath("/api/journal/getJournalPosts");
  return new NextResponse("ok", { status: 200 });
}