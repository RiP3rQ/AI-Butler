import { Period, Timeframe } from "@/lib/types";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/drizzle";
import { and, asc, eq } from "drizzle-orm";
import { monthHistory, yearHistory } from "@/lib/drizzle/schema";

const getHistoryDataSchema = z.object({
  timeframe: z.enum(["month", "year"]),
  month: z.coerce.number().min(0).max(11).default(0),
  year: z.coerce.number().min(2000).max(3000),
});

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const timeframe = searchParams.get("timeframe");
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  const queryParams = getHistoryDataSchema.safeParse({
    timeframe,
    month,
    year,
  });

  if (!queryParams.success) {
    return Response.json(queryParams.error.message, {
      status: 400,
    });
  }

  const data = await getHistoryData(user.id, queryParams.data.timeframe, {
    month: queryParams.data.month,
    year: queryParams.data.year,
  });

  return Response.json(data);
}

export type GetHistoryDataResponseType = Awaited<
  ReturnType<typeof getHistoryData>
>;

async function getHistoryData(
  userId: string,
  timeframe: Timeframe,
  period: Period,
) {
  switch (timeframe) {
    case "year":
      return await getYearHistoryData(userId, period.year);
    case "month":
      return await getMonthHistoryData(userId, period.year, period.month);
  }
}

type HistoryData = {
  expense: number;
  income: number;
  year: number;
  month: number;
  day?: number;
};

//todo: refactor

async function getYearHistoryData(userId: string, year: number) {
  const result = await db.query.yearHistory.findMany({
    where: and(eq(yearHistory.userId, userId), eq(yearHistory.year, year)),
    orderBy: asc(yearHistory.month),
  });

  if (!result || result.length === 0) return [];

  const summary: { [key: string]: HistoryData } = {};

  for (const entry of result) {
    const key = `${entry.month}-${entry.year}`;

    if (!summary[key]) {
      summary[key] = {
        month: entry.month,
        year: entry.year,
        income: 0,
        expense: 0,
      };
    }

    summary[key].income += parseInt(entry.income);
    summary[key].expense += parseInt(entry.expense);
  }

  const history: HistoryData[] = [];
  // Convert the summary object into an array of summary records
  for (const record of Object.values(summary)) {
    history.push(record);
  }

  return history;
}

async function getMonthHistoryData(
  userId: string,
  year: number,
  month: number,
) {
  const result = await db.query.monthHistory.findMany({
    where: and(
      eq(monthHistory.userId, userId),
      eq(monthHistory.year, year),
      eq(monthHistory.month, month),
    ),
    orderBy: asc(monthHistory.day),
  });

  if (!result || result.length === 0) return [];

  const summary: { [key: string]: HistoryData } = {};

  for (const entry of result) {
    const key = `${entry.day}-${entry.month}-${entry.year}`;

    if (!summary[key]) {
      summary[key] = {
        day: entry.day,
        month: entry.month,
        year: entry.year,
        income: 0,
        expense: 0,
      };
    }

    summary[key].income += parseInt(entry.income);
    summary[key].expense += parseInt(entry.expense);
  }

  const history: HistoryData[] = [];
  // Convert the summary object into an array of summary records
  for (const record of Object.values(summary)) {
    history.push(record);
  }

  return history;
}
