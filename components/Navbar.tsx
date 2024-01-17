"use client";

import AddEditNoteDialog from "@/components/AddEditNoteDialog";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { Bot, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { redirect, useRouter } from "next/navigation";

type Props = {};

const Navbar = (props: Props) => {
  const { theme } = useTheme();
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className="h-16 p-4 shadow">
        <div className="m-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Link href="/notes" className="flex items-center gap-1">
              <Image src="/logo.png" alt="logo" width={40} height={40} />
              <span className="font-bold">AI-Butler</span>
            </Link>
            <Button onClick={() => router.push("/chatgpt")}>
              <Bot size={20} className="mr-2" />
              ChatGPT
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                baseTheme: theme === "dark" ? dark : undefined,
                elements: {
                  avatarBox: {
                    width: "2.5rem",
                    height: "2.5rem",
                  },
                },
              }}
            />
            <ThemeToggleButton />
            <Button
              onClick={() => setShowAddEditNoteDialog(!showAddEditNoteDialog)}
            >
              <Plus size={20} className="mr-2" />
              Add Note
            </Button>
          </div>
        </div>
      </div>

      <AddEditNoteDialog
        open={showAddEditNoteDialog}
        setOpen={setShowAddEditNoteDialog}
      />
    </>
  );
};

export default Navbar;
