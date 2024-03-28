import { Pinecone } from "@pinecone-database/pinecone";

const apiKey = process.env.PINECONE_API_KEY;

if (!apiKey) {
  throw new Error("PINECONE_API_KEY is not defined");
}

const pinecone = new Pinecone({
  apiKey
});

export const PineconeIndex = pinecone.Index("ai-butler");

export const getPineconeClient = async () => {
  return new Pinecone({
    apiKey
  });
};
