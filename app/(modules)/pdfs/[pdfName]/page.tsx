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
import { Separator } from "@/components/ui/separator";
import PdfsDashboard from "@/components/pdfs/PdfsDashboard";
import SinglePdfContent from "@/components/pdfs/SinglePdfContent";
import { auth } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "AI-Butler - PDF",
  description:
    "AI-Butler using OpenAI's API created by RiP3rQ using Sonny Sangha's and Coding in Flow's tutorials",
  icons: {
    icon: "/favicon.ico"
  }
};

// get pdfName from the url Props
type Props = {
  params: {
    pdfName: string;
  };
};

export default async function SinglePdfPage({ params }: Props) {
  const { userId } = auth();
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-7xl">
        <Breadcrumb className={"w-full pt-4 text-xl font-bold"}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/pdfs">Pdfs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {params.pdfName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Separator className={"mt-1 mb-3 w-full"} />

        <SinglePdfContent pdfName={params.pdfName} userId={userId} />
      </div>
    </div>
  );
}