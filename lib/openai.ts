import OpenAI from "openai";

const apiKey = process.env.OPEN_AI_KEY;

if (!apiKey) {
  throw new Error("OPENAI_API_KEY is not defined");
}

const openai = new OpenAI({ apiKey });

export default openai;

export async function getEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });

  const embedding = response.data[0].embedding;

  if (!embedding) {
    throw new Error("Error generating embedding");
  }

  return embedding;
}
