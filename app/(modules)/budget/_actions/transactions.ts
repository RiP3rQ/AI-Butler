"use server";

import { db } from "@/lib/drizzle";
import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from "@/lib/budgetTypes/transations";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import {
  budgetCategory,
  budgetTransaction,
  monthHistory,
  yearHistory,
} from "@/lib/drizzle/schema";

export async function CreateTransaction(form: CreateTransactionSchemaType) {
  try {
    const parsedBody = CreateTransactionSchema.safeParse(form);
    if (!parsedBody.success) {
      throw new Error(parsedBody.error.message);
    }

    const user = await currentUser();
    if (!user) {
      redirect("/sign-in");
    }

    const { amount, category, date, description, type } = parsedBody.data;

    const categoryRow = await db
      .select()
      .from(budgetCategory)
      .where(
        and(
          eq(budgetCategory.name, category),
          eq(budgetCategory.userId, user.id),
        ),
      );

    if (!categoryRow[0]) {
      throw new Error("category not found");
    }

    await db.transaction(async (trx) => {
      await trx.insert(budgetTransaction).values({
        //@ts-ignore
        amount,
        currency: "PLN", //todo: add currency support with proper provider
        userId: user.id,
        date,
        description: description || "",
        type,
        category: categoryRow[0].name,
        categoryIcon: categoryRow[0].icon,
      });
      await trx.insert(monthHistory).values({
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        userId: user.id,
        expense: type === "expense" ? String(amount) : "0",
        income: type === "income" ? String(amount) : "0",
      });

      await trx.insert(yearHistory).values({
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        userId: user.id,
        expense: type === "expense" ? String(amount) : "0",
        income: type === "income" ? String(amount) : "0",
      });
    });

    console.log("Transaction created successfully");

    return {
      status: true,
      message: "Transaction created successfully",
    };
  } catch (e) {
    console.error(e);
    return {
      status: false,
      message: "Category not found",
    };
  }
}

export async function DeleteTransaction(id: string) {
  try {
    const user = await currentUser();
    if (!user) {
      redirect("/sign-in");
    }

    const transaction = await db.query.budgetTransaction.findFirst({
      where: and(
        eq(budgetTransaction.id, id),
        eq(budgetTransaction.userId, user.id),
      ),
    });

    if (!transaction) {
      throw new Error("bad request");
    }

    await db.transaction(async (trx) => {
      await trx
        .delete(budgetTransaction)
        .where(
          and(
            eq(budgetTransaction.id, id),
            eq(budgetTransaction.userId, user.id),
          ),
        );
      await trx.insert(monthHistory).values({
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        userId: user.id,
        expense: type === "expense" ? String(amount) : "0",
        income: type === "income" ? String(amount) : "0",
      });

      await trx.insert(yearHistory).values({
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        userId: user.id,
        expense: type === "expense" ? String(amount) : "0",
        income: type === "income" ? String(amount) : "0",
      });
    });

    console.log("Transaction deleted successfully");

    return {
      status: true,
      message: "Transaction created successfully",
    };
  } catch (e) {
    console.error(e);
    return {
      status: false,
      message: "Category not found",
    };
  }
}

//     // Update month history
//     prisma.monthHistory.update({
//       where: {
//         day_month_year_userId: {
//           userId: user.id,
//           day: transaction.date.getUTCDate(),
//           month: transaction.date.getUTCMonth(),
//           year: transaction.date.getUTCFullYear(),
//         },
//       },
//       data: {
//         ...(transaction.type === "expense" && {
//           expense: {
//             decrement: transaction.amount,
//           },
//         }),
//         ...(transaction.type === "income" && {
//           income: {
//             decrement: transaction.amount,
//           },
//         }),
//       },
//     }),
//     // Update year history
//     prisma.yearHistory.update({
//       where: {
//         month_year_userId: {
//           userId: user.id,
//           month: transaction.date.getUTCMonth(),
//           year: transaction.date.getUTCFullYear(),
//         },
//       },
//       data: {
//         ...(transaction.type === "expense" && {
//           expense: {
//             decrement: transaction.amount,
//           },
//         }),
//         ...(transaction.type === "income" && {
//           income: {
//             decrement: transaction.amount,
//           },
//         }),
//       },
//     }),
//   ]);
// }
