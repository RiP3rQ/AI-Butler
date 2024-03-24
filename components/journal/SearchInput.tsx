"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  setResponseContent: (response: string) => void;
  setIsResponseLoading: (loading: boolean) => void;
  isResponseLoading: boolean;
}

export const SearchInput = ({ setResponseContent, setIsResponseLoading, isResponseLoading }: Props) => {
  const [search, setSearch] = useState("");

  const handleSearch = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsResponseLoading(true); // Set loading state
      const { data } = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/journal/askQuestion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ question: search }),
          cache: "no-cache"
        }
      ).then((res) => res.json());

      setResponseContent(data); // Set response content
      setSearch(""); // Clear search input
    } catch (error) {
      console.error(error);
    } finally {
      setIsResponseLoading(false); // Set loading state
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={"flex items-center justify-center gap-1"}>
        <Input
          className="w-96"
          placeholder="Ask question to note's content"
          value={search}
          disabled={isResponseLoading}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button className="bg-gray-600" size="sm" onClick={handleSearch} disabled={isResponseLoading}>
          <Search className="h-6 w-6 text-white" />
        </Button>
      </div>
    </div>
  );
};
