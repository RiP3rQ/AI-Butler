import { GetFormatterForCurrency } from "@/lib/helper/dateHelper";
import { OverviewQuerySchema } from "@/lib/budgetTypes/overview";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/drizzle";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { budgetTransaction } from "@/lib/drizzle/schema";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const queryParams = OverviewQuerySchema.safeParse({
    from,
    to,
  });

  if (!queryParams.success) {
    return Response.json(queryParams.error.message, {
      status: 400,
    });
  }

  const transactions = await getTransactionsHistory(
    user.id,
    queryParams.data.from,
    queryParams.data.to,
  );

  return Response.json(transactions);
}

export type GetTransactionHistoryResponseType = Awaited<
  ReturnType<typeof getTransactionsHistory>
>;

async function getTransactionsHistory(userId: string, from: Date, to: Date) {
  const formatter = GetFormatterForCurrency("PLN"); // todo: currency global provider

  const transactions = await db.query.budgetTransaction.findMany({
    where: and(
      eq(budgetTransaction.userId, userId),
      gte(budgetTransaction.date, String(from)),
      lte(budgetTransaction.date, String(to)),
    ),
    orderBy: desc(budgetTransaction.date),
  });

  return transactions.map((transaction) => ({
    id: transaction.id,
    amount: formatter.format(Number(transaction.amount)),
    currency: transaction.currency,
    description: transaction.description,
    date: new Date(transaction.date),
  }));
}
