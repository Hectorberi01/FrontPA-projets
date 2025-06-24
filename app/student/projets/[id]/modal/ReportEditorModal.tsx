'use client'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import dynamic from "next/dynamic";
//import ReactQuill from "react-quill"
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import QuillEditor from "@/app/student/projets/[id]/modal/QuillEditor";
import TiptapEditor from "@/app/student/projets/[id]/modal/TiptapEditor";
export function ReportEditorModal({ projectId }: { projectId: number }) {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")

    const handleSubmit = async () => {
        console.log({ projectId, title, content })
    }

    return (
        <div className="space-y-4">
            <Input
                placeholder="Titre du rapport"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <TiptapEditor value={content} onChange={setContent} />
            <Button onClick={handleSubmit}>Soumettre</Button>
        </div>
    );
}
