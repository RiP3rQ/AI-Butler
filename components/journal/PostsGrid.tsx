"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/fetcher";
import { BookOpenCheck, Settings, Trash2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ConfirmModal from "@/components/modals/ConfirmModa";
import AnalysisModal from "@/components/modals/AnalysisModal";
import { Skeleton } from "@/components/ui/skeleton";

const PostsGrid = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [postAnalysisData, setPostAnalysisData] = useState<any | null>(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const { data, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_URL}/api/journal/journalPosts`,
    fetcher,
  );
  const posts = data?.data;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const deletePost = useMutation({
    mutationFn: async (postId: number) => {
      const response = await axios.post("/api/journal/deletePost", {
        postId,
      });
      await mutate(`${process.env.NEXT_PUBLIC_URL}/api/journal/journalPosts`);
      return response.data;
    },
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const fetchPostAnalysis = useMutation({
    mutationFn: async (postId: number) => {
      setIsAnalysisLoading(true);
      const { data } = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/journal/${postId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      ).then((res) => res.json());
      const postAnalysis = data?.[0];
      if (postAnalysis) {
        setIsAnalysisLoading(false);
        setPostAnalysisData(postAnalysis);
      } else {
        toast.error("Failed to fetch analysis");
      }
    },
  });

  const onConfirm = () => {
    deletePost.mutate(selectedPostId!, {
      onSuccess: () => {
        toast.success("Post deleted successfully");
        setSelectedPostId(null);
        setShowConfirmModal(false);
      },
      onError: (err) => {
        console.error(err);
      },
    });
  };

  // Hydration error fix
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    const elements = [];
    for (let i = 0; i < 6; i++) {
      elements.push(
        <div
          key={i}
          className="flex flex-col overflow-hidden rounded-lg border border-stone-300 transition hover:-translate-y-1 hover:shadow-xl"
        >
          <Skeleton className="h-56 w-96" />
          <div className="p-4">
            <Skeleton className="h-6 w-24" />
            <div className="h-1"></div>
            <Skeleton className="h-4 w-24" />
          </div>
        </div>,
      );
    }
    return elements;
  }

  if (posts?.length === 0) {
    return (
      <div className="text-center">
        <h2 className="text-xl text-gray-500">You have no posts yet.</h2>
      </div>
    );
  }

  if (isLoading) {
    const elements = [];
    for (let i = 0; i < 6; i++) {
      elements.push(
        <div
          key={i}
          className="flex flex-col overflow-hidden rounded-lg border border-stone-300 transition hover:-translate-y-1 hover:shadow-xl"
        >
          <Skeleton className="h-56 w-96" />
          <div className="p-4">
            <Skeleton className="h-6 w-24" />
            <div className="h-1"></div>
            <Skeleton className="h-4 w-24" />
          </div>
        </div>,
      );
    }
    return elements;
  }

  return (
    <>
      {/* CONFIRM */}
      <ConfirmModal
        open={showConfirmModal}
        setOpen={setShowConfirmModal}
        title={"Delete journal post"}
        // map post name to selectedPostId
        description={`Are you sure you want to delete post with title: ${
          posts?.find((post: any) => post.id === selectedPostId)?.name
        }?`}
        onConfirm={onConfirm}
        onConfirmText={"Delete"}
      />
      {/* ANALYSIS MODAL*/}
      <AnalysisModal
        open={showAnalysisModal}
        setOpen={setShowAnalysisModal}
        postAnalysisData={postAnalysisData}
        setPostAnalysisData={setPostAnalysisData}
        isAnalysisLoading={isAnalysisLoading}
      />
      {/* POSTS */}
      {posts?.map((post: any) => (
        <div className={"relative"} key={post.id}>
          <Link href={`/journal/${post.id}`}>
            <div className="flex flex-col overflow-hidden rounded-lg border border-stone-300 transition hover:-translate-y-1 hover:shadow-xl">
              <Image
                width={400}
                height={200}
                alt={post.name}
                src={post.imageUrl || ""}
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-black dark:text-muted-foreground">
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
                  variant={"outline"}
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
                <Button
                  variant={"outline"}
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
