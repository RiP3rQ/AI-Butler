import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import React from "react";
import NotesGrid from "@/components/notes/NotesGrid";

export const metadata: Metadata = {
  title: "AI-Butler - Notes",
  description:
    "AI-Butler using OpenAI's API created by RiP3rQ using Sonny Sangha's and Coding in Flow's tutorials"
};

export default async function NotesPage() {
  const { userId } = auth();

  if (!userId) {
    throw new Error("UserId is not defined");
  }
  
  return (
    <div className={"relative min-h-[calc(100vh-4rem)]"}>
      <NotesGrid />
    </div>
  );
}
