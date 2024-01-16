import React from "react";
import ChatInput from "@/components/ChatGPT/ChatInput";
import Chat from "@/components/ChatGPT/Chat";

type Props = {
  params: {
    id: string;
  };
};

function ChatPage({ params: { id } }: Props) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Chat */}
      <Chat chatId={id} />
      {/* ChatInput */}
      <ChatInput chatId={id} />
    </div>
  );
}

export default ChatPage;
