import { Metadata } from "next";
import React from "react";
import { auth } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import PostsGrid from "@/components/journal/PostsGrid";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import JournalPageActions from "@/components/journal/JournalPageActions";
import CreateNewJournalPostModal from "@/components/modals/CreateNewJournalPostModal";

export const metadata: Metadata = {
  title: "AI-Butler - Journal",
  description:
    "AI-Butler using OpenAI's API created by RiP3rQ using Sonny Sangha's and Coding in Flow's tutorials",
  icons: {
    icon: "/favicon.ico"
  }
};

// FINAL VERSION: ADD Sorting and filtering of posts + pagination

export default async function JournalPage() {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-7xl">
        <Breadcrumb className={"text-xl font-bold py-4 w-full"}>
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
          <JournalPageActions />
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
