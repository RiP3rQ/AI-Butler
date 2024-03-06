import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "AI-Butler - Personalities",
  description:
    "AI-Butler using OpenAI's API created by RiP3rQ using Sonny Sangha's and Coding in Flow's tutorials",
  icons: {
    icon: "/favicon.ico"
  }
};

export default async function PersonalitiesPage() {
  return (
    <div className="relative grid min-h-[90vh] gap-3 sm:grid-cols-2 lg:grid-cols-3">
      Personalities
    </div>
  );
}