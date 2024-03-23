"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const SearchInput = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string>("");

  // TODO: SEND LOADING AND RESPONSE TO PARENT COMPONENT and handle it there for better ui
  // TODO: give ability to hide response on click or after 10 seconds
  // TODO: before sending the request, check if the search is empty
  // TODO: replace all editor signs like <h1>, <p>, <code> with empty string before sending the request

  const handleSearch = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true); // Set loading state
    try {
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
      setResponse(data); // Set response
      setSearch(""); // Clear search input
      setLoading(false); // Reset loading state
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={"flex items-center justify-center gap-1"}>
        <Input
          className="w-96"
          placeholder="Ask question to note's content"
          value={search}
          disabled={loading}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button className="bg-gray-600" size="sm" onClick={handleSearch}>
          <Search className="h-6 w-6 text-white" />
        </Button>
      </div>
      {loading && <div className="ml-2">Loading...</div>}
      {response && <div className="ml-2 text-red-500">{response}</div>}
    </div>
  );
};
