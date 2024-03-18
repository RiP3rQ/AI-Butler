import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { generateDalleImage, generateImagePrompt } from "@/lib/openai";
import { $posts } from "@/lib/drizzle/schema";
import { db } from "@/lib/drizzle";
import { revalidatePath } from "next/cache";

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

  const post_ids = await db
    .insert($posts)
    .values({
      name,
      userId,
      imageUrl: image_url
    })
    .returning({
      insertedId: $posts.id
    });

  revalidatePath("/api/journal/getJournalPosts");

  return NextResponse.json({
    post_id: post_ids[0].insertedId
  });
}