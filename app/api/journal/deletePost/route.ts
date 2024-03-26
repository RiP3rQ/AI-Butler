import { db } from "@/lib/drizzle";
import { $posts, $postsAnalysis } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";
import { createAuditLog } from "@/lib/createAuditLog";

export async function POST(req: Request) {
  const { userId } = auth();

  console.log("userId", userId);

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { postId } = await req.json();
  const deletePost = await db.delete($posts).where(eq($posts.id, parseInt(postId))).returning({ postsName: $posts.name });
  await db.delete($postsAnalysis).where(eq($postsAnalysis.postId, postId));

  await createAuditLog({
    entityId: postId,
    entityType: "posts",
    entityTitle: deletePost[0].postsName,
    action: "DELETE"
  });

  revalidatePath(`${process.env.NEXT_PUBLIC_URL}/api/journal/journalPosts`);
  return new NextResponse("ok", { status: 200 });
}