'use client'

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getGrillesByProjectId } from "@/lib/services/notation"
import {Grille, mockGrilles} from "@/lib/types/notation";


interface GrilleNotation {
  id: number
  type: 'livrable' | 'rapport' | 'soutenance'
  titre: string
  criteres: number
  statut: 'brouillon' | 'validee'
}

export default function GrillesProjetPage() {
  const params = useParams()
  const projectId = params.projectId as string

  const [grilles, setGrilles] = useState<Grille[]>([])

  useEffect(() => {
    const fetchGrilles = async () => {
      try {
        const data = mockGrilles
        setGrilles(data)
      } catch (error) {
        console.error("Erreur lors du chargement des grilles :", error)
      }
    }

    fetchGrilles()
  }, [projectId])

  return (
      <DashboardLayout>
        <div className="container mx-auto py-10">
          <h1 className="text-3xl font-bold text-center mb-8">Grilles de Notation du Projet</h1>

          <div className="flex justify-end mb-4">
            <Link href={`/notations/${projectId}/grille`}>
              <Button>+ Ajouter une grille</Button>
            </Link>
          </div>

          <div className="bg-white rounded-lg border p-6 shadow-md">
            {grilles.length === 0 ? (
                <p className="text-gray-600">Aucune grille définie pour ce projet.</p>
            ) : (
                <table className="table-auto w-full border text-left">
                  <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">Titre</th>
                    <th className="p-2 border">Type</th>
                    <th className="p-2 border">Nombre de Critères</th>
                    <th className="p-2 border">Statut</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {grilles.map((grille) => (
                      <tr key={grille.id}>
                        <td className="p-2 border">{grille.titre}</td>
                        <td className="p-2 border">{grille.type}</td>
                        <td className="p-2 border">
                          <ul className="list-disc list-inside">
                            {grille.criteres.map(c => (
                                <li key={c.id}>{c.nom} ({c.poids}%)</li>
                            ))}
                          </ul>
                        </td>
                        <td className="p-2 border">{grille.statut}</td>
                        <td className="p-2 border">
                          <Link href={`/notations/${projectId}/grille/${grille.id}`} className="inline-block">
                            <button className="px-3 py-1 text-white bg-blue-600 hover:bg-blue-700 rounded">
                              {grille.statut === 'en cours' ? 'Remplir' : 'Voir / Modifier'}
                            </button>
                          </Link>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
            )}
          </div>
        </div>
      </DashboardLayout>
  )
}
