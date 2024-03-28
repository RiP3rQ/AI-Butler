"use server";

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/drizzle";
import { $pdfFileMessages, $PdfFiles } from "@/lib/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { PineconeIndex } from "@/lib/pinecone/pinecone";
import { UTApi } from "uploadthing/server";
import { createAuditLog } from "@/lib/auditLog/createAuditLog";

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
    const DeletePdfKey = await db.delete($PdfFiles).where(and(eq($PdfFiles.id, pdfId), eq($PdfFiles.userId, userId))).returning({
      key: $PdfFiles.key,
      name: $PdfFiles.name
    });
    // delete all pdf messages related to the pdf file
    await db.delete($pdfFileMessages).where(eq($pdfFileMessages.pdfFileId, pdfId));
    // delete the pdf file from the storage
    await utapi.deleteFiles(DeletePdfKey[0].key);
    // FINAL VERSION TODO: delete the embedding via Pinecone

    await createAuditLog({
      entityId: pdfId,
      entityType: "pdfFile",
      entityTitle: DeletePdfKey[0].name,
      action: "DELETE"
    });

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