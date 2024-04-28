import { cn } from "@/lib/utils";
import { Message } from "ai/react";
import { Loader2 } from "lucide-react";
import React from "react";
import { PdfFileMessagesType } from "@/drizzle/schema";
import moment from "moment";

interface Props {
  isLoading: boolean;
  messages: Message[] | PdfFileMessagesType[];
}

const MessageList = ({ messages, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!messages) return <></>;

  return (
    <div className="flex flex-col gap-2 px-4">
      {messages.map((message) => {
        return (
          <div
            key={message.id}
            className={cn("flex", {
              "justify-end pl-10":
                //@ts-ignore
                message?.role === "user" || message?.isUserMessage === true,

              "justify-start pr-10":
                //@ts-ignore
                message?.role === "assistant" ||
                //@ts-ignore
                message?.isUserMessage === false,
            })}
          >
            <div
              className={cn(
                "rounded-lg px-3 py-1 text-sm text-muted-foreground shadow-md ring-1 ring-gray-900/10",
                {
                  "bg-blue-600 text-white":
                    //@ts-ignore
                    message?.role === "user" || message?.isUserMessage === true,
                },
              )}
            >
              {/*@ts-ignore*/}
              <p>{message?.content || message?.text}</p>
              <div className={"flex w-full items-center justify-end text-xs"}>
                {moment(message?.createdAt).format("HH:mm")}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
