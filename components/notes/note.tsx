"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import AddOrEditNoteModal from "../modals/add-or-edit-note-modal";
import { NoteType } from "@/drizzle/schema";

type Props = {
  note: NoteType;
};

const Note: React.FC<Props> = ({ note }) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const wasUpdated = note.updatedAt! > note.createdAt!;

  console.log(note);

  const date = (
    wasUpdated ? note.updatedAt! : note.createdAt!
  ).toLocaleString();
  const createdUpdatedAtTimestamp = new Date(date).toLocaleString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  return (
    <>
      <Card
        className="h-fit cursor-pointer transition-shadow hover:shadow-lg"
        onClick={() => setShowEditDialog(!showEditDialog)}
      >
        <CardHeader>
          <CardTitle>{note.title}</CardTitle>
          <CardDescription>
            {createdUpdatedAtTimestamp}
            {wasUpdated && " (updated)"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line">{note.content}</p>
        </CardContent>
      </Card>
      <AddOrEditNoteModal
        open={showEditDialog}
        setOpen={setShowEditDialog}
        noteToEdit={note}
      />
    </>
  );
};

export default Note;
