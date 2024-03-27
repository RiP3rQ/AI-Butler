import { db } from "@/lib/drizzle";
import { $posts, $postsAnalysis } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { analyzePost } from "@/lib/openai";
import { createAuditLog } from "@/lib/auditLog/createAuditLog";

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    let { postId, editorState } = body;
    if (!editorState || !postId) {
      return new NextResponse("Missing editorState or postId", { status: 400 });
    }

    postId = parseInt(postId);
    const posts = await db.select().from($posts).where(eq($posts.id, postId));
    if (posts.length != 1) {
      return new NextResponse("failed to update", { status: 500 });
    }

    const post = posts[0];
    if (post.editorState !== editorState) {
      await db
        .update($posts)
        .set({
          editorState,
          updatedAt: new Date()
        })
        .where(eq($posts.id, postId));

      // create the audit log
      await createAuditLog({
        entityId: postId,
        entityType: "post",
        entityTitle: post.name,
        action: "UPDATE"
      });

    } else {
      console.log("No changes detected! Not updating the post.");
    }

    return NextResponse.json(
      {
        success: true
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false
      },
      { status: 500 }
    );
  }
}