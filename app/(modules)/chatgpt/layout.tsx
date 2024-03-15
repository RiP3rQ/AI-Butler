import GoBackButton from "@/components/chatgpt/GoBackButton";
import Sidebar from "@/components/chatgpt/Sidebar";
import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";

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
    <div className="relative flex h-[calc(100vh-4rem)]">
      <aside
        className=" max-w-xs overflow-y-auto
      md:min-w-[20rem]"
      >
        <Sidebar />
      </aside>

      <Separator orientation={"vertical"} className={"h-full"} />

      <main className="flex-1 mx-2 ">{children}</main>

      <GoBackButton />
    </div>
  );
}
