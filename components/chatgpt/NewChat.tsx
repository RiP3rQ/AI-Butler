import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";

const NewChat = () => {
  const router = useRouter();

  const createNewChat = async () => {
    await axios.post("/api/chatgpt/chat").then((res) => {
      toast.success("Chat created!");
      router.replace(`/chatgpt/${res.data.chat.id}`);
    });
  };

  return (
    <div onClick={createNewChat} className="chatRow border border-gray-700 text-black dark:text-muted-foreground">
      <PlusIcon className="h-4 w-4" />
      <p>New Chat</p>
    </div>
  );
};

export default NewChat;
