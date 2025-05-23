"use client"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BookOpen, ChevronDown, Download, Eye, Filter, MoreHorizontal, Plus, Search, Trash, Users } from "lucide-react"
import Link from "next/link"
import { fecthchGroupes } from "@/lib/services/groupe"
import { use, useEffect, useState } from "react"
import { Group } from "@/lib/types/groupe"

export default function GroupesPage() {
  const [groupes, setGroupes] = useState<Group[]>([])

  // Simulation de données pour les groupes
  const fecthGroupes = async () => {
    try {
      const groupes = await fecthchGroupes()
      
      setGroupes(groupes)
    } catch (error) {
      console.error("Error fetching groupes:", error)
      return []
    }
  }

  useEffect(() => {
    fecthGroupes()
  }, [])


  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Groupes</h1>
            <p className="text-gray-600 mt-1">Gérez tous les groupes d'étudiants</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild>
              <Link href="/groupes/create" className="flex items-center">
                <Plus className="mr-2 h-4 w-4"  />
                Nouveau groupe
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Liste des groupes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input placeholder="Rechercher un groupe..." className="pl-10" />
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter size={16} />
                      <span>Projet</span>
                      <ChevronDown size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Tous les projets</DropdownMenuItem>
                    <DropdownMenuItem>Projet Web Full Stack</DropdownMenuItem>
                    <DropdownMenuItem>Application Mobile</DropdownMenuItem>
                    <DropdownMenuItem>Intelligence Artificielle</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter size={16} />
                      <span>Promotion</span>
                      <ChevronDown size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Toutes les promotions</DropdownMenuItem>
                    <DropdownMenuItem>Master 2 Informatique</DropdownMenuItem>
                    <DropdownMenuItem>Licence 3 Informatique</DropdownMenuItem>
                    <DropdownMenuItem>Master 1 IA</DropdownMenuItem>
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
                    <TableHead>Projet</TableHead>
                    <TableHead>Promotion</TableHead>
                    <TableHead>Membres</TableHead>
                    {/* <TableHead>Livrables soumis</TableHead> */}
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupes.map((groupe) => (
                    <TableRow key={groupe.id}>
                      <TableCell className="font-medium">{groupe.name}</TableCell>
                      <TableCell>{groupe.project?.name}</TableCell>
                      <TableCell>{groupe.project?.promotion?.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users size={16} />
                          <span>{groupe.Students.length}</span>
                        </div>
                      </TableCell>
                      {/* <TableCell>
                        <div className="flex items-center gap-1">
                          <BookOpen size={16} />
                          <span>{groupe.livrables}</span>
                        </div>
                      </TableCell> */}
                      <TableCell>
                        <Badge variant={groupe.status === "Complet" ? "secondary" : "destructive"}>
                          {groupe.status}
                        </Badge>
                      </TableCell>
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
                              <Link href={`/groupes/${groupe.id}`} className="flex items-center">
                                <Eye size={16} className="mr-2" />
                                Voir détails
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/groupes/${groupe.id}/edit`} className="flex items-center">
                                <Users size={16} className="mr-2" />
                                Modifier membres
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
