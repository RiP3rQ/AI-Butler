import { db } from "@/lib/drizzle";
import { $posts, $postsAnalysis } from "@/lib/drizzle/schema";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { analyzePost } from "@/lib/openai";

export async function POST(req: Request) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }

  await analyzePost(`I'm going to give you an journal entry, I want you to analyze for a few things. I need the mood, 
  a summary, a color representing the mood and a negative boolean value if entry is negative. You need to respond back with formatted JSON like 
  { "mood": "", "summary": "", "color": "", "negative": "" }.
  
  entry: Today was a really good day, I went to the park and had a lot of fun. I also got to see my friends and eat great food.
  `);

  const posts = await db.select().from($posts).where(eq($posts.userId, userId)).orderBy(desc($posts.updatedAt));
  let postsAnalysis: any[] = [];
  // for each post, get the analysis based on the post id
  for (const post of posts) {
    // @ts-ignore
    const analysis = await db.select().from($postsAnalysis).where(eq($postsAnalysis.postId, post.id)).limit(1);
    postsAnalysis = [...postsAnalysis, analysis[0]];
  }
  return NextResponse.json({ posts, postsAnalysis }, { status: 200 });
}
