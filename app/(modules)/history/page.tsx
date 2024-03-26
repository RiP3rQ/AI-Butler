import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { redirect } from "next/navigation";
import { ActivityList } from "@/components/auditLog/ActivityList";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "AI-Butler - History",
  description:
    "AI-Butler using OpenAI's API created by RiP3rQ using Sonny Sangha's and Coding in Flow's tutorials"
};

export default async function NotesPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/dashboard");
  }

  // FINAL VERSION: ADD Sorting and filtering of audit logs + pagination

  return (
    <div className={"relative mx-auto min-h-[calc(100vh-4rem)] max-w-7xl"}>
      <Breadcrumb className={"pt-4 text-xl font-bold"}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>History</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Separator className={"my-2"} />

      <ActivityList />
    </div>
  );
}
