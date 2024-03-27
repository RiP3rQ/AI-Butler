import { analyzePost } from "@/lib/openai";
import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { $posts, $postsAnalysis } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs";
import { createAuditLog } from "@/lib/auditLog/createAuditLog";

export async function PUT(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    let { postId, editorState } = await req.json();
    if (!editorState || !postId) {
      return new NextResponse("Missing editorState or postId", { status: 400 });
    }

    postId = parseInt(postId);
    const posts = await db.select().from($posts).where(eq($posts.id, postId));

    if (posts.length != 1) {
      return new NextResponse("No post found!", { status: 500 });
    }

    editorState = editorState.replace(
      /<\/?(h1|h2|h3|h4|h5|h6|p|li|strong|ul|ol|em|s|code|pre)>/g,
      ""
    );

    const analysis = await analyzePost(editorState);
    if (!analysis) {
      return new NextResponse("failed to analyze", { status: 500 });
    }
    const analysisReturn = await db
      .update($postsAnalysis)
      .set({
        userId,
        postId,
        mood: analysis.mood,
        summary: analysis.summary,
        color: analysis.color,
        negative: analysis.negative,
        subject: analysis.subject,
        sentimentScore: String(analysis.sentimentScore),
        updatedAt: new Date()
      })
      .where(eq($postsAnalysis.postId, postId)).returning({
        updatedId: $postsAnalysis.id,
        updatedSummary: $postsAnalysis.summary
      });

    console.log("Analyzed the post!");

    // create the audit log
    await createAuditLog({
      entityId: String(analysisReturn[0].updatedId),
      entityType: "postsAnalysis",
      entityTitle: analysisReturn[0].updatedSummary,
      action: "UPDATE"
    });

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
