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

    console.log(amount, category, date, description, type);

    const categoryRow = await db
      .select()
      .from(budgetCategory)
      .where(
        and(
          eq(budgetCategory.name, category),
          eq(budgetCategory.userId, user.id),
        ),
      );

    console.log("categoryRow", categoryRow);

    if (!categoryRow[0]) {
      throw new Error("category not found");
    }

    // NOTE: don't make confusion between $transaction ( prisma ) and prisma.transaction (table)
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
