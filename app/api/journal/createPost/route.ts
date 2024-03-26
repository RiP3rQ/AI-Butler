import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { analyzePost, generateDalleImage, generateImagePrompt } from "@/lib/openai";
import { $posts, $postsAnalysis } from "@/lib/drizzle/schema";
import { db } from "@/lib/drizzle";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/createAuditLog";

export const runtime = "edge";

export async function POST(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { name } = await req.json();

  const image_description = await generateImagePrompt(name);
  if (!image_description) {
    return new NextResponse("failed to generate image description", {
      status: 500
    });
  }
  const image_url = await generateDalleImage(image_description);
  if (!image_url) {
    return new NextResponse("failed to generate image ", {
      status: 500
    });
  }

  const editorState = `${name}`;

  const post_ids = await db
    .insert($posts)
    .values({
      name,
      userId,
      imageUrl: image_url,
      editorState
    })
    .returning({
      insertedId: $posts.id
    });

  // analyze the post and create an analysis for empty post
  const analysis = await analyzePost(editorState);
  if (!analysis) {
    return new NextResponse("failed to analyze", { status: 500 });
  }
  const analysisId = await db.insert($postsAnalysis).values({
    userId,
    postId: String(post_ids[0].insertedId),
    mood: analysis.mood,
    summary: analysis.summary,
    color: analysis.color,
    negative: analysis.negative,
    subject: analysis.subject,
    sentimentScore: String(analysis.sentimentScore)
  }).returning({
    insertedId: $postsAnalysis.id
  });

  await createAuditLog({
    entityId: String(post_ids[0].insertedId),
    entityType: "posts",
    entityTitle: name,
    action: "CREATE"
  });

  await createAuditLog({
    entityId: String(analysisId[0].insertedId),
    entityType: "postsAnalysis",
    entityTitle: name,
    action: "CREATE"
  });

  revalidatePath(`${process.env.NEXT_PUBLIC_URL}/api/journal/journalPosts`);

  return NextResponse.json({
    post_id: post_ids[0].insertedId
  });
}