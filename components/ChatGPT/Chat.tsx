"use client";
import { ArrowDown } from "lucide-react";
import Message from "./Message";
import axios from "axios";
import { useEffect, useState } from "react";
import { ChatMessage } from "@prisma/client";
import { useUser } from "@clerk/nextjs";

type Props = {
  chatId: string;
};

const Chat = ({ chatId }: Props) => {
  const { user } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await axios.get(`/api/chatgpt/chat/${chatId}`);
      setMessages(res.data.messages);
      setLoading(false);
    };
    fetchMessages();
  }, []);

  console.log(messages);

  if (loading)
    return (
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <p className="mt-10 text-center text-white">Loading...</p>
      </div>
    );

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden">
      {!messages && (
        <>
          <p className="mt-10 text-center text-white">
            Type a prompt in below to get started!
          </p>
          <ArrowDown className="mx-auto mt-5 h-10 w-10 animate-bounce text-white" />
        </>
      )}
      {messages && messages.length > 0 && (
        <div className="mt-10">
          {messages?.map((message: any) => (
            <Message
              key={message.id}
              message={message}
              userAvatar={user?.imageUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Chat;
