"use client"
import { useState } from "react"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

interface DocumentUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    //onUpload: (files: File[]) => void;
    onUpload: (data: {
        name: string;
        description: string;
        repoLink: string;
        file: File;
    }) => void;
}

export function DocumentUploadModal({ isOpen, onClose, onUpload }: DocumentUploadModalProps) {
    const [file, setFiles] = useState<File | null>(null)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [repoLink, setRepoLink] = useState("")

    const [errors, setErrors] = useState<{ name?: string; description?: string; files?: string }>({})


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFiles(selectedFile)
        }
    }

    const handleSubmit = () => {
        const newErrors: typeof errors = {}
        if (!name.trim()) newErrors.name = "Le titre est requis."
        if (!description.trim()) newErrors.description = "La description est requise."
        if (!file) newErrors.files = "Au moins un fichier est requis."

        setErrors(newErrors)
        if (Object.keys(newErrors).length > 0) return;

        if (!file) return
        onUpload({ name, description, repoLink, file })
        onClose()

    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Importer un document
                    </DialogTitle>
                    <DialogDescription>
                        Sélectionnez un ou plusieurs fichiers à téléverser.
                    </DialogDescription>
                </DialogHeader>

                {/* Titre */}
                <div>
                    <label className="block text-sm font-medium mb-1">Titre *</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Rapport final"
                        className="w-full border px-3 py-2 rounded text-sm"
                    />
                    {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full border px-3 py-2 rounded text-sm"
                        placeholder="Décrivez brièvement le contenu du document"
                    />
                    {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
                </div>

                {/* Lien vers dépôt */}
                <div>
                    <label className="block text-sm font-medium mb-1">Lien vers un dépôt (GitHub, GitLab...)</label>
                    <input
                        type="url"
                        value={repoLink}
                        onChange={(e) => setRepoLink(e.target.value)}
                        placeholder="https://github.com/..."
                        className="w-full border px-3 py-2 rounded text-sm"
                    />
                </div>

                {/* Upload de fichiers */}
                <div>
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx,.zip,.rar"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:border file:rounded file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {errors.files && <p className="text-sm text-red-600 mt-1">{errors.files}</p>}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={onClose}>Annuler</Button>
                    <Button onClick={handleSubmit} disabled={!file}>Enregistrer</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
