"use client";

import { MessageCircleMore, Trash } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {
  id: string;
};

function ChatRow({ id }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState<boolean>(false);

  //   const [messages] = useCollection(
  //     collection(db, "users", session?.user?.email!, "chats", id, "messages")
  //   );

  useEffect(() => {
    if (!pathname) return;

    setActive(pathname.includes(id));
  }, [pathname]);

  //   const removeChat = async () => {
  //     await deleteDoc(doc(db, "users", session?.user?.email!, "chats", id));
  //     router.replace("/");
  //   };

  return (
    <Link
      href={`/chat/${id}`}
      className={`chatRow justify-center ${active && "bg-gray-700/50"}`}
    >
      <MessageCircleMore className="h5 w-5" />
      <p className="hidden flex-1 truncate md:inline-flex">
        {/* {messages?.docs[messages?.docs.length - 1]?.data().text || "New Chat"} */}
        New chat
      </p>
      <Trash
        className="h5 w-5 text-gray-700 hover:text-red-700"
        // onClick={removeChat}
      />
    </Link>
  );
}

export default ChatRow;
