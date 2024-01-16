import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import React from "react";
import prisma from "@/lib/db";
import Note from "@/components/Note";

export const metadata: Metadata = {
  title: "AI-Butler - Notes",
  description:
    "AI-Butler using OpenAI's API created by RiP3rQ using Sonny Sangha's and Coding in Flow's tutorials",
};

export default async function NotesPage() {
  const { userId } = auth();

  if (!userId) {
    throw new Error("UserId is not defined");
  }

  const allNotes = await prisma.note.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {allNotes.map((note) => (
        <Note key={note.id} note={note} />
      ))}
      {allNotes.length === 0 && (
        <div className="text-center">
          <p className="text-lg font-semibold">No notes yet!</p>
          <p className="text-gray-500">
            Click the button above to add your first note.
          </p>
        </div>
      )}
    </div>
  );
}
