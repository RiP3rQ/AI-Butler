import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import TipTapEditor from "@/components/editor/tip-tap-editor";
import DeleteButton from "@/components/editor/delete-button";
import { clerk } from "@/lib/clerk-server";
import { db } from "../../../../drizzle";
import { posts } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import PostAnalysis from "@/components/journal/post-analysis";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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

  const postsList = await db
    .select()
    .from(posts)
    .where(and(eq(posts.id, parseInt(postId)), eq(posts.userId, userId)));

  if (postsList.length != 1) {
    return redirect("/dashboard");
  }
  const post = postsList[0];

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="relative mx-auto max-w-4xl">
        <Breadcrumb className={"w-full py-4 text-xl font-bold"}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/journal">Journal</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                <span className="font-semibold">
                  {user.firstName} {user.lastName}
                </span>
                <span className="mx-1 inline-block">/</span>
                <span className="font-semibold text-stone-500">
                  {post.name}
                </span>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {/* Delete button*/}
        <div className="absolute right-0 top-2 flex items-center gap-1">
          <DeleteButton postId={post.id} />
          {/*  Analysis */}
          <PostAnalysis postId={postId} userId={userId} />
        </div>

        <div className="w-full rounded-lg border border-stone-200 px-4 py-4 shadow-xl">
          <TipTapEditor post={post} />
        </div>
      </div>
    </div>
  );
};

export default JournalPostPage;
