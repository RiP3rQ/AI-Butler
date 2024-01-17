import { auth } from "@clerk/nextjs";
import prisma from "@/lib/database/db";

export async function POST(req: Request) {
  try {
    const { prompt, chatId } = await req.json();
    if (!prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (!chatId) {
      return Response.json({ error: "Chat ID is required" }, { status: 400 });
    }

    const { userId } = auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // write message to database
    await prisma.chatMessage.create({
      data: {
        chatId,
        userId,
        content: prompt,
      },
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { chatId: string } },
) {
  try {
    const chatId = params.chatId;

    if (!chatId) {
      return Response.json({ error: "Chat ID is required" }, { status: 400 });
    }

    const { userId } = auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // write message to database
    const messages = await prisma.chatMessage.findMany({
      where: {
        chatId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return Response.json({ messages }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
