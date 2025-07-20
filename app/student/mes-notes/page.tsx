"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { gradingApi } from "@/lib/services/notation"
import { Grille } from "@/lib/types/notation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"


export default function MesNotesPage() {

  const studentId = 1 ;// session?.user?.id // 🧠 Assurez-vous que l’ID est dans la session
  const params = useParams()
  const projectId = params?.id as string

  const [grilles, setGrilles] = useState<Grille[]>([])
  const [notes, setNotes] = useState<
    Record<
      string,
      {
        note: number
        commentaireGlobal?: string
        criteres: {
          critereId: number
          nom: string
          poids: number
          note: number
          commentaire?: string
        }[]
      }
    >
  >({})
  const [noteGlobale, setNoteGlobale] = useState<number>(0)

  useEffect(() => {
    const fetchNotes = async () => {
      if (!studentId || !projectId) return
      try {
     //   const studentNotes = await gradingApi.getStudentGrades(Number(studentId), Number(projectId))
        const grilles = await gradingApi.getProjectGrilles(projectId)
        setGrilles(grilles)

       // const noteFinale = studentNotes.reduce((acc: number, note: any) => {
       //    const ponderation = note.ponderation ?? 1
       //    return acc + (note.finalScore ?? 0) * ponderation
       // }, 0)

       /* const notesFormat = studentNotes.reduce((acc: any, note: any) => {
          acc[note.grilleId] = {
            note: note.finalScore,
            commentaireGlobal: note.globalComment,
            criteres: note.criteres.map((crit: any) => ({
              critereId: crit.critereId,
              nom: crit.nom,
              poids: crit.poids,
              note: crit.score,
              commentaire: crit.comment,
            })),
          }
          return acc
        }, {})

        setNoteGlobale(noteFinale)
        setNotes(notesFormat)*/
      } catch (error) {
        console.error("Erreur chargement notes étudiant:", error)
      }
    }

    fetchNotes()
  }, [studentId, projectId])

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">Mes notes</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Note finale du projet</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between p-6">
          <div className="text-4xl font-bold text-blue-600">{noteGlobale.toFixed(2)}/20</div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {grilles.map((grille) => {
          const details = notes[grille.id]
          if (!details) return null

          return (
            <Card key={grille.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{grille.titre}</CardTitle>
                    <CardDescription className="capitalize">{grille.type}</CardDescription>
                  </div>
                  <div className="text-lg font-semibold">
                    {details.note?.toFixed(2)}/20
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {details.commentaireGlobal && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Commentaire global :
                    </div>
                    <p className="text-base">{details.commentaireGlobal}</p>
                  </div>
                )}

                <div className="space-y-3">
                  {details.criteres.map((critere) => (
                    <div
                      key={critere.critereId}
                      className="border rounded-md p-4 bg-gray-50"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <div className="font-medium">{critere.nom}</div>
                        <div className="font-semibold text-right">
                          {critere.note}/20
                          <span className="ml-2 text-xs text-muted-foreground">
                            (Poids: {critere.poids}%)
                          </span>
                        </div>
                      </div>
                      {critere.commentaire && (
                        <div className="text-sm text-muted-foreground italic">
                          Commentaire : {critere.commentaire}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
