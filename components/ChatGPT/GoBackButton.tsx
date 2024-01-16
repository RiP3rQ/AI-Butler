"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {};

const GoBackButton = (props: Props) => {
  const router = useRouter();
  return (
    <ArrowLeft
      className="absolute right-3 top-3 h-10 w-10 cursor-pointer
 rounded-full bg-slate-500 text-white"
      onClick={() => router.push("/notes")}
    />
  );
};

export default GoBackButton;
