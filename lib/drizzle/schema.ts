import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const $posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  imageUrl: text("imageUrl"),
  userId: text("user_id").notNull(),
  editorState: text("editor_state")
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
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

export type PostsAnalysisType = typeof $postsAnalysis.$inferInsert;

export const postsRelations = relations($posts, ({ one }) => ({
  postsAnalysis: one($postsAnalysis, {
    fields: [$posts.id],
    references: [$postsAnalysis.postId]
  })
}));

export const postsAnalysisRelations = relations($postsAnalysis, ({ one }) => ({
  post: one($posts, {
    fields: [$postsAnalysis.postId],
    references: [$posts.id]
  })
}));

// drizzle-orm
// drizzle-kit
