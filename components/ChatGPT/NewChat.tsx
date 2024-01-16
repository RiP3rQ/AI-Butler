import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const NewChat = () => {
  const router = useRouter();

  // const createNewChat = async () => {
  //   const doc = await addDoc(
  //     collection(db, "users", session?.user?.email!, "chats"),
  //     {
  //       userId: session?.user?.email!,
  //       createdAt: serverTimestamp(),
  //     },
  //   );

  //   router.push(`/chat/${doc.id}`);
  // };

  return (
    <div
      // onClick={createNewChat}
      className="chatRow border border-gray-700"
    >
      <PlusIcon className="h-4 w-4" />
      <p>New Chat</p>
    </div>
  );
};

export default NewChat;
