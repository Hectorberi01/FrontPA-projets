"use client"

import { useState } from "react"
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {FileText} from "lucide-react";
import {
    BtnBold, BtnClearFormatting,
    BtnItalic, BtnLink,
    BtnNumberedList, BtnRedo,
    BtnStrikeThrough,
    BtnUnderline, BtnUndo,
    createButton,
    Editor,
    EditorProvider,
    Toolbar
} from "react-simple-wysiwyg";

interface RapportEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    rapport: {title : string,content : string};
    onSave: (data: { title: string; content: string }) => void;
}

function BtnBulletedList() {
    return null;
}

function BtnAlignLeft() {
    return null;
}

export function RapportEditorModal({ isOpen, onClose, rapport, onSave }: RapportEditorModalProps) {
    const [html, setHtml] = useState('Mon <b>rapport</b>');
    const [title, setTitle] = useState('');

    function onChange(e:any) {
        setHtml(e.target.value);
        rapport.title = title;
        rapport.content = html

    }

    const handleClick = () => {
        onSave({ title, content: html }); // ✅ appel avec l'objet attendu
    };
    const BtnAlignLeft = createButton("Aligner à gauche", "≡", "justifyLeft");
    const BtnAlignCenter = createButton('Align center', '≡', 'justifyCenter');
    const BtnAlignRight = createButton("Aligner à droite", "≣", "justifyRight");

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5"/>
                        Éditeur de rapport
                    </DialogTitle>
                    <DialogDescription>Rédigez votre rapport avec l'éditeur intégré</DialogDescription>
                </DialogHeader>

                <input
                    type="text"
                    placeholder="Titre du rapport"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border p-2 rounded w-full text-lg font-medium"
                />
                <EditorProvider>
                    <Editor value={html} onChange={onChange} containerProps={{style: {resize: 'vertical'}}}>
                        <Toolbar>
                            <BtnBold/>
                            <BtnItalic/>
                            <BtnUnderline/>
                            <BtnStrikeThrough/>
                            <BtnNumberedList/>
                            <BtnBulletedList/>
                            <BtnLink/>
                            <BtnUndo/>
                            <BtnRedo/>
                            <BtnAlignLeft/>
                            <BtnAlignCenter/>
                            <BtnAlignRight/>
                            <BtnClearFormatting/>
                            <BtnAlignCenter/>
                        </Toolbar>
                    </Editor>
                </EditorProvider>
                <div className="flex justify-end gap-2">
                    <button
                        className="px-4 py-2 bg-gray-200 rounded"
                        onClick={onClose}
                    >
                        Annuler
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-950 text-white rounded"
                        onClick={handleClick}
                    >
                        Enregistrer
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
