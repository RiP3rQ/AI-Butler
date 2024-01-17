import { auth } from "@clerk/nextjs";
import prisma from "@/lib/database/db";
import openai from "@/lib/openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

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
        await prisma.chatMessage.create({
          data: {
            chatId,
            userId: "chatgpt",
            content: res.choices[0].text,
          },
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

    const chat = await prisma?.chat.findFirst({
      where: {
        id: chatId,
        userId,
      },
    });

    if (!chat) {
      return Response.json({ error: "Chat not found." }, { status: 404 });
    }

    // delete all messages in chat
    await prisma?.chatMessage.deleteMany({
      where: {
        chatId,
      },
    });
    // delete chat itself
    await prisma?.chat.delete({
      where: {
        id: chatId,
      },
    });

    return Response.json({ chat }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
