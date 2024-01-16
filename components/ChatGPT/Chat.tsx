"use client";
import { ArrowDown } from "lucide-react";
import Message from "./Message";
import { useState } from "react";

type Props = {
  chatId: string;
};

const Chat = ({ chatId }: Props) => {
  const [messages, setMessages] = useState([]);

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden">
      {messages && (
        <>
          <p className="mt-10 text-center text-white">
            Type a prompt in below to get started!
          </p>
          <ArrowDown className="mx-auto mt-5 h-10 w-10 animate-bounce text-white" />
        </>
      )}
      {messages?.map((message: any) => (
        <Message key={message.id} message={message.data()} />
      ))}
    </div>
  );
};

export default Chat;
