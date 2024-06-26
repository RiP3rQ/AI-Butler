import { Metadata } from "next";
import React from "react";
import { auth } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import PostsGrid from "@/components/journal/posts-grid";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import JournalActions from "@/components/journal/journal-actions";
import CreateNewJournalPostModal from "@/components/modals/create-new-journal-post-modal";

export const metadata: Metadata = {
  title: "Journal | AI-Butler",
  description: "AI-Butler using OpenAI's API created by RiP3rQ",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function JournalPage() {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-7xl">
        <Breadcrumb className={"w-full py-4 text-xl font-bold"}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Journal</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex flex-col items-center justify-between md:flex-row">
          <JournalActions />
        </div>

        <Separator className={"my-2"} />

        {/* display all the posts */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-5">
          <CreateNewJournalPostModal />
          <PostsGrid />
        </div>
      </div>
    </div>
  );
}
