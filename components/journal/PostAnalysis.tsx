"use client";

import useSWR from "swr";
import React from "react";
import { fetcher } from "@/lib/fetcher";

interface Props {
  postId: string;
  userId: string;
}

const PostAnalysis = ({ postId, userId }: Props) => {
  const { data } = useSWR(
    `${process.env.NEXT_PUBLIC_URL}/api/journal/${postId}`,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateOnMount: true
    }
  );

  const postAnalysis = data?.data;

  console.log(postAnalysis);

  if (!postAnalysis) {
    return null;
  }

  return (
    <div className="absolute right-0 top-16 h-fit w-96 border border-black/5 bg-gray-200">
      <div
        style={{ background: postAnalysis[0].color }}
        className="flex h-[30px] items-center justify-center py-6 text-white"
      >
        <h2 className="text-2xl font-bold text-black">Analysis</h2>
      </div>
      <div>
        <ul role="list" className="divide-y divide-gray-600">
          <li className="flex items-center justify-between gap-2 px-2 py-2">
            <div className="w-fit text-xl font-semibold">Subject</div>
            <div className="text-base">{postAnalysis[0].subject}</div>
          </li>

          <li className="flex items-center justify-between gap-2 px-2 py-2">
            <div className="w-fit text-xl font-semibold">Summary</div>
            <div className="text-base">{postAnalysis[0].summary}</div>
          </li>

          <li className="flex items-center justify-between gap-2 px-2 py-2">
            <div className="w-fit text-xl font-semibold">Mood</div>
            <div className="text-base">{postAnalysis[0].mood}</div>
          </li>

          <li className="flex items-center justify-between gap-2 px-2 py-2">
            <div className="w-fit text-xl font-semibold">Negative</div>
            <div className="text-base">
              {postAnalysis[0].negative ? "True" : "False"}
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PostAnalysis;
