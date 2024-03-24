"use client";

import NewChat from "./NewChat";
import ChatRow from "./ChatRow";
import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";
import { Separator } from "../ui/separator";
import axios from "axios";
import { Chat } from "@prisma/client";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const [chats, setChats] = useState<Chat[]>();
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    const fetchChats = async () => {
      const res = await axios.get("/api/chatgpt/chat").then((res) => {
        setChats(res.data.chats);
        setLoading(false);
      });
    };

    fetchChats();
  }, [pathname]);

  return (
    <div className="flex h-full flex-col p-2">
      <div className="flex-1">
        <NewChat />

        {/* Chat list - map through them */}
        <div className="my-2 flex flex-col space-y-2">
          {loading && (
            <div className="animate-pulse text-center text-muted">
              <p>Loading Chats...</p>
            </div>
          )}

          {chats?.map((chat: any) => (
            <ChatRow key={chat.id} id={chat.id} title={chat.title} />
          ))}
        </div>
      </div>

      <Separator className="mx-auto my-3 w-[80%] bg-slate-500" />

      <div className="flex items-center justify-center">
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            baseTheme: theme === "dark" ? dark : undefined,
            elements: {
              avatarBox: {
                width: "3rem",
                height: "3rem"
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default Sidebar;
