import GoBackButton from "@/components/chatgpt/GoBackButton";
import Sidebar from "@/components/chatgpt/Sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI-Butler - ChatGPT",
  description:
    "AI-Butler using OpenAI's API created by RiP3rQ using Sonny Sangha's and Coding in Flow's tutorials"
};

export default function ChatgptLayout({
                                        children
                                      }: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex">
      <aside
        className="h-screen max-w-xs overflow-y-auto bg-[#202123] 
      md:min-w-[20rem]"
      >
        <Sidebar />
      </aside>

      <main className="flex-1 bg-[#343541]">{children}</main>

      <GoBackButton />
    </div>
  );
}
