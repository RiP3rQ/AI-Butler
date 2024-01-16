import React from "react";
import { useChat } from "ai/react";
import { cn } from "@/lib/utils";
import { XCircle } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Message } from "ai";

type Props = {
  open: boolean;
  onClose: () => void;
};

const ChatbotBox: React.FC<Props> = ({ open, onClose }) => {
  const {
    messages,
    input,
    handleSubmit,
    handleInputChange,
    setMessages,
    isLoading,
    error,
  } = useChat();
  return (
    <div
      className={cn(
        "bottom-0 right-0 z-10 w-full max-w-[500px] p-1 xl:right-36",
        open ? "fixed" : "hidden",
      )}
    >
      <button onClick={onClose} className="mb-1 ms-auto block">
        <XCircle size={30} />
      </button>
      <div className="flex h-[600px] flex-col rounded border bg-background shadow-xl">
        <div className="h-full">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
        <form onSubmit={handleSubmit} className="m-3 flex gap-1">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Say something..."
          />
          <Button type="submit" disabled={isLoading}>
            {" "}
            Send{" "}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatbotBox;

function ChatMessage({ message: { role, content } }: { message: Message }) {
  return (
    <div className="mb-1">
      <div className="text-xs">{role}</div>
      <div className="text-sm">{content}</div>
    </div>
  );
}
