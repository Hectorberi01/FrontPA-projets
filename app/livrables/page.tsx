import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BookOpen, Calendar, ChevronDown, Download, Eye, Filter, MoreHorizontal, Search, Users } from "lucide-react"
import Link from "next/link"

export default function LivrablesPage() {
  // Simulation de données pour les livrables
  const livrables = [
    {
      id: 1,
      nom: "Maquettes et spécifications",
      projet: "Projet Web Full Stack",
      promotion: "Master 2 Informatique",
      deadline: "25/05/2023",
      statut: "Terminé",
      soumissions: 5,
    },
    {
      id: 2,
      nom: "Prototype fonctionnel",
      projet: "Projet Web Full Stack",
      promotion: "Master 2 Informatique",
      deadline: "01/06/2023",
      statut: "En cours",
      soumissions: 3,
    },
    {
      id: 3,
      nom: "Application finale",
      projet: "Projet Web Full Stack",
      promotion: "Master 2 Informatique",
      deadline: "15/06/2023",
      statut: "À venir",
      soumissions: 0,
    },
    {
      id: 4,
      nom: "Prototype mobile",
      projet: "Application Mobile",
      promotion: "Licence 3 Informatique",
      deadline: "28/05/2023",
      statut: "En cours",
      soumissions: 4,
    },
    {
      id: 5,
      nom: "Rapport préliminaire",
      projet: "Intelligence Artificielle",
      promotion: "Master 1 IA",
      deadline: "05/06/2023",
      statut: "À venir",
      soumissions: 0,
    },
  ]

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Livrables</h1>
            <p className="text-gray-600 mt-1">Gérez tous les livrables des projets</p>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Liste des livrables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input placeholder="Rechercher un livrable..." className="pl-10" />
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
                    <DropdownMenuItem>Tous les livrables</DropdownMenuItem>
                    <DropdownMenuItem>Terminés</DropdownMenuItem>
                    <DropdownMenuItem>En cours</DropdownMenuItem>
                    <DropdownMenuItem>À venir</DropdownMenuItem>
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
                    <TableHead>Deadline</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Soumissions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {livrables.map((livrable) => (
                    <TableRow key={livrable.id}>
                      <TableCell className="font-medium">{livrable.nom}</TableCell>
                      <TableCell>{livrable.projet}</TableCell>
                      <TableCell>{livrable.promotion}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          <span>{livrable.deadline}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            livrable.statut === "Terminé"
                              ? "secondary"
                              : livrable.statut === "En cours"
                                ? "default"
                                : "outline"
                          }
                        >
                          {livrable.statut}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users size={16} />
                          <span>{livrable.soumissions}</span>
                        </div>
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
                              <Link href={`/livrables/${livrable.id}`} className="flex items-center">
                                <Eye size={16} className="mr-2" />
                                Voir détails
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/livrables/${livrable.id}/soumissions`} className="flex items-center">
                                <BookOpen size={16} className="mr-2" />
                                Voir soumissions
                              </Link>
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
