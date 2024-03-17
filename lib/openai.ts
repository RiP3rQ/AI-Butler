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