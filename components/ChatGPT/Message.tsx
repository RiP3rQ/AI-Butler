import { auth } from "@clerk/nextjs";
import { ChatMessage } from "@prisma/client";

type Props = {
  message: ChatMessage;
  userAvatar: string | undefined;
};

function Message({ message, userAvatar }: Props) {
  const isUserMessage = message.userId !== "ChatGPT";

  return (
    <div className={`py-5 text-white ${isUserMessage && "bg-[#434654]"}`}>
      <div className="mx-auto flex max-w-2xl space-x-5 px-10">
        <img
          src={isUserMessage ? userAvatar : "/Chatgpt.png"}
          alt="Avatar"
          className="h-8 w-8"
        />
        <p className="pt-1 text-sm">{message.content}</p>
      </div>
    </div>
  );
}

export default Message;
