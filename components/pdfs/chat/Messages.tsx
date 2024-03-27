import { Loader2, MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Message from "./Message";
import { useContext, useEffect, useRef } from "react";
import { ChatContext } from "./ChatContext";
import useSWR from "swr";

interface MessagesProps {
  fileId: string;
}

const fetchFileMessages = async (fileId: any, { limit, cursor }: any) => {
  const response = await fetch(`/api/fileMessages/${fileId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ limit, cursor })
  });
  return response.json();
};

const Messages = ({ fileId }: MessagesProps) => {
  const { isLoading: isAiThinking } =
    useContext(ChatContext);

  const { data, error, isValidating, mutate } = useSWR([fileId, { limit: INFINITE_QUERY_LIMIT }], fetchFileMessages, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 1000
  });

  const messages = data?.pages.flatMap(
    (page: any) => page.messages
  );

  const loadingMessage = {
    createdAt: new Date().toISOString(),
    id: "loading-message",
    isUserMessage: false,
    text: (
      <span className="flex h-full items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </span>
    )
  };

  const combinedMessages = [
    ...(isAiThinking ? [loadingMessage] : []),
    ...(messages ?? [])
  ];

  const lastMessageRef = useRef<HTMLDivElement>(null);

  const { ref, entry } = useIntersection({
    root: lastMessageRef.current,
    threshold: 1
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      mutate();
    }
  }, [entry, mutate]);

  return (
    <div
      className="flex max-h-[calc(100vh-3.5rem-7rem)] border-zinc-200 flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
      {combinedMessages && combinedMessages.length > 0 ? (
        combinedMessages.map((message, i) => {
          const isNextMessageSamePerson =
            combinedMessages[i - 1]?.isUserMessage ===
            combinedMessages[i]?.isUserMessage;

          if (i === combinedMessages.length - 1) {
            return (
              <Message
                ref={ref}
                message={message}
                isNextMessageSamePerson={
                  isNextMessageSamePerson
                }
                key={message.id}
              />
            );
          } else
            return (
              <Message
                message={message}
                isNextMessageSamePerson={
                  isNextMessageSamePerson
                }
                key={message.id}
              />
            );
        })
      ) : !data ? (
        <div className="w-full flex flex-col gap-2">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <MessageSquare className="h-8 w-8 text-blue-500" />
          <h3 className="font-semibold text-xl">
            You&apos;re all set!
          </h3>
          <p className="text-zinc-500 text-sm">
            Ask your first question to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default Messages;