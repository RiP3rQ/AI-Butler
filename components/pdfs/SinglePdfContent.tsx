import { db } from "@/lib/drizzle";
import { $PdfFiles } from "@/lib/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import PdfRenderer from "@/components/pdfs/renderer/PdfRenderer";
import ChatWrapper from "@/components/pdfs/chat/ChatWrapper";

interface Props {
  pdfName: string;
  userId: string | null;
}

const SinglePdfContent = async ({ pdfName, userId }: Props) => {
  if (!userId) redirect("/dashboard");
  const fullPdfName = pdfName + ".pdf";

  const file = await db.select().from($PdfFiles).where(and(eq($PdfFiles.userId, userId), eq($PdfFiles.key, fullPdfName))) as any;

  if (!file) redirect("/dashboard");

  return (
    <div className="flex-1 justify-between flex flex-col h-[calc(100vh-10rem)]">
      <div className="mx-auto h-full w-full max-w-8xl grow lg:flex xl:px-2">
        {/* Left sidebar & main wrapper */}
        <div className="flex-1 xl:flex h-full">
          <div className="px-4 py-1 xl:flex-1 h-full">
            {/* Main area */}
            <PdfRenderer url={file[0].url} />
          </div>
        </div>

        <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
          <ChatWrapper isSubscribed={false} fileKey={file[0].key} />
        </div>
      </div>
    </div>
  );
};

export default SinglePdfContent;