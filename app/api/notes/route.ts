// we use server insted of server actions because of the streaming feature from the AI API
import prisma from "@/lib/db";

import { createNoteSchema } from "@/lib/validation";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // validate the request body against the schema
    const validation = createNoteSchema.safeParse(body);
    if (!validation.success) {
      console.error(validation.error);
      return Response.json(
        {
          error: validation.error.issues.map((issue) => issue.message),
        },
        {
          status: 400,
        },
      );
    }

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

    // create the note
    const { title, content } = validation.data;
    const note = await prisma.note.create({
      data: {
        title,
        content,
        userId,
      },
    });

    return Response.json({ note }, { status: 201 });
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
