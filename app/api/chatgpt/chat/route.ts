import { auth } from "@clerk/nextjs";
import prisma from "@/lib/database/db";
import { NextApiRequest } from "next";

export async function POST() {
  try {
    const { userId } = auth();

    if (!userId) {
      return Response.json({ error: "Not logged in." }, { status: 401 });
    }

    let chat;

    chat = await prisma?.chat.create({
      data: {
        userId,
        title: "New Chat",
      },
    });
    return Response.json({ chat }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return Response.json({ error: "Not logged in." }, { status: 401 });
    }

    const chats = await prisma?.chat.findMany({
      where: {
        userId,
      },
    });

    if (!chats) {
      return Response.json({ error: "Chats not found." }, { status: 404 });
    }

    return Response.json({ chats }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return Response.json({ error: "Not logged in." }, { status: 401 });
    }

    const body = await req.json();
    const id = body.id;

    if (!id) {
      return Response.json({ error: "Chat Id not provided." }, { status: 404 });
    }

    const chat = await prisma?.chat.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!chat) {
      return Response.json({ error: "Chat not found." }, { status: 404 });
    }

    await prisma?.chat.delete({
      where: {
        id,
      },
    });

    return Response.json({ chat }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
