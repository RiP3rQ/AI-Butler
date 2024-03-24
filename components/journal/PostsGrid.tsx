"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/fetcher";
import { BookOpenCheck, Delete, Settings, Trash2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { DialogBody } from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const PostsGrid = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [postAnalysisData, setPostAnalysisData] = useState<any | null>(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const { data } = useSWR(
    `${process.env.NEXT_PUBLIC_URL}/api/journal/journalPosts`,
    fetcher
  );
  const posts = data?.data;

  if (posts?.length === 0) {
    return (
      <div className="text-center">
        <h2 className="text-xl text-gray-500">You have no posts yet.</h2>
      </div>
    );
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const deletePost = useMutation({
    mutationFn: async (postId: number) => {
      const response = await axios.post("/api/journal/deletePost", {
        postId
      });
      await mutate(`${process.env.NEXT_PUBLIC_URL}/api/journal/journalPosts`);
      return response.data;
    }
  });

  const fetchPostAnalysis = useMutation({
    mutationFn: async (postId: number) => {
      setIsAnalysisLoading(true);
      const { data } = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/journal/${postId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }).then((res) => res.json());
      const postAnalysis = data?.[0];
      if (postAnalysis) {
        setIsAnalysisLoading(false);
        setPostAnalysisData(postAnalysis);
      } else {
        toast.error("Failed to fetch analysis");
      }
    }
  });

  // TODO: check analysis from the main page and display it in the modal
  // TODO: (later) refactor to single components

  return (
    <>
      {/* CONFIRM */}
      <Dialog
        open={showConfirmModal}
        onOpenChange={() => setShowConfirmModal(false)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete journal post</DialogTitle>
          </DialogHeader>
          <DialogBody>Are you sure you want to delete this post?</DialogBody>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => {
                deletePost.mutate(selectedPostId!, {
                  onSuccess: () => {
                    toast.success("Post deleted successfully");
                    setSelectedPostId(null);
                    setShowConfirmModal(false);
                  },
                  onError: (err) => {
                    console.error(err);
                  }
                });
              }}
            >
              Delete
            </Button>
            <Button onClick={() => setShowConfirmModal(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* ANALYSIS MODAL*/}
      <Dialog
        open={showAnalysisModal}
        onOpenChange={() => {
          setPostAnalysisData(null);
          setShowAnalysisModal(false);
        }}
      >
        {isAnalysisLoading ? (
          <DialogContent>
            <DialogBody>
              <div className="flex items-center justify-center gap-2">
                <p className="text-lg">Loading analysis...</p>
              </div>
            </DialogBody>
          </DialogContent>
        ) : (
          <DialogContent>
            <DialogBody>
              <div
                style={{ background: postAnalysisData?.color }}
                className="flex h-[30px] items-center justify-center py-6 text-white"
              >
                <h2 className="text-2xl font-bold text-black">Analysis</h2>
              </div>
              <div>
                <ul role="list" className="divide-y divide-gray-600">
                  <li className="flex items-center justify-between gap-2 px-2 py-2">
                    <div className="w-fit text-xl font-semibold">Subject</div>
                    <div className="text-base">{postAnalysisData?.subject}</div>
                  </li>

                  <li className="flex items-center justify-between gap-2 px-2 py-2">
                    <div className="w-fit text-xl font-semibold">Summary</div>
                    <div className="text-base">{postAnalysisData?.summary}</div>
                  </li>

                  <li className="flex items-center justify-between gap-2 px-2 py-2">
                    <div className="w-fit text-xl font-semibold">Mood</div>
                    <div className="text-base">{postAnalysisData?.mood}</div>
                  </li>

                  <li className="flex items-center justify-between gap-2 px-2 py-2">
                    <div className="w-fit text-xl font-semibold">Negative</div>
                    <div className="text-base">
                      {postAnalysisData?.negative ? "True" : "False"}
                    </div>
                  </li>
                </ul>
              </div>
            </DialogBody>
            <DialogFooter>
              <Button
                onClick={() => {
                  setPostAnalysisData(null);
                  setShowAnalysisModal(false);
                }}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
      {posts?.map((post: any) => (
        <div className={"relative"} key={post.id}>
          <Link href={`/journal/${post.id}`}>
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
          {/*  Actions button */}
          <Popover>
            <PopoverTrigger asChild>
              <div
                className={
                  "absolute right-0 top-0 z-50 cursor-pointer rounded-full bg-white p-[2px]"
                }
              >
                <Settings className="h-6 w-6 text-gray-500 hover:text-green-500 " />
              </div>
            </PopoverTrigger>
            <PopoverContent className={"w-52 p-0"}>
              <div className="flex flex-col items-center justify-center gap-[2px] ">
                <Button
                  variant={"none"}
                  className={
                    "flex w-full cursor-pointer items-center justify-between text-gray-500  hover:text-red-500"
                  }
                  disabled={deletePost.isPending}
                  onClick={() => {
                    setSelectedPostId(post.id);
                    setShowConfirmModal(true);
                  }}
                >
                  <Trash2 className={"h-6 w-6 "} />
                  <span className="text-base">Delete</span>
                </Button>
                <Separator />
                <Button
                  variant={"none"}
                  className={
                    "flex w-full cursor-pointer items-center justify-between text-gray-500 hover:text-green-500"
                  }
                  onClick={() => {
                    setSelectedPostId(post.id);
                    setShowAnalysisModal(true);
                    fetchPostAnalysis.mutate(post.id!);
                  }}
                >
                  <BookOpenCheck className={"h-6 w-6 "} />
                  <span className="text-base">Show analysis</span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ))}
    </>
  );
};

export default PostsGrid;
