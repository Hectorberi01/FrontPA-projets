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
import {DeleteProject, fetchProjects} from "@/lib/services/project";
import {Project} from "@/lib/types/projet";

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
  const [projects, setProjets] = useState<Project[]>([])
  const [promotions, setPromotions] = useState<PromotionWithDetails[]>([])
  
  const fetchPromotions = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getPromotions()
      const project = await fetchProjects()
      setProjets(project)
      console.log("project:", project)
      setPromotions(response)
    } catch (error) {
      setError(error as string)
      console.error("Error fetching promotions:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async (id: number) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?");

    if (!confirmDelete) return;

    try {
      const result = await DeleteProject(id);

      if (result.success) {
        alert("Projet supprimé avec succès !");
        window.location.reload();
      } else {
        alert("Une erreur est survenue lors de la suppression.");
      }

    } catch (error) {
      console.error("Erreur suppression projet :", error);
      alert("Une erreur est survenue lors de la suppression.");
    }
  }

  useEffect(() => {
    fetchPromotions()
  }, [])

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
                {/*<Button variant="outline">*/}
                {/*  <Download size={16} className="mr-2" />*/}
                {/*  Exporter*/}
                {/*</Button>*/}
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
                    {/*<TableHead>Statut</TableHead>*/}
                    {/* <TableHead>Groupes</TableHead> */}
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/*{promotions.map((promotion) => (*/}
                  {projects.map((projet) => (
                      <TableRow key={projet.id}>
                        <TableCell className="font-medium">{projet.name}</TableCell>
                        {/*<TableCell>{projet.name}</TableCell>*/}
                        <TableCell>{projet.description}</TableCell>
                        <TableCell>{projet.mode}</TableCell>
                        <TableCell>{projet.minStudents}</TableCell>
                        <TableCell>{projet.maxStudents}</TableCell>
                        {/* <TableCell>{projet.description}</TableCell> */}
                        <TableCell>
                          <Badge
                            variant={
                              projet.status === "draft"
                                ? "default"
                                : projet.status === "visible"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {projet.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {projet.soutenanceDate
                              ? new Date(projet.soutenanceDate).toLocaleDateString("fr-FR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                              : "Non prévue"}
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
                              {/*<DropdownMenuItem asChild>*/}
                              {/*  <Link href={`/projets/${projet.id}/groupes`} className="flex items-center">*/}
                              {/*    <Users size={16} className="mr-2" />*/}
                              {/*    Gérer les groupes*/}
                              {/*  </Link>*/}
                              {/*</DropdownMenuItem>*/}
                              <DropdownMenuItem className="text-red-600 flex items-center"
                                 onClick={() => deleteProject(projet.id)}
                              >
                                <Trash size={16} className="mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                  ))}
                  {/*))}*/}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
