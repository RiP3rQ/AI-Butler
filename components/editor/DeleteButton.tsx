"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {
  postId: number;
};

const DeleteButton = ({ postId }: Props) => {
  const router = useRouter();
  const deletePost = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/deletePost", {
        postId
      });
      return response.data;
    }
  });
  return (
    <Button
      variant={"destructive"}
      size="sm"
      disabled={deletePost.isPending}
      onClick={() => {
        const confirm = window.confirm(
          "Are you sure you want to delete this post?"
        );
        if (!confirm) return;
        deletePost.mutate(undefined, {
          onSuccess: () => {
            router.push("/dashboard");
          },
          onError: (err) => {
            console.error(err);
          }
        });
      }}
    >
      <Trash />
    </Button>
  );
};

export default DeleteButton;