"use server";

import { auth, currentUser } from "@clerk/nextjs";
import { db } from "@/lib/drizzle";
import { $auditLogs, $postsAnalysis } from "@/lib/drizzle/schema";
import { getAuth } from "@clerk/nextjs/server";

const EntityTypes = {
  note: "note",
  chat: "chat",
  chatMessage: "chatMessage",
  users: "users",
  posts: "posts",
  postsAnalysis: "postsAnalysis",
  pdfFiles: "pdfFiles",
  pdfFileMessages: "pdfFileMessages"
};
type IEntityType =
  "note"
  | "chat"
  | "chatMessage"
  | "user"
  | "post"
  | "postsAnalysis"
  | "pdfFile"
  | "pdfFileMessage";

const Actions = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE"
};
type IActions = "CREATE" | "UPDATE" | "DELETE";

interface AuditLogProps {
  entityId: string;
  entityType: IEntityType;
  entityTitle: string;
  action: IActions;
}

export async function createAuditLog({
                                       entityId,
                                       entityType,
                                       entityTitle,
                                       action
                                     }: AuditLogProps) {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!user || !userId) {
      throw new Error("User not found!");
    }

    const userName = user?.firstName
      ? user?.firstName + " " + user?.lastName
      : user?.username;

    await db.insert($auditLogs).values({
      action,
      entityId,
      entityType,
      entityTitle,
      userId,
      userImage: user?.imageUrl,
      userName
    });
  } catch (error) {
    console.log("[AUDIT_LOG_ERROR]", error);
  }
};