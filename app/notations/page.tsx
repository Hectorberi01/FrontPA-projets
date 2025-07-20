"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

// 🧪 MOCK DATA (remplacer par un appel API réel si besoin)
/**
 * Exemple de requête API réelle :
 * const response = await fetch(`/api/notation/grids`);
 */
const mockGrids = [
  {
    id: "1",
    title: "Livrable 1 - Groupe A",
    project: "Projet Fusion",
    group: "Groupe A",
    type: "livrable",
    status: "completed",
    finalGrade: 15.5
  },
  {
    id: "2",
    title: "Soutenance - Groupe B",
    project: "Projet Nébuleuse",
    group: "Groupe B",
    type: "soutenance",
    status: "pending",
    finalGrade: null
  },
  {
    id: "3",
    title: "Rapport - Groupe A",
    project: "Projet Fusion",
    group: "Groupe A",
    type: "rapport",
    status: "completed",
    finalGrade: 17.0
  }
]

export default function NotationOverviewPage() {
  const [grids, setGrids] = useState<typeof mockGrids | null>(null)

  useEffect(() => {
    // Simuler chargement async
    setTimeout(() => {
      setGrids(mockGrids)
    }, 500)
  }, [])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Vue d’ensemble des grilles de notation</h1>

      {!grids ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {grids.map((grid) => (
            <Card key={grid.id} className="border shadow-sm">
              <CardHeader>
                <CardTitle>{grid.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><strong>Projet :</strong> {grid.project}</p>
                <p><strong>Groupe :</strong> {grid.group}</p>
                <p><strong>Type :</strong> {grid.type}</p>
                <p>
                  <strong>Statut :</strong>{" "}
                  <span className={grid.status === "completed" ? "text-green-600" : "text-orange-600"}>
                    {grid.status === "completed" ? "Terminé" : "En attente"}
                  </span>
                </p>
                {grid.finalGrade !== null && (
                  <p><strong>Note finale :</strong> {grid.finalGrade} / 20</p>
                )}

                <div className="pt-2">
                  <Link href={`/notation/grille/${grid.id}`}>
                    <Button variant="default">
                      {grid.status === "completed" ? "Voir / Modifier" : "Noter"}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
