import Sidebar from "@/components/chatgpt/Sidebar";
import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import React from "react";

export const metadata: Metadata = {
  title: "AI-Butler - ChatGPT",
  description:
    "AI-Butler using OpenAI's API created by RiP3rQ using Sonny Sangha's and Coding in Flow's tutorials"
};

export default function ChatgptLayout({
                                        children
                                      }: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-[calc(100vh-4rem)] px-0 lg:px-20">
      <div className={"w-full"}>
        <Breadcrumb className={"text-xl font-bold pt-4"}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>ChatGPT</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Separator orientation={"horizontal"} className={"w-full mb-2"} />
      </div>
      <div className={"flex"}>
        <aside
          className="max-w-xs overflow-y-auto
      md:min-w-[20rem]"
        >
          <Sidebar />
        </aside>

        <Separator orientation={"vertical"} className={"h-full text-black dark:text-muted-foreground"} />

        <main className="flex-1 mx-2 ">{children}</main>
      </div>

    </div>
  );
}
