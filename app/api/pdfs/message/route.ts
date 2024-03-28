import { auth } from "@clerk/nextjs";
import { OpenAIApi, Configuration } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { getContext } from "@/lib/pinecone/pineconeContext";
import { db } from "@/lib/drizzle";
import { $pdfFileMessages, PdfFileMessagesType } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { Message } from "ai/react";

export const runtime = "edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(config);

export async function POST(req: Request) {
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

    const { fileId, messages, fileKey } = await req.json();
    if (!fileId || !fileKey) {
      return Response.json(
        {
          error: "Invalid request"
        },
        {
          status: 400
        }
      );
    }

    const lastMessage = messages[messages.length - 1];
    // check if .content exist in the last message object and if not then use .text
    if (!lastMessage.content && lastMessage.text) {
      lastMessage.content = lastMessage.text;
    }

    const context = await getContext(lastMessage.content, fileKey);

    const prompt = {
      role: "system",
      content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      AI is a well-behaved and well-mannered individual.
      AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
      AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
      AI assistant is a big fan of Pinecone and Vercel.
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
      AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
      AI assistant will not invent anything that is not drawn directly from the context.
      `
    };

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        prompt,
        ...messages.filter((message: Message) => message.role === "user")
      ],
      stream: true
    });
    const stream = OpenAIStream(response, {
      onStart: async () => {
        // save user message into db
        await db.insert($pdfFileMessages).values({
          pdfFileId: fileId,
          text: lastMessage.content,
          isUserMessage: true,
          userId: userId
        });
      },
      onCompletion: async (completion) => {
        // save ai message into db
        await db.insert($pdfFileMessages).values({
          pdfFileId: fileId,
          text: completion,
          isUserMessage: false,
          userId: "AI-BUTLER"
        });
      }
    });
    return new StreamingTextResponse(stream);
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