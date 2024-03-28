import { getEmbeddings } from "./embeddings";
import { getPineconeClient } from "@/lib/pinecone/pinecone";
import { convertToAscii } from "@/lib/utils";

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  try {
    const client = await getPineconeClient();
    const pineconeIndex = await client.index("ai-butler");
    const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
    const queryResult = await namespace.query({
      topK: 5,
      vector: embeddings,
      includeMetadata: true
    });

    return queryResult.matches || [];
  } catch (error) {
    console.log("error querying embeddings", error);
    throw error;
  }
}

export async function getContext(query: string, fileKey: string) {
  const queryEmbeddings = await getEmbeddings(query);
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);

  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.7
  );

  type Metadata = {
    text: string;
    totalPages: number;
  };

  let docs = qualifyingDocs.map((match) => (match.metadata as Metadata).text);
  return docs.join("\n").substring(0, 3000);
}