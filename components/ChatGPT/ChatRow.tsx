"use client";

import axios from "axios";
import { MessageCircleMore, Trash } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {
  id: string;
  title: string;
};

function ChatRow({ id, title }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState<boolean>(false);

  useEffect(() => {
    if (!pathname) return;

    setActive(pathname.includes(id));
  }, [pathname]);

  const removeChat = async () => {
    await axios.delete(`/api/chatgpt/chat/${id}`);
    router.push("/chatgpt");
  };

  return (
    <Link
      href={`/chatgpt/${id}`}
      className={`chatRow justify-center ${active && "bg-gray-700/50"}`}
    >
      <MessageCircleMore className="h5 w-5" />
      <p className="hidden flex-1 truncate md:inline-flex">{title}</p>
      <Trash
        className="h5 w-5 text-gray-700 hover:text-red-700"
        onClick={removeChat}
      />
    </Link>
  );
}

export default ChatRow;
