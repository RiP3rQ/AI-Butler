"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/fetcher";
import { BookOpenCheck, Delete, Settings, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogBody } from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";


const PostsGrid = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deletePostId, setDeletePostId] = useState<number | null>(null);
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

  const deletePost = useMutation({
    mutationFn: async (postId: number) => {
      const response = await axios.post("/api/journal/deletePost", {
        postId
      });
      await mutate(`${process.env.NEXT_PUBLIC_URL}/api/journal/journalPosts`);
      return response.data;
    }
  });

  // TODO: check analysis from the main page and display it in the modal

  return (
    <>
      <Dialog open={showConfirmModal} onOpenChange={() => setShowConfirmModal(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete journal post</DialogTitle>
          </DialogHeader>
          <DialogBody>
            Are you sure you want to delete this post?
          </DialogBody>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => {
                deletePost.mutate(deletePostId!, {
                  onSuccess: () => {
                    toast.success("Post deleted successfully");
                    setDeletePostId(null);
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
      {posts?.map((post: any) => (
        <div className={"relative"}>
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
          {/*  Actions button */}
          <Popover>
            <PopoverTrigger asChild>
              <div className={"absolute top-0 right-0 bg-white rounded-full p-[2px] z-50 cursor-pointer"}>
                <Settings className="w-6 h-6 text-gray-500 hover:text-green-500 " />
              </div>
            </PopoverTrigger>
            <PopoverContent className={"w-52 p-0"}>
              <div className="flex flex-col items-center justify-center gap-[2px] ">
                <Button
                  variant={"none"}
                  className={"flex items-center justify-between cursor-pointer text-gray-500 hover:text-red-500  w-full"}
                  disabled={deletePost.isPending}
                  onClick={() => {
                    setDeletePostId(post.id);
                    setShowConfirmModal(true);
                  }}
                >
                  <Trash2 className={"w-6 h-6 "} />
                  <span className="text-base">Delete</span>
                </Button>
                <Separator />
                <Button
                  variant={"none"}
                  className={"flex items-center justify-between cursor-pointer text-gray-500 hover:text-green-500 w-full"}>
                  <BookOpenCheck className={"w-6 h-6 "} />
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
