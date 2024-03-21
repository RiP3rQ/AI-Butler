"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const SearchInput = ({ posts }: { posts: any }) => {
  const [search, setSearch] = useState("");
  const FetchedPosts = posts;

  const handleSearch = () => {
    const filteredPosts = FetchedPosts.filter((post: any) => {
      return post.editorState.toLowerCase().includes(search.toLowerCase());
    });
    console.log("Filtered posts");
    console.log(filteredPosts);
  };

  return (
    <div className="flex items-center">
      <Input className="w-96" placeholder="Ask question to note's content" value={search}
             onChange={(e) => setSearch(e.target.value)} />
      <Button className="bg-gray-600" size="sm" onClick={handleSearch}>
        <Search className="h-6 w-6 text-white" />
      </Button>

    </div>
  );
};