"use client";

import ThemeToggleButton from "@/components/global/theme-toggle-button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import ModuleSelector from "@/components/global/module-selector";
import AuditHistoryButton from "@/components/auditLog/audit-history-button";
import NotificationsModal from "@/components/modals/notifications-modal";
import AddCreditsButton from "@/components/global/add-credits-button";

const Navbar = () => {
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
            <NotificationsModal />
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
