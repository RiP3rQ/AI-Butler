import OpenAI from "openai";
import { OpenAI as LangchainOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import {
  OutputFixingParser,
  StructuredOutputParser
} from "langchain/output_parsers";
import z from "zod";
import { PromptTemplate } from "langchain/prompts";
import { loadQARefineChain } from "langchain/chains";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "langchain/document";
import { PostType } from "@/lib/drizzle/schema";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("OPENAI_API_KEY is not defined");
}

const openai = new OpenAI({ apiKey });

export default openai;

export async function getEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text
  });

  const embedding = response.data[0].embedding;

  if (!embedding) {
    throw new Error("Error generating embedding");
  }

  return embedding;
}

export async function generateImagePrompt(prompt: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an creative and helpful AI assistance capable of generating interesting thumbnail descriptions for my notes. Your output will be fed into the DALLE API to generate a thumbnail. The description should be minimalistic and flat styled"
        },
        {
          role: "user",
          content: `Please generate a thumbnail description for my notebook titled - ${prompt}`
        }
      ]
    });
    const data = response.choices[0];
    const image_description = data.message.content;
    return image_description as string;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function generateDalleImage(image_description: string) {
  try {
    const response = await openai.images.generate({
      prompt: image_description,
      n: 1,
      size: "256x256"
    });
    const image_url = response.data[0].url;
    return image_url as string;
  } catch (error) {
    console.error(error);
  }
}

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    mood: z
      .string()
      .describe("The mood of the person who wrote the journal entry."),
    summary: z
      .string()
      .describe("A quick summary of the entire journal entry."),
    subject: z.string().describe("The subject of the journal entry."),
    negative: z
      .boolean()
      .describe(
        "Is the journal entry negative? (i.e. does it contain negative emotions?)."
      ),
    color: z
      .string()
      .describe(
        "A hexadecimal color representing the mood of the journal entry. Example #0101FE for blue representing happiness."
      ),
    sentimentScore: z
      .number()
      .describe(
        "SentimentScore of the text and rated on a scale from -10 to 10, where -10 is extremely negative, 0 is neutral, and 10 is extremely positive."
      )
  })
);

const getPrompt = async (content: string) => {
  const format_instructions = parser.getFormatInstructions();

  const prompt = new PromptTemplate({
    template:
      "Analyze the following journal entry. Follow the instructions and format your response to match the format instructions, no matter what! \n{format_instructions}\n{entry}",
    inputVariables: ["entry"],
    partialVariables: { format_instructions }
  });

  return await prompt.format({
    entry: content
  });
};

export const analyzePost = async (content: string) => {
  const input = await getPrompt(content);
  const model = new LangchainOpenAI({
    temperature: 0,
    modelName: "gpt-3.5-turbo",
    openAIApiKey: apiKey
  });
  const output = await model.invoke(input);

  try {
    return parser.parse(output);
  } catch (e) {
    const fixParser = OutputFixingParser.fromLLM(
      new LangchainOpenAI({ temperature: 0, modelName: "gpt-3.5-turbo", openAIApiKey: apiKey }),
      parser
    );
    return await fixParser.parse(output);
  }
};

export const qa = async (question: string, posts: PostType[]) => {
  const docs = posts.map(
    (post) =>
      new Document({
        pageContent: post.editorState!,
        metadata: { source: post.id, date: post.createdAt }
      })
  );
  const model = new LangchainOpenAI({
    temperature: 0,
    modelName: "gpt-3.5-turbo",
    openAIApiKey: apiKey
  });
  const chain = loadQARefineChain(model);
  const embeddings = new OpenAIEmbeddings();
  const store = await MemoryVectorStore.fromDocuments(docs, embeddings);
  const relevantDocs = await store.similaritySearch(question);
  const res = await chain.invoke({
    input_documents: relevantDocs,
    question
  });

  return res.output_text;
};
