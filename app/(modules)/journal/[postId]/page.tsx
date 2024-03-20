import DeleteButton from "@/components/editor/DeleteButton";
import TipTapEditor from "@/components/editor/TipTapEditor";
import { Button } from "@/components/ui/button";
import { clerk } from "@/lib/clerk-server";
import { db } from "@/lib/drizzle";
import { $posts, $postsAnalysis } from "@/lib/drizzle/schema";
import { auth } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    postId: string;
  };
};

const JournalPostPage = async ({ params: { postId } }: Props) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/dashboard");
  }
  const user = await clerk.users.getUser(userId);
  const posts = await db
    .select()
    .from($posts)
    .where(and(eq($posts.id, parseInt(postId)), eq($posts.userId, userId)));

  // TODO: Server side fetching using api route for revalidation of data on update
  const analysis = await db.select().from($postsAnalysis).where(and(eq($postsAnalysis.postId, postId), eq($postsAnalysis.userId, userId)));
  const postAnalysis = analysis[0];

  // TODO: Analysis UI Refactor

  if (posts.length != 1) {
    return redirect("/dashboard");
  }
  const post = posts[0];

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
      {postAnalysis && (
        <div className="absolute top-16 right-0 h-fit w-96 border border-black/5 bg-gray-200">
          <div
            style={{ background: postAnalysis.color }}
            className="h-[30px] text-white py-6 flex items-center justify-center"
          >
            <h2 className="text-2xl text-black font-bold">Analysis</h2>
          </div>
          <div>
            <ul role="list" className="divide-y divide-gray-600">
              <li className="py-2 px-2 flex items-center justify-between gap-2">
                <div className="text-xl font-semibold w-fit">Subject</div>
                <div className="text-base">{postAnalysis.subject}</div>
              </li>

              <li className="py-2 px-2 flex items-center justify-between gap-2">
                <div className="text-xl font-semibold w-fit">Summary</div>
                <div className="text-base">{postAnalysis.summary}</div>
              </li>

              <li className="py-2 px-2 flex items-center justify-between gap-2">
                <div className="text-xl font-semibold w-fit">Mood</div>
                <div className="text-base">{postAnalysis.mood}</div>
              </li>

              <li className="py-2 px-2 flex items-center justify-between gap-2">
                <div className="text-xl font-semibold w-fit">Negative</div>
                <div className="text-base">
                  {postAnalysis.negative ? "True" : "False"}
                </div>
              </li>
            </ul>
          </div>
        </div>
      )}

    </div>
  );
};

export default JournalPostPage;
