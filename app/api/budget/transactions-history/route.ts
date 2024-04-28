import { GetFormatterForCurrency } from "@/lib/helper/dateHelper";
import { OverviewQuerySchema } from "@/lib/budgetTypes/overview";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/drizzle";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { budgetTransaction } from "@/lib/drizzle/schema";
import moment from "moment/moment";

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

  const fromDate = moment(queryParams.data.from).format("YYYY-MM-DD");
  const toDate = moment(queryParams.data.to).format("YYYY-MM-DD");

  const transactions = await getTransactionsHistory(user.id, fromDate, toDate);

  return Response.json(transactions);
}

export type GetTransactionHistoryResponseType = Awaited<
  ReturnType<typeof getTransactionsHistory>
>;

async function getTransactionsHistory(
  userId: string,
  from: string,
  to: string,
) {
  const formatter = GetFormatterForCurrency("PLN"); // todo: currency global provider

  const transactions = await db.query.budgetTransaction.findMany({
    where: and(
      eq(budgetTransaction.userId, userId),
      gte(budgetTransaction.date, from),
      lte(budgetTransaction.date, to),
    ),
    orderBy: desc(budgetTransaction.date),
  });

  return transactions.map((transaction) => ({
    id: transaction.id,
    amount: formatter.format(Number(transaction.amount)),
    categoryIcon: transaction.categoryIcon,
    category: transaction.category,
    type: transaction.type,
    currency: transaction.currency,
    description: transaction.description,
    date: moment(transaction.date).format("DD-MM-YYYY"),
  }));
}
