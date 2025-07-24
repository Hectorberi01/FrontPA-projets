'use client'
import { StudentLayout } from "@/components/layout/student-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, MessageCircle, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/authContext"
import { gradingApi } from "@/lib/services/notation"

interface Note {
  id: string
  critereId: string
  note: number
  commentaire?: string
  critere?: {
    nom: string
    description: string
    baremeMax: number
  }
}

interface CommentaireGlobal {
  id: string
  commentaire: string
  dateCreation: string
}

interface GrilleValidee {
  id: string
  nom: string
  criteres: Array<{
    id: string
    nom: string
    description: string
    baremeMax: number
  }>
}

interface NotationData {
  notes: Note[]
  commentairesGlobaux: CommentaireGlobal[]
  commentaireProjet?: string
  grillesValidees: GrilleValidee[]
  notationFinalisee: boolean
}

export default function StudentNoteDetailPage() {
  const [notationData, setNotationData] = useState<NotationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()

  const projectId = params?.projectId as string
  const groupId = params?.groupId as string

  useEffect(() => {
    const fetchNotation = async () => {
      try {
        if (!user) {
          router.push("/")
          return
        }

        if (!projectId || !groupId) {
          setError("Paramètres manquants")
          return
        }

        const data = await gradingApi.getNotationByGroup(projectId, groupId)
        setNotationData(data)
      } catch (error) {
        console.error("Erreur lors de la récupération des notes:", error)
        setError("Impossible de charger les notes")
      } finally {
        setLoading(false)
      }
    }

    fetchNotation()
  }, [projectId, groupId, user, router])

  const calculateTotalScore = () => {
    if (!notationData?.notes || notationData.notes.length === 0) return { total: 0, max: 0 }
    
    const total = notationData.notes.reduce((sum, note) => sum + note.note, 0)
    const max = notationData.notes.reduce((sum, note) => {
      return sum + (note.critere?.baremeMax || 0)
    }, 0)
    
    return { total, max }
  }

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  if (loading) {
    return (
      <StudentLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement des notes...</p>
            </div>
          </div>
        </div>
      </StudentLayout>
    )
  }

  if (error) {
    return (
      <StudentLayout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-red-500 mb-4">
                <MessageCircle className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <Button asChild>
                <Link href="/student/notes">Retour aux notes</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </StudentLayout>
    )
  }

  const { total, max } = calculateTotalScore()
  const percentage = max > 0 ? ((total / max) * 100).toFixed(1) : "0"

  return (
    <StudentLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" asChild className="mb-4">
            <Link href="/student/notes">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux notes
            </Link>
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Détail des notes</h1>
              <p className="text-gray-600 mt-1">Projet - Groupe {groupId}</p>
            </div>
            
            <div className="text-right">
              <div className={`text-3xl font-bold ${getScoreColor(total, max)}`}>
                {total}/{max}
              </div>
              <div className="text-sm text-gray-500">
                {percentage}% ({total} points)
              </div>
              {notationData?.notationFinalisee ? (
                <Badge className="mt-2 bg-green-100 text-green-800">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Notation finalisée
                </Badge>
              ) : (
                <Badge variant="outline" className="mt-2">
                  <Clock className="mr-1 h-3 w-3" />
                  En cours d'évaluation
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Notes détaillées par critère */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Évaluation par critères</CardTitle>
              <CardDescription>
                Détail de votre notation pour chaque critère d'évaluation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {notationData?.notes && notationData.notes.length > 0 ? (
                <div className="space-y-4">
                  {notationData.notes.map((note) => (
                    <div key={note.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {note.critere?.nom || "Critère sans nom"}
                          </h4>
                          {note.critere?.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {note.critere.description}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className={`text-xl font-bold ${getScoreColor(note.note, note.critere?.baremeMax || 0)}`}>
                            {note.note}/{note.critere?.baremeMax || 0}
                          </div>
                          <div className="flex items-center text-sm text-yellow-600">
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            {note.critere?.baremeMax ? 
                              ((note.note / note.critere.baremeMax) * 100).toFixed(0) : 0}%
                          </div>
                        </div>
                      </div>
                      
                      {note.commentaire && (
                        <div className="mt-3 p-3 bg-gray-50 rounded">
                          <p className="text-sm text-gray-700">
                            <MessageCircle className="inline h-4 w-4 mr-1" />
                            {note.commentaire}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Aucune note disponible pour ce projet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Commentaire général du projet */}
          {notationData?.commentaireProjet && (
            <Card>
              <CardHeader>
                <CardTitle>Commentaire général du projet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-gray-700">{notationData.commentaireProjet}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Commentaires globaux */}
          {notationData?.commentairesGlobaux && notationData.commentairesGlobaux.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Commentaires des évaluateurs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notationData.commentairesGlobaux.map((commentaire) => (
                    <div key={commentaire.id} className="p-4 border rounded-lg">
                      <p className="text-gray-700 mb-2">{commentaire.commentaire}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(commentaire.dateCreation).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </StudentLayout>
  )
}