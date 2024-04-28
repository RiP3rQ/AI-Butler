"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const CreateNewJournalPostModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          size={"icon"}
          className="relative rounded-full"
        >
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Notifications modal</span>
          <div className={"absolute right-[6px] top-0"}>
            <span
              className={
                "m-0 rounded-full bg-red-500 px-[4px] py-[1px] text-[9px] text-white"
              }
            >
              0
            </span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Newest notifications</DialogTitle>
          <DialogDescription>
            Read latest notifications and updates from AI-Butler. Stay tuned!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
        </div>
        <div className="grid gap-4 py-4">
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
        </div>
        <div className="grid gap-4 py-4">
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewJournalPostModal;
