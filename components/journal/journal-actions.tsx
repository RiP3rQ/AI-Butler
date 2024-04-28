"use client";

import { HistoryButton } from "@/components/journal/history-button";
import { SearchInput } from "@/components/journal/search-input";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";
import { Loader, X } from "lucide-react";

const JournalActions = () => {
  const [response, setResponse] = useState<string>("");
  const [isResponseLoading, setIsResponseLoading] = useState<boolean>(false);

  return (
    <div className={" w-full"}>
      <div className={"flex items-center justify-center gap-2"}>
        <HistoryButton />
        <SearchInput
          setResponseContent={setResponse}
          setIsResponseLoading={setIsResponseLoading}
          isResponseLoading={isResponseLoading}
        />
      </div>
      {isResponseLoading && (
        <div className={"my-2"}>
          <p
            className={
              "flex animate-pulse flex-col items-center justify-center text-lg"
            }
          >
            <Loader className={"h-8 w-8 animate-spin "} />
            AI Assistant is thinking...
          </p>
        </div>
      )}
      {response && (
        <Card className={"relative mt-1 w-full"}>
          <CardContent className={"p-0 pt-0"}>
            <div className={"grid h-full w-full grid-cols-12"}>
              <div
                className={
                  "col-span-4 flex flex-col items-center justify-center p-1"
                }
              >
                <p className={"text-xl font-bold underline"}>AI Response</p>
                <p className={"text-center text-xs"}>
                  This is the response from the AI assistant, based on the
                  content of your journal posts. Remember, the assistant is not
                  perfect, and it can make mistakes. Always double-check the
                  information.
                </p>
              </div>
              <div
                className={
                  "col-span-8 flex items-center justify-center border-l px-2"
                }
              >
                <p className={"p-2 text-sm"}>{response}</p>
              </div>
            </div>
          </CardContent>
          <div className={"absolute -right-2 -top-2"}>
            <div
              onClick={() => setResponse("")}
              className={
                "cursor-pointer rounded-full bg-red-500 p-1 text-white"
              }
            >
              <X className={"h-4 w-4"} />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default JournalActions;
