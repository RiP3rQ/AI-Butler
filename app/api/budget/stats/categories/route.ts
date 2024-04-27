import { OverviewQuerySchema } from "@/lib/budgetTypes/overview";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/drizzle";
import { budgetTransaction } from "@/lib/drizzle/schema";
import { and, eq, gte, lte } from "drizzle-orm";

export async function GET(request: Request) {
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

  const stats = await getCategoriesStats(
    user.id,
    queryParams.data.from,
    queryParams.data.to,
  );
  return Response.json(stats);
}

export type GetCategoriesStatsResponseType = Awaited<
  ReturnType<typeof getCategoriesStats>
>;

async function getCategoriesStats(userId: string, from: Date, to: Date) {
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
