"use client";

import { PdfFilesType } from "@/drizzle/schema";
import { redirect } from "next/navigation";
import PdfRenderer from "@/components/pdfs/renderer/pdf-renderer";
import ChatWrapper from "@/components/pdfs/chat/chat-wrapper";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

interface Props {
  pdfName: string;
  userId: string | null;
}

const SinglePdfContent = ({ pdfName, userId }: Props) => {
  if (!userId) redirect("/dashboard");
  const fullPdfName = pdfName + ".pdf";

  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_URL}/api/pdfs/singlePdf/${fullPdfName}`,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateOnMount: true,
    },
  );

  const file: PdfFilesType[] = data?.data;

  if (error) redirect("/dashboard");

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-1 flex-col justify-between overflow-hidden">
      <div className="max-w-8xl mx-auto h-full w-full grow lg:flex xl:px-2">
        <div className="h-full flex-1 xl:flex">
          <div className="h-full px-4 py-1 xl:flex-1">
            <PdfRenderer url={file?.[0].url} />
          </div>
        </div>

        <div className="flex-[0.75] shrink-0 overflow-y-auto border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
          <ChatWrapper isSubscribed={false} file={file?.[0]} />
        </div>
      </div>
    </div>
  );
};

export default SinglePdfContent;
