import ChatSidebar from "@/components/chatgpt/chat-sidebar";
import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

export const metadata: Metadata = {
  title: "ChatGPT | AI-Butler",
  description: "AI-Butler using OpenAI's API created by RiP3rQ",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function ChatgptLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-[calc(100vh-4rem)] px-0 lg:px-20">
      <div className={"w-full"}>
        <Breadcrumb className={"pt-4 text-xl font-bold"}>
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
        <Separator orientation={"horizontal"} className={"mb-2 w-full"} />
      </div>
      <div className={"flex"}>
        <aside
          className="max-w-xs overflow-y-auto
      md:min-w-[20rem]"
        >
          <ChatSidebar />
        </aside>

        <Separator
          orientation={"vertical"}
          className={"h-full text-black dark:text-muted-foreground"}
        />

        <main className="mx-2 flex-1 ">{children}</main>
      </div>
    </div>
  );
}
