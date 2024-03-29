import { SignUp } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | AI-Butler",
  description: "AI-Butler using OpenAI's API created by RiP3rQ",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function Page() {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignUp appearance={{ variables: { colorPrimary: "#0f172A" } }} />
    </div>
  );
}
