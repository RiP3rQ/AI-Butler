"use client";

import { HistoryButton } from "@/components/journal/HistoryButton";
import { SearchInput } from "@/components/journal/SearchInput";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader, X } from "lucide-react";

const JournalPageActions = () => {
  const [response, setResponse] = useState<string>("");
  const [isResponseLoading, setIsResponseLoading] = useState<boolean>(false);

  console.log("response", response);

  return (<div className={" w-full"}>
    <div className={"flex items-center justify-center gap-2"}>
      <HistoryButton />
      <SearchInput setResponseContent={setResponse} setIsResponseLoading={setIsResponseLoading}
                   isResponseLoading={isResponseLoading} />
    </div>
    {isResponseLoading &&
      <div className={"my-2"}>
        <p className={"text-lg animate-pulse flex items-center justify-center flex-col"}>
          <Loader className={"h-8 w-8 animate-spin "} />
          AI Assistant is thinking...
        </p>
      </div>
    }
    {response &&
      <Card className={"w-full mt-1 relative"}>
        <CardContent className={"p-0 pt-0"}>
          <div className={"grid grid-cols-12 w-full h-full"}>
            <div className={"col-span-4 flex items-center justify-center flex-col p-1"}>
              <p className={"text-xl font-bold underline"}>AI Response</p>
              <p className={"text-center text-xs"}>This is the response from the AI assistant,
                based on
                the content of your journal posts.
                Remember, the assistant is not perfect, and it can make mistakes. Always double-check the
                information.</p>
            </div>
            <div className={"col-span-8 border-l px-2 flex items-center justify-center"}>
              <p className={"text-sm p-2"}>{response}</p>
            </div>
          </div>
        </CardContent>
        <div className={"absolute -top-2 -right-2"}>
          <div
            onClick={() => setResponse("")}
            className={"bg-red-500 text-white p-1 rounded-full cursor-pointer"}
          >
            <X className={"h-4 w-4"} />
          </div>
        </div>
      </Card>}
  </div>);
};

export default JournalPageActions;