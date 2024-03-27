"use client";

import ChatInput from "./ChatInput";
import Messages from "./Messages";
import { ChevronLeft, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ChatContextProvider } from "./ChatContext";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

const PLANS = [
  {
    name: "Free",
    pagesPerPdf: 10
  },
  {
    name: "Pro",
    pagesPerPdf: 100
  }
];

interface ChatWrapperProps {
  fileKey: string;
  isSubscribed: boolean;
}

const ChatWrapper = ({
                       fileKey,
                       isSubscribed
                     }: ChatWrapperProps) => {

  const { data, error } = useSWR(`${process.env.NEXT_PUBLIC_URL}/api/pdfs/singlePdf/${fileKey}`, fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    revalidateOnMount: true
  });

  if (error)
    return (
      <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <XCircle className="h-8 w-8 text-red-500" />
            <h3 className="font-semibold text-xl">
              Error loading PDF
            </h3>
            <p className="text-zinc-500 text-sm">
              There was an error loading the PDF.
            </p>
            <Link
              href={"/pdfs"}
              className={buttonVariants({
                variant: "secondary",
                className: "mt-4"
              })}>
              <ChevronLeft className="h-3 w-3 mr-1.5" />
              Back
            </Link>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    );

  if (!data)
    return (
      <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <h3 className="font-semibold text-xl">
              Loading...
            </h3>
            <p className="text-zinc-500 text-sm">
              We&apos;re preparing your PDF.
            </p>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    );

  if (data?.status === "PROCESSING")
    return (
      <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <h3 className="font-semibold text-xl">
              Processing PDF...
            </h3>
            <p className="text-zinc-500 text-sm">
              This won&apos;t take long.
            </p>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    );

  if (data?.status === "FAILED")
    return (
      <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <XCircle className="h-8 w-8 text-red-500" />
            <h3 className="font-semibold text-xl">
              Too many pages in PDF
            </h3>
            <p className="text-zinc-500 text-sm">
              Your{" "}
              <span className="font-medium">
                {isSubscribed ? "Pro" : "Free"}
              </span>{" "}
              plan supports up to{" "}
              {isSubscribed
                ? PLANS.find((p: any) => p.name === "Pro")
                  ?.pagesPerPdf
                : PLANS.find((p: any) => p.name === "Free")
                  ?.pagesPerPdf}{" "}
              pages per PDF.
            </p>
            <Link
              href={"/dashboard"}
              className={buttonVariants({
                variant: "secondary",
                className: "mt-4"
              })}>
              <ChevronLeft className="h-3 w-3 mr-1.5" />
              Back
            </Link>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    );

  return (
    <ChatContextProvider fileId={data?.id}>
      <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
        <div className="flex-1 justify-between flex flex-col mb-28">
          {/*<Messages fileId={data?.id} />*/}
        </div>

        <ChatInput />
      </div>
    </ChatContextProvider>
  );
};

export default ChatWrapper;