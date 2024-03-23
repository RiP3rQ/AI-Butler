import { OpenAI } from "openai";

const chatgpt = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function sendMsgToOpenAI(prompt: string) {
  const res = await chatgpt.completions.create({
    model: "gpt-3.5-turbo-instruct",
    prompt: prompt,
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  });
  return res.choices[0].text;
}
