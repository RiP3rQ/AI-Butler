"use client";

import Note from "@/components/notes/Note";
import NotesActionButtons from "@/components/notes/NotesActionButtons";
import React from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

const NotesGrid = () => {
  // TODO: MIGRATE TO DRIZZLE
  const { data } = useSWR(
    `${process.env.NEXT_PUBLIC_URL}/api/notes/allNotes`,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateOnMount: true
    }
  );
  const allNotes = data?.data;

  console.log(allNotes);

  if (!allNotes) {
    return null;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-4">
      {allNotes?.map((note: any) => (
        <Note key={note.id} note={note} />
      ))}
      {allNotes.length === 0 && (
        <div className="col-span-3 mt-10 text-center">
          <p className="text-lg font-semibold">No notes yet!</p>
          <p className="text-gray-500">
            Click the button above to add your first note.
          </p>
        </div>
      )}
      <NotesActionButtons />
    </div>
  );
};

export default NotesGrid;