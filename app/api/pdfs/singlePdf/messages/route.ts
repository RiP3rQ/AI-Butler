import { auth } from "@clerk/nextjs";
import { db } from "@/lib/drizzle";
import { $pdfFileMessages } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
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

    const { pdfId } = await req.json();

    if (!pdfId) {
      return Response.json(
        {
          error: "No pdfId provided!"
        },
        {
          status: 401
        }
      );
    }

    const _messages = await db.select().from($pdfFileMessages).where(eq($pdfFileMessages.pdfFileId, pdfId));

    return Response.json({ data: _messages }, { status: 200 });
  } catch (e) {
    console.log(e);
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