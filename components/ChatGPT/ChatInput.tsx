"use client";

import axios from "axios";
import { SendHorizonal } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

type Props = {
  chatId: string;
};

const ChatInput = ({ chatId }: Props) => {
  const [prompt, setPrompt] = useState<string>("");

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt) return;

    const notification = toast.loading("ChatGPT is thinking!", {
      position: "top-right",
    });

    await axios
      .post(`/api/chatgpt/chat/${chatId}`, {
        prompt,
        chatId,
      })
      .then(() => {
        toast.success("ChatGPT has responded!", {
          id: notification,
          position: "top-right",
        });
      })
      .catch(() => {
        toast.error("ChatGPT failed to respond!", {
          id: notification,
          position: "top-right",
        });
      })
      .finally(() => {
        setPrompt("");
      });
  };

  return (
    <div className="rounded-lg bg-gray-700/50 text-sm text-gray-400 ">
      <form onSubmit={sendMessage} className="flex space-x-5 p-5">
        <input
          className="flex-1 bg-transparent focus:outline-none disabled:cursor-not-allowed disabled:text-gray-300"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          type="text"
          placeholder="Type your message here..."
        />
        <button
          disabled={!prompt}
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
