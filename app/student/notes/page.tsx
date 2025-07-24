'use client'
import { StudentLayout } from "@/components/layout/student-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, FileText, Eye } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getPromotionByStudentId } from "@/lib/services/promotionService"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/authContext"

export default function StudentNotesPage() {
  const [promotions, setPromotion] = useState<any>()
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { user } = useAuth()

  const fetchProjectsWithNotes = async () => {
    try {
      if (!user) {
        router.push("/")
        return
      }

      const userId = user.id
      if (!userId) {
        console.warn("User ID not found")
        return
      }

      const response = await getPromotionByStudentId(userId)
      console.log(response)
      setPromotion(response || [])
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjectsWithNotes()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Terminé":
        return "default"
      case "En cours":
        return "secondary"
      default:
        return "outline"
    }
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

  return (
    <StudentLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <GraduationCap className="mr-3 h-8 w-8 text-blue-600" />
              Mes notes
            </h1>
            <p className="text-gray-600 mt-1">Consultez vos notes et évaluations pour tous vos projets</p>
          </div>
        </div>

        <div className="space-y-8">
          {promotions?.map((promo: any) => (
            <div key={promo.id}>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
                {promo.promotion}
              </h2>
              
              {promo.projects.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun projet disponible pour cette promotion</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {promo.projects
                    .filter((project: any) => {
                        return project.groups?.some((group: any) =>
                        group.groupStudent?.some((gs: any) => gs.studentId === user?.id)
                        )
                    })
                    .map((project: any) => {

                    const studentId = user?.id
                    let myGroup: any = null

                    // Trouver le groupe de l'étudiant pour ce projet
                    if (project.groups) {
                      project.groups.forEach((group: any) => {
                        if (group.groupStudent?.some((gs: any) => gs.studentId === studentId)) {
                          myGroup = group
                        }
                      })
                    }

                    return (
                      <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <CardTitle className="text-lg">{project.name}</CardTitle>
                              <CardDescription className="mt-1">
                                {promo.promotion}
                              </CardDescription>
                            </div>
                            <Badge variant={getStatusColor(project.statut)}>
                              {project.statut}
                            </Badge>
                          </div>
                        </CardHeader>
                        
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {project.description}
                          </p>

                          {myGroup && (
                            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm font-medium text-blue-800">
                                Mon groupe: {myGroup.name || `Groupe ${myGroup.id}`}
                              </p>
                              {myGroup.groupStudent && (
                                <p className="text-xs text-blue-600 mt-1">
                                  {myGroup.groupStudent.length} membre(s)
                                </p>
                              )}
                            </div>
                          )}

                          <div className="flex justify-between items-center mt-4 pt-4 border-t">
                            {myGroup ? (
                              <>
                                <Badge 
                                  variant="outline" 
                                  className="text-green-600 border-green-600"
                                >
                                  Groupe assigné
                                </Badge>
                                <Button 
                                  size="sm" 
                                  asChild
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  <Link href={`/student/notes/${project.id}/group/${myGroup.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Voir mes notes
                                  </Link>
                                </Button>
                              </>
                            ) : (
                              <>
                                <Badge variant="outline" className="text-gray-500">
                                  Aucun groupe assigné
                                </Badge>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  disabled
                                  className="text-gray-400"
                                >
                                  Notes non disponibles
                                </Button>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {(!promotions || promotions.length === 0) && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune promotion trouvée</h3>
              <p className="text-gray-500">
                Vous n'êtes inscrit à aucune promotion pour le moment.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </StudentLayout>
  )
}