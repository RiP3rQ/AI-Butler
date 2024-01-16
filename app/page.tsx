import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Home() {
  const { userId } = auth();

  if (userId) redirect("/notes");

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-5">
      <div className="flex items-center gap-4">
        <Image src="/logo.png" alt="logo" width={100} height={100} />
        <span className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          AI-Butler
        </span>
      </div>
      <p className="max-w-prose text-center">
        An intelligent assistant that can help you with your daily tasks. Build
        with OpenAI, Pinecone, Next.js, Shadcn UI, Clerk Auth and more.
      </p>
      <Button asChild size={"lg"}>
        <Link href="/notes">Open</Link>
      </Button>
    </main>
  );
}
