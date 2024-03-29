"use client";

import { useState } from "react";
import { Ghost, Loader2, Plus, Trash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import moment from "moment";
import { Button } from "@/components/ui/button";
import UploadButton from "@/components/pdfs/UploadButton";
import useSWR, { mutate } from "swr";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { fetcher } from "@/lib/fetcher";

const PdfsDashboard = () => {
  const [currentlyDeletingFile, setCurrentlyDeletingFile] =
    useState<string>("");
  const { data, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_URL}/api/pdfs`,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateOnMount: true,
    },
  );
  const files = data?.data;

  const deletePdf = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/pdfs/deletePdf", {
        pdfId: currentlyDeletingFile,
      });
      await mutate(`${process.env.NEXT_PUBLIC_URL}/api/pdfs`);
      return response.data;
    },
  });

  return (
    <div className={"flex w-full flex-col items-center justify-center"}>
      <div className="mt-8 flex w-full flex-col items-center justify-center border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <UploadButton isSubscribed={false} />
      </div>

      {/* display all user files */}
      {files && files?.length !== 0 ? (
        <ul className="mt-8 grid w-full grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
          {files
            .sort(
              (a: any, b: any) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )
            .map((file: any) => (
              <li
                key={file.id}
                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
              >
                <Link
                  href={`/pdfs/${file.key.replace(".pdf", "")}`}
                  className="flex flex-col gap-2"
                >
                  <div className="flex w-full items-center justify-between space-x-6 px-6 pt-6">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="truncate text-lg font-medium text-zinc-900">
                          {file.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="mt-4 flex w-full items-center justify-between gap-6 px-6 py-2 text-xs text-zinc-500">
                  <div className="flex w-[40px] items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {moment(file.createdAt).format("MMM DD, YYYY")}
                  </div>

                  <Button
                    onClick={() => {
                      setCurrentlyDeletingFile(file.id);
                      deletePdf.mutate(undefined, {
                        onSuccess: () => {
                          toast.success("PDF deleted!");
                          setCurrentlyDeletingFile("");
                        },
                        onError: (err) => {
                          console.error(err);
                        },
                      });
                    }}
                    size="sm"
                    className={"w-20"}
                    variant="destructive"
                  >
                    {currentlyDeletingFile === file.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </li>
            ))}
        </ul>
      ) : isLoading ? (
        PdfsDashboardSkeleton()
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <Ghost className="h-8 w-8 text-zinc-800" />
          <h3 className="text-xl font-semibold">Pretty empty around here</h3>
          <p>Let&apos;s upload your first PDF.</p>
        </div>
      )}
    </div>
  );
};

export default PdfsDashboard;

const PdfsDashboardSkeleton = () => {
  return (
    <div className={"flex"}>
      <div className={"flex w-full items-center justify-center"}>
        <main className="mx-auto max-w-7xl md:p-10">
          <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
            <Skeleton className="h-4 w-[50px]" />

            <Skeleton className="h-4 w-[50px]" />
          </div>
          <Skeleton className="my-2 h-1 w-full" />
          <div className="flex items-center justify-center">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </main>
      </div>
      <div className={"flex w-full items-center justify-center"}>
        <main className="mx-auto max-w-7xl md:p-10">
          <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
            <Skeleton className="h-4 w-[50px]" />

            <Skeleton className="h-4 w-[50px]" />
          </div>
          <Skeleton className="my-2 h-1 w-full" />
          <div className="flex items-center justify-center">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </main>
      </div>
      <div className={"flex w-full items-center justify-center"}>
        <main className="mx-auto max-w-7xl md:p-10">
          <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
            <Skeleton className="h-4 w-[50px]" />

            <Skeleton className="h-4 w-[50px]" />
          </div>
          <Skeleton className="my-2 h-1 w-full" />
          <div className="flex items-center justify-center">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </main>
      </div>
    </div>
  );
};
