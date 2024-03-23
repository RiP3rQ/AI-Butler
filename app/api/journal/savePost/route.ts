import { db } from "@/lib/drizzle";
import { $posts, $postsAnalysis } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { analyzePost } from "@/lib/openai";

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

      editorState = editorState.replace(/<\/?(h1|h2|h3|h4|h5|h6|p|li|strong|ul|ol|em|s|code|pre)>/g, "");

      const analysis = await analyzePost(editorState);
      if (!analysis) {
        return new NextResponse("failed to analyze", { status: 500 });
      }
      await db.update($postsAnalysis).set({
        userId,
        postId,
        mood: analysis.mood,
        summary: analysis.summary,
        color: analysis.color,
        negative: analysis.negative,
        subject: analysis.subject,
        sentimentScore: String(analysis.sentimentScore),
        updatedAt: new Date()
      }).where(eq($postsAnalysis.postId, postId));
      console.log("Updated and analyzed the post!");
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