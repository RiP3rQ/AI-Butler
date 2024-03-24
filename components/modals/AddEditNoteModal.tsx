import { ICreateNoteSchema, createNoteSchema } from "@/lib/validation";
import React, { useState } from "react";
import { Form, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import LoadingButton from "../LoadingButton";
import { useRouter } from "next/navigation";
import { Note } from "@prisma/client";
import { toast } from "sonner";
import { mutate } from "swr";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  noteToEdit?: Note;
};

const AddEditNoteModal: React.FC<Props> = ({ open, setOpen, noteToEdit }) => {
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const router = useRouter();

  const form = useForm<ICreateNoteSchema>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: noteToEdit?.title || "",
      content: noteToEdit?.content || ""
    }
  });

  async function onSubmit(input: ICreateNoteSchema) {
    try {
      if (noteToEdit) {
        const response = await fetch("/api/notes", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ...input,
            id: noteToEdit.id
          })
        });

        if (!response.ok) {
          throw new Error("Error creating note" + response.statusText);
        }
        await mutate(`${process.env.NEXT_PUBLIC_URL}/api/notes/allNotes`);
        toast.success("Note updated successfully!");
      } else {
        const response = await fetch("/api/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(input)
        });

        if (!response.ok) {
          throw new Error("Error creating note" + response.statusText);
        }
        await mutate(`${process.env.NEXT_PUBLIC_URL}/api/notes/allNotes`);
        toast.success("Note created successfully!");
      }

      form.reset();
      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Error! Check console for more details.");
    }
  }

  async function onDelete() {
    if (!noteToEdit) return;
    setDeleteInProgress(true);
    try {
      const response = await fetch("/api/notes", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: noteToEdit?.id
        })
      });

      if (!response.ok) {
        throw new Error("Error deleting note" + response.statusText);
      }

      await mutate(`${process.env.NEXT_PUBLIC_URL}/api/notes/allNotes`);
      toast.success("Note deleted successfully!");

      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Error! Check console for more details.");
    } finally {
      setDeleteInProgress(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{noteToEdit ? "Edit note" : "Add note"}</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Note title..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Note content..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-1 sm:gap-0">
              {noteToEdit && (
                <LoadingButton
                  variant={"destructive"}
                  loading={deleteInProgress}
                  onClick={onDelete}
                  disabled={form.formState.isSubmitting}
                  type="button"
                >
                  Delete note
                </LoadingButton>
              )}
              <LoadingButton
                type="submit"
                loading={form.formState.isSubmitting}
                disabled={deleteInProgress}
              >
                Submit
              </LoadingButton>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditNoteModal;
