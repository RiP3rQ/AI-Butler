import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import TipTapEditor from "@/components/editor/TipTapEditor";
import DeleteButton from "@/components/editor/DeleteButton";
import { clerk } from "@/lib/clerk-server";
import { db } from "@/lib/drizzle";
import { $posts } from "@/lib/drizzle/schema";
import { and, eq } from "drizzle-orm";
import PostAnalysis from "@/components/journal/PostAnalysis";

type Props = {
  params: {
    postId: string;
  };
};

const JournalPostPage = async ({ params: { postId } }: Props) => {
  const { userId } = auth();
  if (!userId) {
    console.log("no user");
    return redirect("/dashboard");
  }

  const user = await clerk.users.getUser(userId);

  const posts = await db
    .select()
    .from($posts)
    .where(and(eq($posts.id, parseInt(postId)), eq($posts.userId, userId)));

  if (posts.length != 1) {
    return redirect("/dashboard");
  }
  const post = posts[0];

  // TODO: Analysis UI Refactor

  return (
    <div className="min-h-[calc(100vh-4rem)] p-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center rounded-lg border border-stone-200 p-4 shadow-xl">
          <Link href={"/journal"}>
            <Button className="bg-green-600" size="sm">
              Back
            </Button>
          </Link>
          <div className="w-3"></div>
          <span className="font-semibold">
            {user.firstName} {user.lastName}
          </span>
          <span className="mx-1 inline-block">/</span>
          <span className="font-semibold text-stone-500">{post.name}</span>
          <div className="ml-auto">
            <DeleteButton postId={post.id} />
          </div>
        </div>

        <div className="h-4"></div>
        <div className="w-full rounded-lg border border-stone-200 px-16 py-8 shadow-xl">
          <TipTapEditor post={post} />
        </div>
      </div>

      {/*  Analysis*/}
      <PostAnalysis postId={postId} userId={userId} />
    </div>
  );
};


export default JournalPostPage;
