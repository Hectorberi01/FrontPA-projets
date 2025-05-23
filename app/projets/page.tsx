"use client"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, Download, Eye, Filter, MoreHorizontal, Plus, Search, Trash, Users } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getPromotions } from "@/lib/services/promotionService"
import { PromotionWithDetails } from "@/lib/types/promotion"
import {fetchProjects} from "@/lib/services/project";

export default function ProjetsPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("Tous les projets")
  const [sortBy, setSortBy] = useState("Nom")
  const [sortOrder, setSortOrder] = useState("asc")
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [selectedPromotion, setSelectedPromotion] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [projects, setProjets] = useState()
  const [promotions, setPromotions] = useState<PromotionWithDetails[]>([])
  
  const fetchPromotions = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getPromotions()
      const project = await fetchProjects()
      console.log("project:", project)
      setPromotions(response)
    } catch (error) {
      setError(error as string)
      console.error("Error fetching promotions:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPromotions()
  }, [])

  // Simulation de données pour les projets
  const projets = [
    {
      id: 1,
      nom: "Projet Web Full Stack",
      promotion: "Master 2 Informatique",
      dateCreation: "10/04/2023",
      dateFin: "15/06/2023",
      statut: "En cours",
      groupes: 5,
    },
    {
      id: 2,
      nom: "Application Mobile",
      promotion: "Licence 3 Informatique",
      dateCreation: "15/04/2023",
      dateFin: "30/06/2023",
      statut: "En cours",
      groupes: 7,
    },
    {
      id: 3,
      nom: "Intelligence Artificielle",
      promotion: "Master 1 IA",
      dateCreation: "20/04/2023",
      dateFin: "10/07/2023",
      statut: "À venir",
      groupes: 4,
    },
    {
      id: 4,
      nom: "Sécurité Informatique",
      promotion: "Master 2 Cybersécurité",
      dateCreation: "05/03/2023",
      dateFin: "20/05/2023",
      statut: "Terminé",
      groupes: 6,
    },
    {
      id: 5,
      nom: "Développement Jeux Vidéo",
      promotion: "Licence Pro Jeux Vidéo",
      dateCreation: "01/04/2023",
      dateFin: "25/06/2023",
      statut: "En cours",
      groupes: 8,
    },
  ]

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projets</h1>
            <p className="text-gray-600 mt-1">Gérez tous vos projets</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild>
              <Link href="/projets/nouveau">
                <Plus className="mr-2 h-4 w-4" />
                Nouveau projet
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Liste des projets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input placeholder="Rechercher un projet..." className="pl-10" />
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter size={16} />
                      <span>Filtrer</span>
                      <ChevronDown size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Tous les projets</DropdownMenuItem>
                    <DropdownMenuItem>En cours</DropdownMenuItem>
                    <DropdownMenuItem>À venir</DropdownMenuItem>
                    <DropdownMenuItem>Terminés</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline">
                  <Download size={16} className="mr-2" />
                  Exporter
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Min Etudient</TableHead>
                    <TableHead>Max Etudient</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date de soutenance</TableHead>

                    {/* <TableHead>Date de fin</TableHead> */}
                    <TableHead>Statut</TableHead>
                    {/* <TableHead>Groupes</TableHead> */}
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promotions.map((promotion) => (
                    promotion.Projects?.map((projet) => (
                      <TableRow key={projet.id}>
                        <TableCell className="font-medium">{projet.name}</TableCell>
                        <TableCell>{promotion.name}</TableCell>
                        <TableCell>{projet.description}</TableCell>
                        {/* <TableCell>{projet.description}</TableCell> */}
                        <TableCell>
                          <Badge
                            variant={
                              projet.status === "En cours"
                                ? "default"
                                : projet.status === "Terminé"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {projet.status}
                          </Badge>
                        </TableCell>
                        {/* <TableCell>
                          <div className="flex items-center gap-1">
                            <Users size={16} />
                            <span>{projet.groupes}</span>
                          </div>
                        </TableCell> */}
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal size={16} />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/projets/${projet.id}`} className="flex items-center">
                                  <Eye size={16} className="mr-2" />
                                  Voir détails
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/projets/${projet.id}/groupes`} className="flex items-center">
                                  <Users size={16} className="mr-2" />
                                  Gérer les groupes
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600 flex items-center">
                                <Trash size={16} className="mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
