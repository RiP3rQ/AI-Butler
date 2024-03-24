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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
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

  const posts = await db
    .select()
    .from($posts)
    .where(and(eq($posts.id, parseInt(postId)), eq($posts.userId, userId)));

  if (posts.length != 1) {
    return redirect("/dashboard");
  }
  const post = posts[0];

  // TODO: (LATER) Change Analysis to modal

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-4xl relative">
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
        <div className="absolute top-2 right-2">
          <DeleteButton postId={post.id} />
        </div>

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
