import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/drizzle";
import { ActivityItem } from "@/components/auditLog/ActivityItem";
import { Skeleton } from "@/components/ui/skeleton";
import { $auditLogs, $users } from "@/lib/drizzle/schema";
import { desc, eq } from "drizzle-orm";

export const ActivityList = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  const auditLogs = await db.select().from($auditLogs).where(eq($auditLogs.userId, userId)).orderBy(desc($auditLogs.createdAt));

  return (
    <ol className="space-y-4 mt-4">
      <p className="hidden last:block text-xs text-center text-muted-foreground">
        No activity found inside this organization
      </p>
      {auditLogs.map((log) => (
        <ActivityItem key={log.id} data={log} />
      ))}
    </ol>
  );
};

ActivityList.Skeleton = function ActivityListSkeleton() {
  return (
    <ol className="space-y-4 mt-4">
      <Skeleton className="w-[80%] h-14" />
      <Skeleton className="w-[50%] h-14" />
      <Skeleton className="w-[70%] h-14" />
      <Skeleton className="w-[80%] h-14" />
      <Skeleton className="w-[75%] h-14" />
    </ol>
  );
};
