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

export const metadata: Metadata = {
  title: "AI-Butler - Pdfs",
  description:
    "AI-Butler using OpenAI's API created by RiP3rQ using Sonny Sangha's and Coding in Flow's tutorials",
  icons: {
    icon: "/favicon.ico"
  }
};

export default async function PdfsPage() {
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
              <BreadcrumbPage>
                PDFs
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Separator className={"mt-1 mb-1 w-full"} />

        <PdfsDashboard />
      </div>
    </div>
  );
}