import { auth } from "@clerk/nextjs";
import { ChatMessage } from "@prisma/client";
import Image from "next/image";
import chatgptLogo from "@/public/Chatgpt.png";

type Props = {
  message: ChatMessage;
  userAvatar: string | undefined;
};

function Message({ message, userAvatar }: Props) {
  const isUserMessage = message.userId !== "chatgpt";

  const AvatarImage = isUserMessage ? userAvatar : (chatgptLogo as any);

  return (
    <div className={`py-5 text-white ${isUserMessage && "bg-[#434654]"}`}>
      <div className="mx-auto flex max-w-2xl space-x-5 px-10">
        <Image
          src={AvatarImage}
          alt="Avatar"
          width={32}
          height={32}
          className="h-8 w-8 object-cover"
        />
        <p className="pt-1 text-sm">{message.content}</p>
      </div>
    </div>
  );
}

export default Message;
