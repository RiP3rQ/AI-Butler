"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { mutate } from "swr";
import ConfirmModal from "@/components/modals/ConfirmModa";
import { toast } from "sonner";

type Props = {
  postId: number;
};

const DeleteButton = ({ postId }: Props) => {
  const router = useRouter();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const deletePost = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/journal/deletePost", {
        postId
      });
      await mutate(`${process.env.NEXT_PUBLIC_URL}/api/journal/journalPosts`);
      return response.data;
    }
  });

  const onConfirm = () => {
    deletePost.mutate(undefined, {
      onSuccess: () => {
        toast.success("Post deleted successfully!");
        router.push("/journal");
      },
      onError: (err) => {
        console.error(err);
      }
    });
  };

  return (
    <>
      {/* CONFIRM */}
      <ConfirmModal
        open={showConfirmModal}
        setOpen={setShowConfirmModal}
        title={"Delete post"}
        // map post name to selectedPostId
        description={"Are you sure you want to delete this post?"}
        onConfirm={onConfirm}
        onConfirmText={"Delete this post"}
      />
      <Button
        variant={"destructive"}
        size="sm"
        disabled={deletePost.isPending}
        onClick={() => {
          setShowConfirmModal(true);
        }}
      >
        <Trash />
      </Button>
    </>
  );
};

export default DeleteButton;