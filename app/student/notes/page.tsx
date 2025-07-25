'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/authContext'
import { StudentLayout } from '@/components/layout/student-layout'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { GraduationCap } from 'lucide-react'

interface Project {
  id: number
  name: string
  description: string
  noteFinale?: string
}

interface Promotion {
  id: number
  name: string
  projects: Project[]
}

export default function StudentNotesPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const PROMOTION_SERVER_URL = process.env.NEXT_PUBLIC_PROMOTION_URL || "http://localhost:3000/api/promotions";
const BASE_URL = process.env.NEXT_PUBLIC_NOTATION_URL|| "http://localhost:3000/api/notations"; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.id) return
        
        // Récupérer les promotions de l'étudiant
        const response = await fetch(`${PROMOTION_SERVER_URL}/students/${user.id}`)
        const data = await response.json()
        
        // Pour chaque projet, récupérer la note finale
        const promotionsWithNotes = await Promise.all(
          data.map(async (promo: any) => {
            const projectsWithNotes = await Promise.all(
              promo.projects.map(async (project: any) => {
                // Trouver le groupe de l'étudiant dans ce projet
                const userGroup = project.groups?.find((group: any) => 
                  group.groupStudent?.some((gs: any) => gs.studentId === user.id)
                )

                if (userGroup) {
                  // Récupérer la notation
                  const notationResponse = await fetch(
                    `${BASE_URL}/${project.id}/groups/${userGroup.id}/notation`
                  )
                  const notation = await notationResponse.json()
                  return {
                    ...project,
                    noteFinale: notation?.notationFinalisee?.noteFinale
                  }
                }
                return project
              })
            )
            return {
              ...promo,
              projects: projectsWithNotes
            }
          })
        )
        
        setPromotions(promotionsWithNotes)
      } catch (error) {
        console.error("Erreur lors du chargement des notes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user?.id])

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </StudentLayout>
    )
  }

  return (
    <StudentLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold">Mes notes</h1>
        </div>

        {promotions.length === 0 ? (
          <p>Aucune note disponible</p>
        ) : (
          <div className="space-y-6">
            {promotions.map((promotion) => (
              <div key={promotion.id}>
                <h2 className="text-xl font-semibold mb-4">{promotion.name}</h2>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Projet</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Note finale</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {promotion.projects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell className="font-medium">{project.name}</TableCell>
                          <TableCell>{project.description}</TableCell>
                          <TableCell className="text-right">
                            {project.noteFinale ? `${project.noteFinale}/20` : 'Non noté'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  )
}