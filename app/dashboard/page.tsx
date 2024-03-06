import { Metadata } from "next";
import React from "react";
import ModuleCard from "@/components/ModuleCard";
import { AvailableModules } from "@/components/ModuleSelector";

export const metadata: Metadata = {
  title: "AI-Butler - Dashboard",
  description:
    "AI-Butler using OpenAI's API created by RiP3rQ using Sonny Sangha's and Coding in Flow's tutorials",
  icons: {
    icon: "/favicon.ico"
  }
};

export default async function DashboardPage() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {AvailableModules.map((module) => (
        <ModuleCard
          key={module.value}
          title={module.value}
          icon={module.Icon}
          description={module.description}
          href={`/${module.value.toLowerCase()}`}
        />
      ))}
    </div>
  );
}
