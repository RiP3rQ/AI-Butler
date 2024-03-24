import { Metadata } from "next";
import React from "react";
import { auth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import CreatePostDialog from "@/components/journal/CreatePostDialog";
import { SearchInput } from "@/components/journal/SearchInput";
import { HistoryButton } from "@/components/journal/HistoryButton";
import { redirect } from "next/navigation";
import PostsGrid from "@/components/journal/PostsGrid";

export const metadata: Metadata = {
  title: "AI-Butler - Journal",
  description:
    "AI-Butler using OpenAI's API created by RiP3rQ using Sonny Sangha's and Coding in Flow's tutorials",
  icons: {
    icon: "/favicon.ico"
  }
};

// TODO:(LATER) Sorting and filtering of posts + pagination

export default async function JournalPage() {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-7xl p-10">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="flex items-center">
            <Link href="/">
              <Button className="bg-gray-600" size="sm">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="w-4"></div>
            <h1 className="text-3xl font-bold text-gray-900">My posts</h1>
          </div>
          <div>
            <div className={"flex items-center justify-center gap-2"}>
              <HistoryButton />
              <SearchInput />
            </div>
          </div>
        </div>

        <div className="h-8"></div>
        <Separator />
        <div className="h-8"></div>

        {/* display all the posts */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-5">
          <CreatePostDialog />
          <PostsGrid />
        </div>
      </div>
    </div>
  );
}
