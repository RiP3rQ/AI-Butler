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
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "Notes | AI-Butler",
  description: "AI-Butler using OpenAI's API created by RiP3rQ",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function NotesPage() {
  const { userId } = auth();

  if (!userId) {
    throw new Error("UserId is not defined");
  }

  return (
    <div className={"relative mx-auto min-h-[calc(100vh-4rem)] max-w-7xl"}>
      <Breadcrumb className={"pt-4 text-xl font-bold"}>
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
