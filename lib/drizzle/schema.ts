import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const $posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  imageUrl: text("imageUrl"),
  userId: text("user_id").notNull(),
  editorState: text("editor_state")
});

export type NoteType = typeof $posts.$inferInsert;

// drizzle-orm
// drizzle-kit