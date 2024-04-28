import { auth } from "@clerk/nextjs";
import { createAuditLog } from "@/lib/auditLog/createAuditLog";
import { db } from "@/drizzle";
import { chat } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function POST() {
  try {
    const { userId } = auth();

    if (!userId) {
      return Response.json({ error: "Not logged in." }, { status: 401 });
    }

    let chatContent;

    chatContent = await db
      .insert(chat)
      .values({
        userId,
        title: "New Chat",
      })
      .returning({
        id: chat.id,
        title: chat.title,
      });

    await createAuditLog({
      entityId: chatContent[0].id,
      entityType: "chat",
      entityTitle: chatContent[0].title,
      action: "CREATE",
    });

    return Response.json({ chat }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return Response.json({ error: "Not logged in." }, { status: 401 });
    }

    const chats = await db.query.chat.findMany({
      where: eq(chat.userId, userId),
    });

    if (!chats) {
      return Response.json({ error: "Chats not found." }, { status: 404 });
    }

    return Response.json({ chats }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
