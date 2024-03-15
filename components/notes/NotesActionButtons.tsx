"use client";

import AIChatButton from "@/components/aichatbot/AIChatButton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import Note from "@/components/notes/Note";
import AddEditNoteDialog from "@/components/notes/AddEditNoteDialog";

type Props = {};

const NotesActionButtons: React.FC<Props> = (props) => {
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);

  return (
    <>
      <div className="absolute bottom-3 right-3">
        <AIChatButton />
      </div>
      <div className={"absolute bottom-3 left-3"}>
        <Button
          onClick={() => setShowAddEditNoteDialog(!showAddEditNoteDialog)}
        >
          <Plus size={20} className="mr-2" />
          Add Note
        </Button>
      </div>
      <AddEditNoteDialog
        open={showAddEditNoteDialog}
        setOpen={setShowAddEditNoteDialog}
      />
    </>
  );
};

export default NotesActionButtons;