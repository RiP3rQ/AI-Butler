import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import React from "react";
import NotesGrid from "@/components/notes/NotesGrid";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

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
    <div className={"relative min-h-[calc(100vh-4rem)] max-w-7xl mx-auto"}>
      <Breadcrumb className={"text-xl font-bold pt-4"}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Notes</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <NotesGrid />
    </div>
  );
}
