"use client";
import React from "react";
import ChatInput from "@/components/ChatGPT/ChatInput";
import Chat from "@/components/ChatGPT/Chat";
import { usePathname } from "next/navigation";

type Props = {};

const ChatPage: React.FC<Props> = ({}) => {
  const ChatId = usePathname().split("/")[2];
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Chat */}
      <Chat chatId={ChatId} />
      {/* ChatInput */}
      <ChatInput chatId={ChatId} />
    </div>
  );
};

export default ChatPage;
