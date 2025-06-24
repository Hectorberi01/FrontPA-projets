"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function TiptapEditor({value, onChange,}: { value: string; onChange: (content: string) => void; }) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: value,
        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },
    });

    return (
        <div className="border rounded-md bg-white">
            <EditorContent editor={editor} className="p-4 min-h-[200px]" />
        </div>
    );
}
