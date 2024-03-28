import { cn } from "@/lib/utils";
import { Message } from "ai/react";
import { Loader2 } from "lucide-react";
import React from "react";
import { PdfFileMessagesType } from "@/lib/drizzle/schema";

interface Props {
  isLoading: boolean;
  messages: Message[] | PdfFileMessagesType[];
}

const MessageList = ({ messages, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader2 className="w-6 h-6 animate-spin" />
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
              //@ts-ignore
              "justify-end pl-10": message?.role === "user" || message?.isUserMessage === true,
              //@ts-ignore
              "justify-start pr-10": message?.role === "assistant" || message?.isUserMessage === false
            })}
          >
            <div
              className={cn(
                "rounded-lg px-3 text-sm py-1 shadow-md ring-1 ring-gray-900/10",
                {
                  //@ts-ignore
                  "bg-blue-600 text-white": message?.role === "user" || message?.isUserMessage === true
                }
              )}
            >
              {/*@ts-ignore*/}
              <p>{message?.content || message?.text}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;