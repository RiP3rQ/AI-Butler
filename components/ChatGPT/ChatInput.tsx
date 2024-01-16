"use client";

import { SendHorizonal } from "lucide-react";
import { FormEvent, useState } from "react";
import useSWR from "swr";

type Props = {
  chatId: string;
};

const ChatInput = ({ chatId }: Props) => {
  const [prompt, setPrompt] = useState<string>("");

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt) return;

    const input = prompt.trim();
    setPrompt("");

    // const message: Message = {
    //   text: input,
    //   createdAt: serverTimestamp(),
    //   user: {
    //     _id: session?.user?.email!,
    //     name: session?.user?.name!,
    //     avatar:
    //       session?.user?.image! ||
    //       `https://ui-avatars.com/api/?name=${session?.user?.name}`,
    //   },
    // };

    // await addDoc(
    //   collection(
    //     db,
    //     "users",
    //     session?.user?.email!,
    //     "chats",
    //     chatId,
    //     "messages"
    //   ),
    //   message
    // );

    // Toast notification to say thinking!
    // const notification = toast.loading("ChatGPT is thinking!");
    // Toast notifications
    // await fetch("/api/askQuestion", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     prompt: input,
    //     chatId,
    //     model,
    //     session,
    //   }),
    // }).then(() => {
    //   // Toast notification to say successfully!
    //   toast.success("ChatGPT has responded!", {
    //     id: notification,
    //   });
    // });
  };

  return (
    <div className="rounded-lg bg-gray-700/50 text-sm text-gray-400 ">
      <form onSubmit={sendMessage} className="flex space-x-5 p-5">
        <input
          className="flex-1 bg-transparent focus:outline-none disabled:cursor-not-allowed disabled:text-gray-300"
          //   disabled={!session}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          type="text"
          placeholder="Type your message here..."
        />
        <button
          //   disabled={!prompt || !session}
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
