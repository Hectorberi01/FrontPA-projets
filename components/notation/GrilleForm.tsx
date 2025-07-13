'use client'
import { useState } from 'react'
import { Critere, Grille } from '@/lib/types/notation'

interface CritereForm {
    nom: string
    poids: number
    commentaire?: string
}

interface GrilleFormProps {
    projectId: number
    onSave?: (grille: Grille) => void
}

export default function GrilleForm({ projectId, onSave }: GrilleFormProps) {
    const [titre, setTitre] = useState('')
    const [type, setType] = useState<'livrable' | 'rapport' | 'soutenance'>('livrable')
    const [criteres, setCriteres] = useState<CritereForm[]>([
        { nom: '', poids: 0 }
    ])
    const [commentaire, setCommentaire] = useState('')

    const handleChangeCritere = (index: number, field: keyof CritereForm, value: string | number) => {
        const newCriteres = [...criteres]
        if (field === 'poids') {
            newCriteres[index][field] = Number(value)
        } else {
            newCriteres[index][field] = String(value)
        }
        setCriteres(newCriteres)
    }

    const addCritere = () => {
        setCriteres([...criteres, { nom: '', poids: 0 }])
    }

    const removeCritere = (index: number) => {
        const newCriteres = criteres.filter((_, i) => i !== index)
        setCriteres(newCriteres)
    }

    const handleSubmit = () => {
        const grille: Grille = {
            id: Date.now(), // temporaire pour mock
            titre,
            type,
            projetId: projectId,
            statut: 'en cours',
            commentairesGlobaux: commentaire,
            criteres: criteres.map((c, i) => ({
                id: i + 1,
                nom: c.nom,
                poids: c.poids,
                commentaire: c.commentaire
            }))
        }

        console.log('Grille créée :', grille)
        alert('Grille enregistrée (mock)')
        if (onSave) onSave(grille)
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 border rounded shadow space-y-6">
            <h2 className="text-xl font-bold">Créer une nouvelle grille</h2>

            <div>
                <label className="block font-medium">Titre</label>
                <input
                    value={titre}
                    onChange={e => setTitre(e.target.value)}
                    className="border p-2 w-full"
                    placeholder="Ex: Grille rapport final"
                />
            </div>

            <div>
                <label className="block font-medium">Type</label>
                <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="border p-2 w-full"
                >
                    <option value="livrable">Livrable</option>
                    <option value="rapport">Rapport</option>
                    <option value="soutenance">Soutenance</option>
                </select>
            </div>

            <div className="space-y-4">
                <label className="block font-medium">Critères</label>
                {criteres.map((critere, index) => (
                    <div key={index} className="flex items-center gap-4">
                        <input
                            type="text"
                            placeholder="Nom du critère"
                            value={critere.nom}
                            onChange={(e) => handleChangeCritere(index, 'nom', e.target.value)}
                            className="border p-2 flex-1"
                        />
                        <input
                            type="number"
                            placeholder="Poids (%)"
                            value={critere.poids}
                            onChange={(e) => handleChangeCritere(index, 'poids', e.target.value)}
                            className="border p-2 w-24"
                        />
                        <button
                            onClick={() => removeCritere(index)}
                            className="text-red-600 hover:underline"
                        >
                            Supprimer
                        </button>
                    </div>
                ))}
                <button
                    onClick={addCritere}
                    className="text-blue-600 hover:underline"
                >
                    + Ajouter un critère
                </button>
            </div>

            <div>
                <label className="block font-medium">Commentaire global</label>
                <textarea
                    value={commentaire}
                    onChange={e => setCommentaire(e.target.value)}
                    className="border p-2 w-full"
                    rows={3}
                />
            </div>

            <div className="text-right pt-4">
                <button
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:from-green-600 hover:to-green-800 transition-all duration-300"
                >
                    💾 Enregistrer la grille
                </button>
            </div>

        </div>
    )
}
