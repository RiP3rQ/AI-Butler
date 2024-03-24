"use server";

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/drizzle";
import { $PdfFiles } from "@/lib/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { PineconeIndex } from "@/lib/database/pinecone";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

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

    const { pdfId } = await req.json();

    if (!pdfId) {
      return Response.json(
        {
          error: "Missing pdfId"
        },
        {
          status: 400
        }
      );
    }

    // delete the pdf file with the given id
    const DeletePdfKey = await db.delete($PdfFiles).where(and(eq($PdfFiles.id, pdfId), eq($PdfFiles.userId, userId))).returning({ key: $PdfFiles.key });
    // delete the pdf file from the storage
    await utapi.deleteFiles(DeletePdfKey[0].key);
    // delete the embedding via Pinecone
    await PineconeIndex.deleteOne(DeletePdfKey[0].key);

    return new NextResponse("ok", { status: 200 });
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