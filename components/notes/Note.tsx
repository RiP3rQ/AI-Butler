"use client";

import { Note as INoteModel } from "@prisma/client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../ui/card";
import AddEditNoteModal from "../modals/AddEditNoteModal";

type Props = {
  note: INoteModel;
};

const Note: React.FC<Props> = ({ note }) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const wasUpdated = note.updatedAt > note.createdAt;

  console.log(note);

  const date = (
    wasUpdated ? note.updatedAt : note.createdAt
  ).toLocaleString();
  const createdUpdatedAtTimestamp = new Date(date).toLocaleString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric"
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
      <AddEditNoteModal
        open={showEditDialog}
        setOpen={setShowEditDialog}
        noteToEdit={note}
      />
    </>
  );
};

export default Note;
