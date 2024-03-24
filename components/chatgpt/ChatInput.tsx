"use client";

import axios from "axios";
import { SendHorizonal } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

type Props = {
  chatId: string;
  refetchMessages: () => void;
};

const ChatInput = ({ chatId, refetchMessages }: Props) => {
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt) return;

    setLoading(true);

    const notification = toast.loading("ChatGPT is thinking!", {
      position: "top-right"
    });

    await axios
      .post(`/api/chatgpt/chat/${chatId}`, {
        prompt,
        chatId
      })
      .then(() => {
        setPrompt("");
        toast.success("ChatGPT has responded!", {
          id: notification,
          position: "top-right"
        });
      })
      .catch(() => {
        toast.error("ChatGPT failed to respond!", {
          id: notification,
          position: "top-right"
        });
      })
      .finally(() => {
        refetchMessages();
        setLoading(false);
      });
  };

  return (
    <div className="rounded-lg bg-gray-700/50 text-sm dark:text-muted-foreground">
      <form onSubmit={sendMessage} className="flex space-x-5 p-5">
        <input
          disabled={loading}
          className="flex-1 bg-transparent focus:outline-none disabled:cursor-not-allowed disabled:text-gray-300 placeholder:dark:text-muted-foreground placeholder:text-gray-500 dark:placeholder:dark:text-muted-foreground dark:placeholder:text-dark"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          type="text"
          placeholder="Type your message here..."
        />
        <button
          disabled={!prompt || loading}
          type="submit"
          className="rounded bg-[#11A37F] px-4 py-2 
          font-bold text-white hover:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          <SendHorizonal className="h-4 w-4 -rotate-45" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
