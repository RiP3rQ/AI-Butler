"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Loader2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { mutate } from "swr";
import { toast } from "sonner";

type Props = {};

// TODO: (LATER) Steps in modal to choose one of 3 generated images or upload a custom image

const CreateNewJournalPostModal = (props: Props) => {
  const router = useRouter();
  const [input, setInput] = React.useState("");
  const uploadToStorage = useMutation({
    mutationFn: async (postId: string) => {
      const response = await axios.post("/api/journal/uploadToStorage", {
        postId
      });
      await mutate(`${process.env.NEXT_PUBLIC_URL}/api/journal/journalPosts`);
      return response.data;
    }
  });
  const createPost = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/journal/createPost", {
        name: input
      });
      await mutate(`${process.env.NEXT_PUBLIC_URL}/api/journal/journalPosts`);
      return response.data;
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input === "") {
      toast.error("Please enter a name for the post");
      return;
    }
    console.log("creating new post");
    createPost.mutate(undefined, {
      onSuccess: ({ post_id }) => {
        toast.success("Post created successfully");
        // hit another endpoint to uplod the temp dalle url to permanent firebase url
        uploadToStorage.mutate(post_id);
        router.push(`/journal/${post_id}`);
      },
      onError: (error) => {
        console.error(error);
        window.alert("Failed to create new post");
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div
          className="border-dashed border-2 flex border-green-600 h-full rounded-lg items-center justify-center sm:flex-col hover:shadow-xl transition hover:-translate-y-1 flex-row p-4">
          <Plus className="w-6 h-6 text-green-600" strokeWidth={3} />
          <h2 className="font-semibold text-gray-600 sm:mt-2">
            New post
          </h2>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New post</DialogTitle>
          <DialogDescription>
            You can create a new post by clicking the button below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Name..."
          />
          <div className="h-4"></div>
          <div className="flex items-center gap-2">
            <Button type="reset" variant={"secondary"}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-600"
              disabled={createPost.isPending}
            >
              {createPost.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewJournalPostModal;