import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/drizzle";
import { monthHistory } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const periods = await getHistoryPeriods(user.id);
  return Response.json(periods);
}

export type GetHistoryPeriodsResponseType = Awaited<
  ReturnType<typeof getHistoryPeriods>
>;

async function getHistoryPeriods(userId: string) {
  const result = await db.query.monthHistory.findMany({
    where: eq(monthHistory.userId, userId),
    columns: {
      year: true,
    },
    orderBy: (monthHistory, { asc }) => [asc(monthHistory.year)],
  });

  const years = result.map((el) => el.year);
  if (years.length === 0) {
    // Return the current year
    return [new Date().getFullYear()];
  }

  return years;
}