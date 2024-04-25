"use client";

import ThemeToggleButton from "@/components/ThemeToggleButton";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import ModuleSelector from "@/components/ModuleSelector";
import AuditHistoryButton from "@/components/AuditHistoryButton";
import NotificationsModal from "@/components/modals/NotificationsModal";
import AddCreditsButton from "@/components/AddCreditsButton";

const Navbar = () => {
  const [notificationsDialogOpen, setNotificationsDialogOpen] =
    useState<boolean>(false);
  const { theme } = useTheme();

  return (
    <>
      <div className="h-16 py-4 shadow">
        <div className="m-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 2xl:px-0">
          <div className="flex items-center gap-5">
            <Link href={"/dashboard"} className="flex items-center gap-1">
              <Image src="/logo.png" alt="logo" width={40} height={40} />
              <span className="font-bold">AI-Butler</span>
            </Link>
            <div className={"hidden sm:block"}>
              <ModuleSelector />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <AddCreditsButton />
            <ThemeToggleButton />
            <AuditHistoryButton />
            <NotificationsModal
              open={notificationsDialogOpen}
              setOpen={setNotificationsDialogOpen}
            />
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
