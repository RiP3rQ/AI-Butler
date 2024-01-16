// we use server insted of server actions because of the streaming feature from the AI API
import prisma from "@/lib/database/db";
import { notesIndex } from "@/lib/database/pinecone";
import { getEmbedding } from "@/lib/openai";

import {
  createNoteSchema,
  deleteNoteSchema,
  updateNoteSchema,
} from "@/lib/validation";
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

    const { title, content } = validation.data;

    // get the embedding for the note
    const embedding = await getEmbeddingForNote(title, content);

    const note = await prisma.$transaction(async (tx) => {
      // create the note
      const note = await tx.note.create({
        data: {
          title,
          content,
          userId,
        },
      });

      // create the embedding via Pinecone
      await notesIndex.upsert([
        {
          id: note.id,
          values: embedding,
          metadata: {
            userId,
          },
        },
      ]);

      return note;
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

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    // validate the request body against the schema
    const validation = updateNoteSchema.safeParse(body);
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

    const { id, title, content } = validation.data;
    // check if the note exists
    const note = await prisma.note.findUnique({
      where: {
        id,
      },
    });

    if (!note) {
      return Response.json(
        {
          error: "Note not found",
        },
        {
          status: 404,
        },
      );
    }

    // check if the user is logged in and owns the note
    const { userId } = auth();
    if (!userId || note.userId !== userId) {
      return Response.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    // get the embedding for the note update via OpenAI
    const embedding = await getEmbeddingForNote(title, content);

    // prisma transaction
    const updatedNote = await prisma.$transaction(async (tx) => {
      // update the note
      const updatedNote = await tx.note.update({
        where: {
          id,
        },
        data: {
          title,
          content,
        },
      });

      // update the embedding via Pinecone
      await notesIndex.upsert([
        {
          id,
          values: embedding,
          metadata: {
            userId,
          },
        },
      ]);

      return updatedNote;
    });

    return Response.json({ updatedNote }, { status: 201 });
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

export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    // validate the request body against the schema
    const validation = deleteNoteSchema.safeParse(body);
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

    const { id } = validation.data;
    // check if the note exists
    const note = await prisma.note.findUnique({
      where: {
        id,
      },
    });

    if (!note) {
      return Response.json(
        {
          error: "Note not found",
        },
        {
          status: 404,
        },
      );
    }

    // check if the user is logged in and owns the note
    const { userId } = auth();
    if (!userId || note.userId !== userId) {
      return Response.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    // prisma transaction
    await prisma.$transaction(async (tx) => {
      // delete the note
      await tx.note.delete({
        where: {
          id,
        },
      });

      // delete the embedding via Pinecone
      await notesIndex.deleteOne(id);
    });

    return Response.json({ message: "Note deleted" }, { status: 200 });
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

async function getEmbeddingForNote(title: string, content: string) {
  return getEmbedding(title + "\n\n" + content);
}
