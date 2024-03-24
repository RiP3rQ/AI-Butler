import { auth } from "@clerk/nextjs";
import { db } from "@/lib/drizzle";
import { $PdfFiles } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    // check if the user is logged in
    const { userId } = auth();
    if (!userId) {
      return Response.json(
        {
          error: "Unauthorized"
        },
        {
          status: 401
        }
      );
    }

    // get all notes for the user
    const allPdfs = await db.select().from($PdfFiles).where(eq($PdfFiles.userId, userId));

    return Response.json({ data: allPdfs }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        error: "Internal Server Error"
      },
      {
        status: 500
      }
    );
  }
}