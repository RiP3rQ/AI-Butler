import { auth } from "@clerk/nextjs";
import openai from "@/lib/openai";
import { createAuditLog } from "@/lib/auditLog/createAuditLog";
import { db } from "@/drizzle";
import { chat, chatMessage } from "@/drizzle/schema";
import { and, asc, eq } from "drizzle-orm";

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
    await db.insert(chatMessage).values({
      chatId,
      userId,
      content: prompt,
    });

    await createAuditLog({
      entityId: chatId,
      entityType: "chatMessage",
      entityTitle: prompt,
      action: "CREATE",
    });

    // ChatGPT response
    const chatGPTResponse = await openai.completions
      .create({
        model: "gpt-3.5-turbo-instruct",
        prompt,
        max_tokens: 256,
        temperature: 0.7,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: false,
      })
      .then(async (res) => {
        //write response to database
        await db.insert(chatMessage).values({
          chatId,
          userId: "chatgpt",
          content: res.choices[0].text,
        });
      });

    return Response.json({ chatGPTResponse }, { status: 200 });
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
    const messages = await db.query.chatMessage.findMany({
      where: eq(chatMessage.chatId, chatId),
      orderBy: asc(chatMessage.createdAt),
    });

    return Response.json({ messages }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { chatId: string } },
) {
  try {
    const { userId } = auth();
    const chatId = params.chatId;

    if (!userId) {
      return Response.json({ error: "Not logged in." }, { status: 401 });
    }

    if (!chatId) {
      return Response.json({ error: "Chat Id not provided." }, { status: 404 });
    }

    const chatCcntent = await db.query.chat.findFirst({
      where: and(
        eq(chatMessage.chatId, chatId),
        eq(chatMessage.userId, userId),
      ),
    });

    if (!chatCcntent) {
      return Response.json({ error: "Chat not found." }, { status: 404 });
    }

    // delete all messages in chat
    await db.delete(chatMessage).where(eq(chatMessage.chatId, chatId));
    // delete chat itself
    await db.delete(chat).where(eq(chat.id, chatId));

    return Response.json({ chatCcntent }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { chatId: string } },
) {
  try {
    const { userId } = auth();
    const chatId = params.chatId;
    const { newName } = await req.json();

    if (!userId) {
      return Response.json({ error: "Not logged in." }, { status: 401 });
    }

    if (!chatId) {
      return Response.json({ error: "Chat Id not provided." }, { status: 404 });
    }

    if (!newName) {
      return Response.json(
        { error: "New name not provided." },
        { status: 404 },
      );
    }

    // update chat name
    const chatContent = await db
      .update(chat)
      .set({
        title: newName,
      })
      .where(eq(chat.id, chatId));

    if (!chatContent) {
      return Response.json({ error: "Chat not found." }, { status: 404 });
    }

    return Response.json({ chatContent }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
