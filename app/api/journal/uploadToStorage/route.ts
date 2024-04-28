import { db } from "../../../../drizzle";
import { posts } from "@/drizzle/schema";
import { uploadFileToFirebase } from "@/lib/firebase";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    console.log("userId", userId);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { postId } = await req.json();
    // extract out the dalle imageurl
    // save it to firebase
    const postsList = await db
      .select()
      .from(posts)
      .where(eq(posts.id, parseInt(postId)));

    if (!postsList[0].imageUrl) {
      return new NextResponse("no image url", { status: 400 });
    }

    const firebase_url = await uploadFileToFirebase(
      postsList[0].imageUrl,
      postsList[0].name,
    );

    if (!firebase_url) {
      return new NextResponse("failed to upload to firebase", { status: 500 });
    }

    // update the post with the firebase url
    await db
      .update(posts)
      .set({
        imageUrl: firebase_url,
      })
      .where(eq(posts.id, parseInt(postId)));

    return new NextResponse("ok", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("error", { status: 500 });
  }
}
