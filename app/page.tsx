import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const { userId } = auth();

  if (userId) redirect("/dashboard");

  // FINAL VERSION: !IMPORTANT! Audit with every change made to the db

  // FINAL VERSION: ADD TRANSLATOR
  // FINAL VERSION: ADD PDFs reader
  // FINAL VERSION: ADD Images creation

  // FINAL VERSION: ADD Stripe integration

  return (
    <main className="grainy min-h-screen bg-gradient-to-r from-rose-100 to-teal-100">
      <div
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-4">
        <div className="flex flex-col items-center justify-center">
          <Image src="/logo.png" alt="logo" width={100} height={100} />
          <span className="text-4xl font-extrabold tracking-tight lg:text-5xl dark:text-muted">
            AI-Butler
          </span>
        </div>
        <p className="max-w-prose text-center dark:text-muted ">
          An intelligent assistant that can help you with your daily tasks.
          Built with newest technologies like Next.js, OpenAI, Pinecone, Neon,
          ShadcnUI, Clerk Auth, Drizzle and more.
        </p>
        <Button asChild size={"lg"}>
          <Link href="/dashboard">
            Start Adventure
            <ArrowRight size={24} className={"ml-4"} />
          </Link>
        </Button>
      </div>
    </main>
  );
}
