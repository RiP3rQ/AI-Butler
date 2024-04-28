"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LineChartIcon } from "lucide-react";

export const HistoryButton = () => {
  const router = useRouter();
  return (
    <Button className="bg-gray-600" size="sm" onClick={() => router.push("/journal/history")}>
      <LineChartIcon className="h-6 w-6 text-white" />
    </Button>
  );
};
