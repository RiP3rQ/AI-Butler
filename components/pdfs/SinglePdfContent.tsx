"use client";

import { PdfFilesType } from "@/lib/drizzle/schema";
import { redirect } from "next/navigation";
import PdfRenderer from "@/components/pdfs/renderer/PdfRenderer";
import ChatWrapper from "@/components/pdfs/chat/ChatWrapper";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

interface Props {
  pdfName: string;
  userId: string | null;
}

const SinglePdfContent = ({ pdfName, userId }: Props) => {
  if (!userId) redirect("/dashboard");
  const fullPdfName = pdfName + ".pdf";

  const { data, error } = useSWR(`${process.env.NEXT_PUBLIC_URL}/api/pdfs/singlePdf/${fullPdfName}`, fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    revalidateOnMount: true
  });

  const file: PdfFilesType[] = data?.data;

  if (error) redirect("/dashboard");

  return (
    <div className="flex-1 justify-between flex flex-col h-[calc(100vh-8rem)] overflow-hidden">
      <div className="mx-auto h-full w-full max-w-8xl grow lg:flex xl:px-2">
        <div className="flex-1 xl:flex h-full">
          <div className="px-4 py-1 xl:flex-1 h-full">
            <PdfRenderer url={file?.[0].url} />
          </div>
        </div>

        <div
          className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0 overflow-y-auto">
          <ChatWrapper isSubscribed={false} file={file?.[0]} />
        </div>
      </div>
    </div>
  );
};

export default SinglePdfContent;