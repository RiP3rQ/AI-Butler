"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";


const PostsGrid = () => {
  const { data } = useSWR(
    `${process.env.NEXT_PUBLIC_URL}/api/journal/journalPosts`,
    fetcher
  );
  const posts = data?.data;

  if (posts?.length === 0) {
    return (<div className="text-center">
      <h2 className="text-xl text-gray-500">You have no posts yet.</h2>
    </div>);
  }

  return (
    <>
      {posts?.map((post: any) => (
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
                {new Date(post.updatedAt).toLocaleDateString()} at{" "}
                {new Date(post.updatedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
};

export default PostsGrid;
