import { z } from "zod";

export const createNoteSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title must be at least 1 character long" })
    .max(100, { message: "Title must be at most 100 characters long" }),
  content: z
    .string()
    .min(1, { message: "Content must be at least 1 character long" }),
});

export type ICreateNoteSchema = z.infer<typeof createNoteSchema>;

export const updateNoteSchema = createNoteSchema.extend({
  id: z.string().min(1, { message: "ID must be at least 1 character long" }),
});

export const deleteNoteSchema = z.object({
  id: z.string().min(1, { message: "ID must be at least 1 character long" }),
});
