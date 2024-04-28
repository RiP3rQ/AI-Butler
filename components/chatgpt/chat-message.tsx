import Image from "next/image";
import chatgptLogo from "@/public/Chatgpt.png";
import { ChatMessageType } from "@/drizzle/schema";

type Props = {
  message: ChatMessageType;
  userAvatar: string | undefined;
};

function ChatMessage({ message, userAvatar }: Props) {
  const isUserMessage = message.userId !== "chatgpt";

  const AvatarImage = isUserMessage ? userAvatar : (chatgptLogo as any);

  return (
    <div
      className={`py-5 text-black dark:text-muted-foreground ${isUserMessage && "bg-gray-700/50"}`}
    >
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

export default ChatMessage;
