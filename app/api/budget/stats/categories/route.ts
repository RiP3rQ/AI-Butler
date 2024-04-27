import { OverviewQuerySchema } from "@/lib/budgetTypes/overview";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/drizzle";
import { budgetTransaction } from "@/lib/drizzle/schema";
import { and, eq, gte, lte } from "drizzle-orm";
import moment from "moment/moment";

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
      throw new Error(queryParams.error.message);
    }

    const fromDate = moment(queryParams.data.from).format("YYYY-MM-DD");
    const toDate = moment(queryParams.data.to).format("YYYY-MM-DD");

    const stats = await getCategoriesStats(user.id, fromDate, toDate);

    console.log("Counted stats", stats);

    return Response.json(stats);
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export type GetCategoriesStatsResponseType = Awaited<
  ReturnType<typeof getCategoriesStats>
>;

async function getCategoriesStats(userId: string, from: string, to: string) {
  const stats = await db
    .select({
      type: budgetTransaction.type,
      category: budgetTransaction.category,
      categoryIcon: budgetTransaction.categoryIcon,
      amount: budgetTransaction.amount,
    })
    .from(budgetTransaction) // Assuming 'budgetTransaction' is the table name; replace with actual table name if different
    .where(
      and(
        gte(budgetTransaction.date, String(from)),
        lte(budgetTransaction.date, String(to)),
        eq(budgetTransaction.userId, userId),
      ),
    );

  console.log("stats", stats);

  return stats;
}

// TODO: FIXXX!Q!!
