import {
  boolean,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const $users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),

  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  stripePriceId: text("stripe_price_id"),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end"),
});
export type UserType = typeof $users.$inferInsert;

export const $posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  imageUrl: text("imageUrl"),
  userId: text("user_id").notNull(),
  editorState: text("editor_state"),
});
export type PostType = typeof $posts.$inferInsert;

export const $postsAnalysis = pgTable("post_analysis", {
  id: serial("id").primaryKey(),
  postId: text("post_id").notNull(),
  userId: text("user_id").notNull(),
  mood: text("mood").notNull(),
  subject: text("subject").notNull(),
  summary: text("summary").notNull(),
  color: text("color").notNull(),
  sentimentScore: text("sentiment_score").notNull(),
  negative: boolean("negative").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
export type PostsAnalysisType = typeof $postsAnalysis.$inferInsert;

export const postsRelations = relations($posts, ({ one }) => ({
  postsAnalysis: one($postsAnalysis, {
    fields: [$posts.id],
    references: [$postsAnalysis.postId],
  }),
}));

export const postsAnalysisRelations = relations($postsAnalysis, ({ one }) => ({
  post: one($posts, {
    fields: [$postsAnalysis.postId],
    references: [$posts.id],
  }),
}));

export const UploadStatus = pgEnum("upload_status", [
  "PENDING",
  "PROCESSING",
  "FAILED",
  "SUCCESS",
]);
export const $PdfFiles = pgTable("pdf_files", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  uploadStatus: UploadStatus("upload_status").default("PENDING"),
  url: text("url").notNull(),
  key: text("key").notNull(),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
export type PdfFilesType = typeof $PdfFiles.$inferInsert;

export const $pdfFileMessages = pgTable("pdf_file_messages", {
  id: serial("id").primaryKey(),
  pdfFileId: text("pdf_file_id").notNull(),
  userId: text("user_id").notNull(),
  isUserMessage: boolean("is_user_message").notNull(),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
export type PdfFileMessagesType = typeof $pdfFileMessages.$inferInsert;

// -------------------------------------------- AUDIT LOGS --------------------------------------------
export const $auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  action: text("action").notNull(),
  entityId: text("entity_id").notNull(),
  entityType: text("entity_type").notNull(),
  entityTitle: text("entity_title").notNull(),
  userId: text("user_id").notNull(),
  userImage: text("user_image"),
  userName: text("user_name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type AuditLogType = typeof $auditLogs.$inferInsert;

// NOTION - TEST
export const $workspaces = pgTable("workspaces", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  })
    .defaultNow()
    .notNull(),
  workspaceOwner: uuid("workspace_owner").notNull(),
  title: text("title").notNull(),
  iconId: text("icon_id").notNull(),
  data: text("data"),
  inTrash: text("in_trash"),
  logo: text("logo"),
  bannerUrl: text("banner_url"),
});

export const $folders = pgTable("folders", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  })
    .defaultNow()
    .notNull(),
  title: text("title").notNull(),
  iconId: text("icon_id").notNull(),
  data: text("data"),
  inTrash: text("in_trash"),
  bannerUrl: text("banner_url"),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => $workspaces.id, {
      onDelete: "cascade",
    }),
});

export const $files = pgTable("files", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  })
    .defaultNow()
    .notNull(),
  title: text("title").notNull(),
  iconId: text("icon_id").notNull(),
  data: text("data"),
  inTrash: text("in_trash"),
  bannerUrl: text("banner_url"),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => $workspaces.id, {
      onDelete: "cascade",
    }),
  folderId: uuid("folder_id")
    .notNull()
    .references(() => $folders.id, {
      onDelete: "cascade",
    }),
});

export const $collaborators = pgTable("collaborators", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => $workspaces.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  })
    .defaultNow()
    .notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => $users.id, { onDelete: "cascade" }),
});
