import { Metadata } from "next";
import React from "react";
import ModuleCard from "@/components/global/module-card";
import { AvailableModules } from "@/components/global/module-selector";

export const metadata: Metadata = {
  title: "Dashboard | AI-Butler",
  description: "AI-Butler using OpenAI's API created by RiP3rQ",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function DashboardPage() {
  return (
    <div className="grid h-full w-full grid-cols-2 gap-3">
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
