"use client";

import axios from "axios";
import { Check, Edit, MessageCircleMore, Trash, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";

type Props = {
  id: string;
  title: string;
};

function ChatRow({ id, title }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>(title);

  useEffect(() => {
    if (!pathname) return;

    setActive(pathname.includes(id));
  }, [pathname]);

  const removeChat = async () => {
    await axios.delete(`/api/chatgpt/chat/${id}`);
    router.push("/chatgpt");
  };

  const handleEditChat = async () => {
    await axios
      .put(`/api/chatgpt/chat/${id}`, { newName: newTitle })
      .then(() => {
        setEditing(false);
      })
      .then(() => {
        window.location.reload();
      });
  };

  if (editing) {
    return (
      <form
        className={`chatRow justify-center text-black dark:text-muted-foreground ${active && "bg-gray-700/50"}`}
        onSubmit={handleEditChat}
      >
        <Input
          type="text"
          className="flex-1 truncate bg-transparent outline-none"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <Check
          className="h5 w-5 hover:text-green-500"
          onClick={handleEditChat}
        />
        <X
          className="h5 w-5 hover:text-red-700"
          onClick={() => setEditing(false)}
        />
      </form>
    );
  }

  return (
    <Link
      href={`/chatgpt/${id}`}
      className={`chatRow justify-center text-black dark:text-muted-foreground ${active && "bg-gray-700/50"}`}
    >
      <MessageCircleMore className="h5 w-5" />
      <p className="hidden flex-1 truncate md:inline-flex">{title}</p>
      <Edit
        className="h5 w-5 hover:text-blue-700"
        onClick={() => setEditing(!editing)}
      />
      <Trash
        className="h5 w-5 hover:text-red-700"
        onClick={removeChat}
      />
    </Link>
  );
}

export default ChatRow;
