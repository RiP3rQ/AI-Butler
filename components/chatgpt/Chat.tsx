"use client";
import { ArrowDown } from "lucide-react";
import Message from "./Message";
import axios from "axios";
import { useEffect, useState } from "react";
import { ChatMessage } from "@prisma/client";
import { useUser } from "@clerk/nextjs";

type Props = {
  chatId: string;
  refetchMessages: () => void;
  refetchMessagesBoolean: boolean;
};

const Chat = ({ chatId, refetchMessages, refetchMessagesBoolean }: Props) => {
  const { user } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!chatId) return;
    if (!user) return;
    if (!refetchMessagesBoolean) return;
    setLoading(true);
    const fetchMessages = async () => {
      const res = await axios.get(`/api/chatgpt/chat/${chatId}`);
      setMessages(res.data.messages);
      setLoading(false);
      refetchMessages();
    };
    fetchMessages();
  }, [chatId, user, refetchMessagesBoolean]);

  console.log(refetchMessagesBoolean);
  console.log("Messages:", messages);

  if (loading)
    return (
      <div className="flex-1 overflow-y-auto overflow-x-hidden text-black dark:text-muted-foreground">
        <p className="mt-10 text-center ">Loading...</p>
      </div>
    );

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden text-black dark:text-muted-foreground">
      {messages?.length === 0 && (
        <>
          <p className="mt-10 text-center ">
            Type a prompt in below to get started!
          </p>
          <ArrowDown className="mx-auto mt-5 h-10 w-10 animate-bounce " />
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
