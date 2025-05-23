import { StudentLayout } from "@/components/layout/student-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, ChevronDown, Eye, Filter, MoreHorizontal, Search, Upload } from "lucide-react"
import Link from "next/link"

export default function StudentLivrablesPage() {
  // Simulation de données pour les livrables
  const livrables = [
    {
      id: 1,
      nom: "Maquettes et spécifications",
      projet: "Projet Web Full Stack",
      groupe: "Groupe A",
      deadline: "25/05/2023",
      statut: "Soumis",
      note: "18/20",
    },
    {
      id: 2,
      nom: "Prototype fonctionnel",
      projet: "Projet Web Full Stack",
      groupe: "Groupe A",
      deadline: "01/06/2023",
      statut: "En cours",
      note: null,
    },
    {
      id: 3,
      nom: "Application finale",
      projet: "Projet Web Full Stack",
      groupe: "Groupe A",
      deadline: "15/06/2023",
      statut: "À venir",
      note: null,
    },
    {
      id: 4,
      nom: "Rapport d'analyse de sécurité",
      projet: "Sécurité des applications web",
      groupe: "Groupe C",
      deadline: "15/04/2023",
      statut: "Soumis",
      note: "16/20",
    },
  ]

  return (
    <StudentLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes livrables</h1>
            <p className="text-gray-600 mt-1">Gérez tous vos livrables de projets</p>
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
                    <DropdownMenuItem>Soumis</DropdownMenuItem>
                    <DropdownMenuItem>En cours</DropdownMenuItem>
                    <DropdownMenuItem>À venir</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Projet</TableHead>
                    <TableHead>Groupe</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {livrables.map((livrable) => (
                    <TableRow key={livrable.id}>
                      <TableCell className="font-medium">{livrable.nom}</TableCell>
                      <TableCell>{livrable.projet}</TableCell>
                      <TableCell>{livrable.groupe}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          <span>{livrable.deadline}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            livrable.statut === "Soumis"
                              ? "secondary"
                              : livrable.statut === "En cours"
                                ? "default"
                                : "outline"
                          }
                        >
                          {livrable.statut}
                        </Badge>
                      </TableCell>
                      <TableCell>{livrable.note || "-"}</TableCell>
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
                              <Link href={`/student/livrables/${livrable.id}`} className="flex items-center">
                                <Eye size={16} className="mr-2" />
                                Voir détails
                              </Link>
                            </DropdownMenuItem>
                            {(livrable.statut === "En cours" || livrable.statut === "À venir") && (
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/student/livrables/${livrable.id}/soumettre`}
                                  className="flex items-center"
                                >
                                  <Upload size={16} className="mr-2" />
                                  Soumettre
                                </Link>
                              </DropdownMenuItem>
                            )}
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
    </StudentLayout>
  )
}
