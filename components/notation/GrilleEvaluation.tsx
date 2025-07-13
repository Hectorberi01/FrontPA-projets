'use client'
import React, { useEffect, useState } from 'react'
import { Critere, Grille } from '@/lib/types/notation'
import { mockGrilles } from '@/lib/types/notation'

interface GrilleEvaluationProps {
    projectId: number
}

const GrilleEvaluation: React.FC<GrilleEvaluationProps> = ({ projectId }) => {
    const [grilles, setGrilles] = useState<Grille[]>([])
    const [notes, setNotes] = useState<Record<number, number>>({}) // clé = critereId

    useEffect(() => {
        // On utilise les données mockées pour commencer
        const data = mockGrilles.filter(g => g.projetId === projectId)
        setGrilles(data)
    }, [projectId])

    const handleNoteChange = (critereId: number, value: number) => {
        setNotes(prev => ({
            ...prev,
            [critereId]: value,
        }))
    }

    const handleSubmit = () => {
        console.log('Notes saisies :', notes)
        alert('Notes enregistrées (mock)')
    }

    return (
        <div className="space-y-8">
            {grilles.map(grille => (
                <div key={grille.id} className="border p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">{grille.titre} ({grille.type})</h2>

                    <table className="w-full border text-left">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2">Critère</th>
                            <th className="border p-2">Poids (%)</th>
                            <th className="border p-2">Note (sur 20)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {grille.criteres.map((critere: Critere) => (
                            <tr key={critere.id}>
                                <td className="border p-2">{critere.nom}</td>
                                <td className="border p-2">{critere.poids}</td>
                                <td className="border p-2">
                                    <input
                                        type="number"
                                        min={0}
                                        max={20}
                                        step={0.5}
                                        className="border rounded p-1 w-24"
                                        value={notes[critere.id] ?? ''}
                                        onChange={(e) =>
                                            handleNoteChange(critere.id, parseFloat(e.target.value))
                                        }
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {grille.commentairesGlobaux && (
                        <div className="mt-4 p-2 bg-gray-50 border rounded">
                            <strong>Commentaire global :</strong><br />
                            <em>{grille.commentairesGlobaux}</em>
                        </div>
                    )}
                </div>
            ))}

            <div className="text-center">
                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                    Enregistrer les notes
                </button>
            </div>
        </div>
    )
}

export default GrilleEvaluation
