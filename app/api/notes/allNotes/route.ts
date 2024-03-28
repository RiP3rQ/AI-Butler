import { auth } from "@clerk/nextjs";
import prisma from "@/lib/prisma/db";

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
    const allNotes = await prisma.note.findMany({
      where: {
        userId
      }
    });

    return Response.json({ data: allNotes }, { status: 200 });
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