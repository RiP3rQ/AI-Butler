import { SignIn } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | AI-Butler",
  description: "AI-Butler using OpenAI's API created by RiP3rQ",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function Page() {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignIn appearance={{ variables: { colorPrimary: "#0f172A" } }} />
    </div>
  );
}
