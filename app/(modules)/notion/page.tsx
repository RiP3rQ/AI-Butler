"use client";

import { useAuth } from "@clerk/nextjs";
import { redirect, useRouter } from "next/navigation";

export default function NotionMainPage() {
  const { orgId, userId } = useAuth();
  const router = useRouter();

  console.log(orgId);

  if (!userId) {
    return redirect("/sign-in");
  }

  if (!orgId) {
    return router.push("/notion/select-org");
  } else {
    return router.push(`/notion/organization/${orgId}`);
  }
}
