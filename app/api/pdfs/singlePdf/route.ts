import { auth } from "@clerk/nextjs";
import { db } from "../../../../drizzle";
import { PdfFiles } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    // check if the user is logged in
    const { userId } = auth();
    if (!userId) {
      return Response.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const { key } = await req.json();

    // get all notes for the user
    const singlePdf = await db
      .select()
      .from(PdfFiles)
      .where(and(eq(PdfFiles.userId, userId), eq(PdfFiles.key, key)));

    return Response.json({ data: singlePdf }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
