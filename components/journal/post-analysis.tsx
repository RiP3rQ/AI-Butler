"use client";

import useSWR from "swr";
import React, { useState } from "react";
import { fetcher } from "@/lib/fetcher";
import { Button } from "@/components/ui/button";
import { PanelLeftClose } from "lucide-react";
import AnalysisModal from "@/components/modals/analysis-modal";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface Props {
  postId: string;
  userId: string;
}

const PostAnalysis = ({ postId, userId }: Props) => {
  const [showAnalysis, setShowAnalysis] = useState(true);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [postAnalysisData, setPostAnalysisData] = useState<any | null>(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const { data } = useSWR(
    `${process.env.NEXT_PUBLIC_URL}/api/journal/${postId}`,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateOnMount: true,
    },
  );

  const postAnalysis = data?.data;

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

  if (!postAnalysis) {
    return null;
  }

  return (
    <>
      {/* ANALYSIS MODAL*/}
      <AnalysisModal
        open={showAnalysisModal}
        setOpen={setShowAnalysisModal}
        postAnalysisData={postAnalysisData}
        setPostAnalysisData={setPostAnalysisData}
        isAnalysisLoading={isAnalysisLoading}
      />

      <Button
        variant={"default"}
        size={"sm"}
        className={"flex items-center justify-center gap-2"}
        onClick={() => {
          setShowAnalysisModal(true);
          fetchPostAnalysis.mutate(Number(postId));
        }}
      >
        <PanelLeftClose className={"h-6 w-6"} />
        Analysis
      </Button>
    </>
  );
};

export default PostAnalysis;
