import { Metadata } from "next";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import SinglePdfContent from "@/components/pdfs/single-pdf-content";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "PDF | AI-Butler",
  description: "AI-Butler using OpenAI's API created by RiP3rQ",
  icons: {
    icon: "/favicon.ico",
  },
};

// get pdfName from the url Props
type Props = {
  params: {
    pdfName: string;
  };
};

export default async function SinglePdfPage({ params }: Props) {
  const { userId } = auth();

  if (!userId) {
    return redirect("/dashboard");
  }

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
              <BreadcrumbPage>{params.pdfName}.pdf</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Separator className={"mb-3 mt-1 w-full"} />

        <SinglePdfContent pdfName={params.pdfName} userId={userId} />
      </div>
    </div>
  );
}
