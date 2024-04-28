"use client";
import React, { useState } from "react";
import ChatInput from "@/components/chatgpt/chat-input";
import Chat from "@/components/chatgpt/chat";
import { usePathname } from "next/navigation";

type Props = {};

const ChatPage: React.FC<Props> = ({}) => {
  const ChatId = usePathname().split("/")[2];
  const [refetchMessagesBoolean, setRefetchMessagesBoolean] = useState(true);

  const refetchMessages = () => {
    setRefetchMessagesBoolean(!refetchMessagesBoolean);
  };

  console.log("Refetching status:", refetchMessagesBoolean);

  return (
    <div className="flex h-[calc(100vh-9rem)] flex-col overflow-hidden pb-2">
      {/* Chat */}
      <Chat
        chatId={ChatId}
        refetchMessages={refetchMessages}
        refetchMessagesBoolean={refetchMessagesBoolean}
      />
      {/* ChatInput */}
      <ChatInput chatId={ChatId} refetchMessages={refetchMessages} />
    </div>
  );
};

export default ChatPage;
