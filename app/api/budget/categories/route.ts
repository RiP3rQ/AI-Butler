import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/drizzle";
import { and, asc, eq } from "drizzle-orm";
import { budgetCategory } from "@/lib/drizzle/schema";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      redirect("/sign-in");
    }

    const { searchParams } = new URL(request.url);
    const paramType = searchParams.get("type");

    const validator = z.enum(["expense", "income"]).nullable();

    const queryParams = validator.safeParse(paramType);
    if (!queryParams.success) {
      return Response.json(queryParams.error, {
        status: 400,
      });
    }

    const type = queryParams.data;
    if (!type) {
      return NextResponse.json({
        status: false,
        message: "Invalid type",
      });
    }

    const categories = await db.query.budgetCategory.findMany({
      where: and(
        eq(budgetCategory.userId, user.id),
        eq(budgetCategory.type, type),
      ),
      orderBy: asc(budgetCategory.name),
    });

    return NextResponse.json(categories);
  } catch (e) {
    console.error(e);
    return {
      status: false,
      message: "Something went wrong",
    };
  }
}
