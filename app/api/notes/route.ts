import { PineconeIndex } from "@/lib/pinecone/pinecone";
import { getEmbedding } from "@/lib/openai";

import {
  createNoteSchema,
  deleteNoteSchema,
  updateNoteSchema,
} from "@/lib/validation";
import { auth } from "@clerk/nextjs";
import { createAuditLog } from "@/lib/auditLog/createAuditLog";
import { db } from "@/drizzle";
import { note } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

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

    // create the note
    const noteContent = await db
      .insert(note)
      .values({
        title,
        content,
        userId,
      })
      .returning({
        id: note.id,
        title: note.title,
      });

    // create the audit log
    await createAuditLog({
      entityId: noteContent[0].id,
      entityType: "note",
      entityTitle: noteContent[0].title,
      action: "CREATE",
    });

    // create the embedding via Pinecone
    await PineconeIndex.upsert([
      {
        id: noteContent[0].id,
        values: embedding,
        metadata: {
          userId,
        },
      },
    ]);

    return Response.json({ noteContent }, { status: 201 });
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
    const noteContent = await db.query.note.findFirst({
      where: eq(note.id, id),
    });

    if (!noteContent) {
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
    if (!userId || noteContent.userId !== userId) {
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

    // update the note
    const updatedNote = await db
      .update(note)
      .set({
        title,
        content,
      })
      .where(eq(note.id, id))
      .returning({
        id: note.id,
        title: note.title,
      });

    if (!updatedNote) {
      return Response.json(
        {
          error: "Note not found",
        },
        {
          status: 404,
        },
      );
    }

    // create the audit log
    await createAuditLog({
      entityId: updatedNote[0].id,
      entityType: "note",
      entityTitle: updatedNote[0].title,
      action: "UPDATE",
    });

    // update the embedding via Pinecone
    await PineconeIndex.upsert([
      {
        id,
        values: embedding,
        metadata: {
          userId,
        },
      },
    ]);

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
    const noteContent = await db.query.note.findFirst({
      where: eq(note.id, id),
    });

    if (!noteContent) {
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
    if (!userId || noteContent.userId !== userId) {
      return Response.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    // delete the note
    await db.delete(note).where(eq(note.id, id));

    // create the audit log
    await createAuditLog({
      entityId: id,
      entityType: "note",
      entityTitle: noteContent.title,
      action: "DELETE",
    });

    // delete the embedding via Pinecone
    await PineconeIndex.deleteOne(id);

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
