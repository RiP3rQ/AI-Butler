"use server";

import {
  CreateCategorySchema,
  CreateCategorySchemaType,
  DeleteCategorySchema,
  DeleteCategorySchemaType,
} from "@/lib/budgetTypes/categories";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/drizzle";
import { budgetCategory } from "@/lib/drizzle/schema";
import { and, eq } from "drizzle-orm";

export async function CreateCategory(form: CreateCategorySchemaType) {
  try {
    const parsedBody = CreateCategorySchema.safeParse(form);
    if (!parsedBody.success) {
      throw new Error("bad request");
    }

    const user = await currentUser();
    if (!user) {
      redirect("/sign-in");
    }

    const { name, icon, type } = parsedBody.data;

    await db.insert(budgetCategory).values({
      userId: user.id,
      name,
      icon,
      type,
    });

    return {
      status: true,
      message: `Category ${name} created successfully`,
    };
  } catch (e) {
    console.error(e);
    return {
      status: false,
      message: "Category already exists",
    };
  }
}

export async function DeleteCategory(form: DeleteCategorySchemaType) {
  try {
    const parsedBody = DeleteCategorySchema.safeParse(form);
    if (!parsedBody.success) {
      throw new Error("bad request");
    }

    const user = await currentUser();
    if (!user) {
      redirect("/sign-in");
    }

    await db
      .delete(budgetCategory)
      .where(
        and(
          eq(budgetCategory.userId, user.id),
          eq(budgetCategory.name, parsedBody.data.name),
          eq(budgetCategory.type, parsedBody.data.type),
        ),
      );

    return {
      status: true,
      message: "Category deleted successfully",
    };
  } catch (e) {
    console.error(e);
    return {
      status: false,
      message: "Category not found",
    };
  }
}
