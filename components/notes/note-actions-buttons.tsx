"use client";

import AiChatButton from "@/components/chatbot/ai-chat-button";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import AddOrEditNoteModal from "@/components/modals/add-or-edit-note-modal";

type Props = {};

const NoteActionsButtons: React.FC<Props> = (props) => {
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);

  return (
    <>
      <div className="absolute bottom-3 right-3">
        <AiChatButton />
      </div>
      <div className={"absolute bottom-3 left-3"}>
        <Button
          onClick={() => setShowAddEditNoteDialog(!showAddEditNoteDialog)}
        >
          <Plus size={20} className="mr-2" />
          Add Note
        </Button>
      </div>
      <AddOrEditNoteModal
        open={showAddEditNoteDialog}
        setOpen={setShowAddEditNoteDialog}
      />
    </>
  );
};

export default NoteActionsButtons;
