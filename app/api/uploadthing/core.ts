import { db } from "../../../drizzle";
import { createUploadthing, type FileRouter } from "uploadthing/next";

import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "@langchain/pinecone";
import { getPineconeClient } from "@/lib/pinecone/pinecone";
import { auth } from "@clerk/nextjs";
import { PdfFiles } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { createAuditLog } from "@/lib/auditLog/createAuditLog";

const f = createUploadthing();

const PLANS = [
  {
    name: "Free",
    pagesPerPdf: 10,
  },
  {
    name: "Pro",
    pagesPerPdf: 50,
  },
];

const middleware = async () => {
  const { userId } = auth();

  if (!userId) throw new Error("Unauthorized");

  const subscriptionPlan = "free";

  return { subscriptionPlan, userId };
};

const onUploadComplete = async ({
  metadata,
  file,
}: {
  metadata: Awaited<ReturnType<typeof middleware>>;
  file: {
    key: string;
    name: string;
    url: string;
  };
}) => {
  const isFileExist = await db
    .select()
    .from(PdfFiles)
    .where(eq(PdfFiles.key, file.key));

  if (isFileExist.length > 0) {
    console.log("File already exists.");
    return;
  }

  const createdFile = await db
    .insert(PdfFiles)
    .values({
      name: file.name,
      key: file.key,
      url: `https://utfs.io/f/${file.key}`,
      uploadStatus: "PROCESSING",
      userId: metadata.userId,
    })
    .returning({ createdFileKey: PdfFiles.key, name: PdfFiles.name });

  console.log("createdFile:", createdFile[0].createdFileKey);

  await createAuditLog({
    entityId: createdFile[0].createdFileKey,
    entityType: "pdfFile",
    entityTitle: createdFile[0].name,
    action: "CREATE",
    userIdFromProps: metadata.userId,
  });

  try {
    const response = await fetch(`https://utfs.io/f/${file.key}`);

    const blob = await response.blob();

    const loader = new PDFLoader(blob);

    const pageLevelDocs = await loader.load();

    const pagesAmt = pageLevelDocs.length;

    const { subscriptionPlan } = metadata;

    const isProExceeded =
      pagesAmt > PLANS.find((plan: any) => plan.name === "Pro")!.pagesPerPdf;
    const isFreeExceeded =
      pagesAmt > PLANS.find((plan: any) => plan.name === "Free")!.pagesPerPdf;

    if (isProExceeded || isFreeExceeded) {
      console.log("Cannot process the file. Exceeded the limit.");
      await db
        .update(PdfFiles)
        .set({
          uploadStatus: "FAILED",
        })
        .where(eq(PdfFiles.key, createdFile[0].createdFileKey));
    }

    // vectorize and index entire document
    const pinecone = await getPineconeClient();
    const pineconeIndex = pinecone.Index("ai-butler");

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
      pineconeIndex,
      namespace: String(createdFile[0].createdFileKey),
    });

    await db
      .update(PdfFiles)
      .set({
        uploadStatus: "SUCCESS",
      })
      .where(eq(PdfFiles.key, createdFile[0].createdFileKey));
  } catch (err) {
    console.log(err);
    await db
      .update(PdfFiles)
      .set({
        uploadStatus: "FAILED",
      })
      .where(eq(PdfFiles.key, createdFile[0].createdFileKey));
  }
};

export const ourFileRouter = {
  freePlanUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
  proPlanUploader: f({ pdf: { maxFileSize: "16MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
