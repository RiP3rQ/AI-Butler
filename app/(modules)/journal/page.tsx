import { Metadata } from "next";
import React from "react";
import Image from "next/image";
import { UserButton, auth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import CreatePostDialog from "@/components/journal/CreatePostDialog";
import axios from "axios";
import { SearchInput } from "@/components/journal/SearchInput";

export const metadata: Metadata = {
  title: "AI-Butler - Journal",
  description:
    "AI-Butler using OpenAI's API created by RiP3rQ using Sonny Sangha's and Coding in Flow's tutorials",
  icons: {
    icon: "/favicon.ico"
  }
};

// TODO: Sorting and filtering of posts + pagination
// TODO: PROPER REVALIDATION OF POSTS

export default async function JournalPage() {
  const { userId } = auth();
  const { posts } = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/journal/journalPosts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userId }),
    cache: "no-cache"
  }).then((res) => res.json());

  if (!userId || !posts) {
    return <div>Loading...</div>;
  }

  // TODO: deleteing posts from journal main page
  // TODO: check analysis from the main page and display it

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
            {posts?.length !== 0 && (
              <SearchInput />
            )}
          </div>
        </div>

        <div className="h-8"></div>
        <Separator />
        <div className="h-8"></div>
        {/* list all the posts */}
        {/* if no posts, display this */}
        {posts?.length === 0 && (
          <div className="text-center">
            <h2 className="text-xl text-gray-500">You have no posts yet.</h2>
          </div>
        )}

        {/* display all the posts */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-5">
          <CreatePostDialog />
          {posts?.map((post: any) => {
            return (
              <Link href={`/journal/${post.id}`} key={post.id}>
                <div
                  className="flex flex-col overflow-hidden rounded-lg border border-stone-300 transition hover:-translate-y-1 hover:shadow-xl">
                  <Image
                    width={400}
                    height={200}
                    alt={post.name}
                    src={post.imageUrl || ""}
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {post.name}
                    </h3>
                    <div className="h-1"></div>
                    <p className="text-sm text-gray-500">
                      {new Date(post.updatedAt).toLocaleDateString()}{" "} at{" "} {new Date(post.updatedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
