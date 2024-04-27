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
      await trx
        .update(monthHistory)
        .set({
          expense: type === "expense" ? String(amount) : "0",
          income: type === "income" ? String(amount) : "0",
        })
        .where(
          and(
            eq(monthHistory.day, date.getUTCDate()),
            eq(monthHistory.month, date.getUTCMonth()),
            eq(monthHistory.year, date.getUTCFullYear()),
            eq(monthHistory.userId, user.id),
          ),
        );
      await trx
        .update(yearHistory)
        .set({
          expense: type === "expense" ? String(amount) : "0",
          income: type === "income" ? String(amount) : "0",
        })
        .where(
          and(
            eq(yearHistory.month, date.getUTCMonth()),
            eq(yearHistory.year, date.getUTCFullYear()),
            eq(yearHistory.userId, user.id),
          ),
        );
    });

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
