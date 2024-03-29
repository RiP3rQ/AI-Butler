"use client";

import Messages from "./Messages";
import { ChevronLeft, Loader2, Send, XCircle } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { useChat } from "ai/react";
import { PdfFilesType } from "@/lib/drizzle/schema";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";

const PLANS = [
  {
    name: "Free",
    pagesPerPdf: 10,
  },
  {
    name: "Pro",
    pagesPerPdf: 100,
  },
];

interface ChatWrapperProps {
  file: PdfFilesType;
  isSubscribed: boolean;
}

const ChatWrapper = ({ file, isSubscribed }: ChatWrapperProps) => {
  const { data: MessagesData, isLoading } = useQuery({
    queryKey: ["pdf_file_messages", file?.id],
    queryFn: async () => {
      const { data } = await axios.post(`/api/pdfs/singlePdf/messages`, {
        pdfId: file?.id,
      });
      return data?.data;
    },
  });

  const {
    input,
    handleInputChange,
    handleSubmit,
    messages,
    isLoading: isResponseLoading,
  } = useChat({
    api: "/api/pdfs/message",
    body: {
      fileId: file?.id,
      fileKey: file?.key,
    },
    initialMessages: MessagesData || [],
  });

  useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  if (!file)
    return (
      <div className="relative flex min-h-full flex-col justify-between gap-2 divide-y divide-zinc-200 bg-zinc-50">
        <div className="mb-28 flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <h3 className="text-xl font-semibold">Loading...</h3>
            <p className="text-sm text-zinc-500">
              We&apos;re preparing your PDF.
            </p>
          </div>
        </div>
      </div>
    );

  if (file?.uploadStatus === "PROCESSING")
    return (
      <div className="relative flex min-h-full flex-col justify-between gap-2 divide-y divide-zinc-200 bg-zinc-50">
        <div className="mb-28 flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <h3 className="text-xl font-semibold">Processing PDF...</h3>
            <p className="text-sm text-zinc-500">This won&apos;t take long.</p>
          </div>
        </div>
      </div>
    );

  if (file?.uploadStatus === "FAILED")
    return (
      <div className="relative flex min-h-full flex-col justify-between gap-2 divide-y divide-zinc-200 bg-zinc-50">
        <div className="mb-28 flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <XCircle className="h-8 w-8 text-red-500" />
            <h3 className="text-xl font-semibold">Too many pages in PDF</h3>
            <p className="text-sm text-zinc-500">
              Your{" "}
              <span className="font-medium">
                {isSubscribed ? "Pro" : "Free"}
              </span>{" "}
              plan supports up to{" "}
              {isSubscribed
                ? PLANS.find((p: any) => p.name === "Pro")?.pagesPerPdf
                : PLANS.find((p: any) => p.name === "Free")?.pagesPerPdf}{" "}
              pages per PDF.
            </p>
            <Link
              href={"/dashboard"}
              className={buttonVariants({
                variant: "secondary",
                className: "mt-4",
              })}
            >
              <ChevronLeft className="mr-1.5 h-3 w-3" />
              Back
            </Link>
          </div>
        </div>
      </div>
    );

  return (
    <div
      className="relative flex min-h-full flex-col justify-between gap-2 divide-y divide-zinc-200 overflow-y-auto bg-zinc-50"
      id="message-container"
    >
      <div className=" flex flex-1 flex-col justify-between overflow-y-auto pt-3">
        <Messages messages={messages} isLoading={isLoading} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="sticky inset-x-0 bottom-0 bg-white px-2 pt-4"
      >
        <div className="flex">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask any question..."
            className="w-full"
            disabled={isResponseLoading}
          />
          <Button className="ml-2 bg-blue-600" disabled={isResponseLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatWrapper;
