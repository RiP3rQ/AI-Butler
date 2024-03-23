"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogBody } from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import { mutate } from "swr";

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
                deletePost.mutate(undefined, {
                  onSuccess: () => {
                    router.push("/journal");
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