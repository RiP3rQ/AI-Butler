import { Metadata } from "next";
import React from "react";
import ModuleCard from "@/components/ModuleCard";
import { AvailableModules } from "@/components/ModuleSelector";

export const metadata: Metadata = {
  title: "Dashboard | AI-Butler",
  description:
    "AI-Butler using OpenAI's API created by RiP3rQ",
  icons: {
    icon: "/favicon.ico"
  }
};

export default async function DashboardPage() {
  return (
    <div className="grid gap-3 grid-cols-2 h-full w-full">
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
