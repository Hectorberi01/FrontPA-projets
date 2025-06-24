'use client'

import React from "react"
import dynamic from "next/dynamic"

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })
import "react-quill/dist/quill.snow.css"

export default function QuillEditor({ value, onChange }: { value: string, onChange: (v: string) => void }) {
    return <ReactQuill value={value} onChange={onChange} className="bg-white" />
}
