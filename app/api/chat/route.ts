import { PineconeIndex } from "@/lib/pinecone/pinecone";
import openai, { getEmbedding } from "@/lib/openai";
import { auth } from "@clerk/nextjs";
import { ChatCompletionMessage } from "openai/resources/index.mjs";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { db } from "@/drizzle";
import { inArray } from "drizzle-orm";
import { note } from "@/drizzle/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: ChatCompletionMessage[] = body.messages;

    const messagesTruncated = messages.slice(-6);

    const embedding = await getEmbedding(
      messagesTruncated.map((message) => message.content).join("\n"),
    );

    const { userId } = auth();

    const vectorQueryResponse = await PineconeIndex.query({
      vector: embedding,
      topK: 4, // change this for better results
      filter: { userId },
    });

    const releventNotes = await db.query.note.findMany({
      where: inArray(
        note.id,
        vectorQueryResponse.matches.map((match) => match.id),
      ),
    });

    // ChatGPT message format
    const systemMessage: ChatCompletionMessage = {
      role: "assistant",
      content:
        "You are an intelligent note-taking app. You answer questions about your user's notes based on their existing notes." +
        "The relevant notes are:\n" +
        releventNotes
          .map(
            (note: any) => `Title: ${note.title}\n\nContent:\n${note.content}`,
          )
          .join("\n\n"),
    };

    // ChatGPT request response
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [systemMessage, ...messagesTruncated],
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
