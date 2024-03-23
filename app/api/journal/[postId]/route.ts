import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { $postsAnalysis } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";

export async function POST(
  req: Request,
  { params }: { params: { postId: number } }
) {
  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ data: "Unauthorized" }, { status: 401 });
    }

    if (!params.postId) {
      return NextResponse.json({ data: "Post not found" }, { status: 404 });
    }

    const postAnalysis = await db.select().from($postsAnalysis).where(eq($postsAnalysis.postId, String(params.postId)));

    return NextResponse.json({ postAnalysis });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ data: "Internal Server Error" }, { status: 500 });
  }


}