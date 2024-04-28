import { OverviewQuerySchema } from "@/lib/budgetTypes/overview";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "../../../../../drizzle";
import { budgetTransaction } from "@/drizzle/schema";
import { and, eq, gte, lte } from "drizzle-orm";
import moment from "moment";

export async function GET(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      redirect("/sign-in");
    }

    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const queryParams = OverviewQuerySchema.safeParse({ from, to });

    if (!queryParams.success) {
      return Response.json(queryParams.error.message, {
        status: 400,
      });
    }

    const fromDate = moment(queryParams.data.from).format("YYYY-MM-DD");
    const toDate = moment(queryParams.data.to).format("YYYY-MM-DD");

    const stats = await getBalanceStats(user.id, fromDate, toDate);

    return Response.json(stats);
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export type GetBalanceStatsResponseType = Awaited<
  ReturnType<typeof getBalanceStats>
>;

async function getBalanceStats(userId: string, from: string, to: string) {
  const stats = await db
    .select({
      type: budgetTransaction.type,
      amount: budgetTransaction.amount,
    })
    .from(budgetTransaction) // Use the correct table name
    .where(
      and(
        gte(budgetTransaction.date, String(from)),
        lte(budgetTransaction.date, String(to)),
        eq(budgetTransaction.userId, userId),
      ),
    );

  const resultMapped: { [key: string]: number } = {};

  for (const stat of stats) {
    const amount = parseInt(stat.amount);

    if (resultMapped.hasOwnProperty(stat.type)) {
      resultMapped[stat.type] += amount;
    } else {
      resultMapped[stat.type] = amount;
    }
  }

  return resultMapped;
}
