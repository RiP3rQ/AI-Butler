import { OverviewQuerySchema } from "@/lib/budgetTypes/overview";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "../../../../../drizzle";
import { budgetTransaction } from "@/drizzle/schema";
import { and, eq, gte, lte } from "drizzle-orm";
import moment from "moment/moment";

interface Summary {
  type: string;
  category: string;
  categoryIcon: string;
  totalAmount: number;
}

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

    const summary: Map<string, Summary> = new Map();

    for (const stat of stats) {
      const key = `${stat.type}-${stat.category}`;

      if (summary.has(key)) {
        summary.get(key)!.totalAmount += parseInt(stat.amount);
      } else {
        summary.set(key, {
          type: stat.type,
          category: stat.category,
          categoryIcon: stat.categoryIcon,
          totalAmount: parseInt(stat.amount),
        });
      }
    }

    // Output the results
    const results: Summary[] = Array.from(summary.values());

    return Response.json(results);
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

  return stats;
}
