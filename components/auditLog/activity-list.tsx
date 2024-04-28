import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "../../drizzle";
import { ActivityItem } from "@/components/auditLog/activity-item";
import { Skeleton } from "@/components/ui/skeleton";
import { $auditLogs } from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";

export const ActivityList = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  const auditLogs = await db
    .select()
    .from($auditLogs)
    .where(eq($auditLogs.userId, userId))
    .orderBy(desc($auditLogs.createdAt));

  return (
    <ol className="mt-4 space-y-4">
      <p className="hidden text-center text-xs text-muted-foreground last:block">
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
    <ol className="mt-4 space-y-4">
      <Skeleton className="h-14 w-[80%]" />
      <Skeleton className="h-14 w-[50%]" />
      <Skeleton className="h-14 w-[70%]" />
      <Skeleton className="h-14 w-[80%]" />
      <Skeleton className="h-14 w-[75%]" />
    </ol>
  );
};
