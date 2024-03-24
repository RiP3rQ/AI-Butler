"use client";
import React, { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import TipTapMenuBar from "./TipTapMenuBar";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebouce";
import { useMutation } from "@tanstack/react-query";
import Text from "@tiptap/extension-text";
import axios from "axios";
import { PostType } from "@/lib/drizzle/schema";
import { useCompletion } from "ai/react";
import { mutate } from "swr";
import { toast } from "sonner";

type Props = { post: PostType };

// TODO: (LATER) BETTER COLORS AND UI + context menu on right click

const TipTapEditor = ({ post }: Props) => {
  const [editorState, setEditorState] = useState(
    post.editorState || ""
  );
  const { complete, completion } = useCompletion({
    api: "/api/journal/completion"
  });
  const savePost = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/journal/savePost", {
        postId: post.id,
        editorState
      });

      await mutate(`${process.env.NEXT_PUBLIC_URL}/api/journal/${post.id}`);
      return response.data;
    }
  });

  const analyzePost = useMutation({
    mutationFn: async () => {
      const response = await axios.put("/api/journal/analyzePost", {
        postId: post.id,
        editorState
      });
      await mutate(`${process.env.NEXT_PUBLIC_URL}/api/journal/${post.id}`);
      return response.data;
    }
  });

  const customText = Text.extend({
    addKeyboardShortcuts() {
      return {
        "Shift-a": () => {
          // take the last 30 words
          const prompt = this.editor.getText().split(" ").slice(-30).join(" ");
          complete(prompt);
          return true;
        }
      };
    }
  });

  const editor = useEditor({
    autofocus: true,
    extensions: [StarterKit, customText],
    content: editorState,
    onUpdate: ({ editor }) => {
      setEditorState(editor.getHTML());
    }
  });
  const lastCompletion = useRef("");

  useEffect(() => {
    if (!completion || !editor) return;
    const diff = completion.slice(lastCompletion.current.length);
    lastCompletion.current = completion;
    editor.commands.insertContent(diff);
  }, [completion, editor]);

  const debouncedEditorState = useDebounce(editorState, 1000);
  useEffect(() => {
    // save to db
    if (debouncedEditorState === "") return;
    savePost.mutate(undefined, {
      onSuccess: (data) => {
        toast.success("Post saved successfully");
      },
      onError: (err) => {
        console.error(err);
      }
    });
  }, [debouncedEditorState]);

  return (
    <>
      {savePost.isPending ? "Saving..." : null}
      <div className="flex items-center justify-between">
        {editor && <TipTapMenuBar editor={editor} />}
        <Button variant={"outline"} onClick={() => {
          analyzePost.mutate(undefined, {
            onSuccess: (data) => {
              toast.success("Post analyzed successfully");
            },
            onError: (err) => {
              console.error(err);
            }
          });
        }}>
          Analysis
        </Button>
      </div>

      <div className="prose prose-sm mt-4 w-full">
        <EditorContent editor={editor} />
      </div>
      <div className="h-4"></div>
      <span className="text-sm">
        Tip: Press{" "}
        <kbd className="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800">
          Shift + A
        </kbd>{" "}
        for AI autocomplete
      </span>
    </>
  );
};

export default TipTapEditor;
