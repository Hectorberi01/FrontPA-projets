import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BookOpen, ChevronDown, Download, Eye, Filter, MoreHorizontal, Pencil, Search, Users } from "lucide-react"
import Link from "next/link"

export default function NotationsPage() {
  // Simulation de données pour les grilles de notation
  const grilles = [
    {
      id: 1,
      nom: "Évaluation des maquettes",
      projet: "Projet Web Full Stack",
      promotion: "Master 2 Informatique",
      type: "Livrable",
      statut: "Complété",
      groupes: 5,
    },
    {
      id: 2,
      nom: "Évaluation du prototype",
      projet: "Projet Web Full Stack",
      promotion: "Master 2 Informatique",
      type: "Livrable",
      statut: "En cours",
      groupes: 5,
    },
    {
      id: 3,
      nom: "Rapport d'analyse",
      projet: "Projet Web Full Stack",
      promotion: "Master 2 Informatique",
      type: "Rapport",
      statut: "Complété",
      groupes: 5,
    },
    {
      id: 4,
      nom: "Prototype mobile",
      projet: "Application Mobile",
      promotion: "Licence 3 Informatique",
      type: "Livrable",
      statut: "En cours",
      groupes: 7,
    },
    {
      id: 5,
      nom: "Soutenance finale",
      projet: "Intelligence Artificielle",
      promotion: "Master 1 IA",
      type: "Soutenance",
      statut: "À venir",
      groupes: 4,
    },
  ]

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notations</h1>
            <p className="text-gray-600 mt-1">Gérez toutes les grilles de notation</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild>
              <Link href="/notations/nouvelle">Nouvelle grille</Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Grilles de notation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input placeholder="Rechercher une grille..." className="pl-10" />
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
                    <DropdownMenuItem>Toutes les grilles</DropdownMenuItem>
                    <DropdownMenuItem>Livrables</DropdownMenuItem>
                    <DropdownMenuItem>Rapports</DropdownMenuItem>
                    <DropdownMenuItem>Soutenances</DropdownMenuItem>
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
                    <TableHead>Type</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Groupes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grilles.map((grille) => (
                    <TableRow key={grille.id}>
                      <TableCell className="font-medium">{grille.nom}</TableCell>
                      <TableCell>{grille.projet}</TableCell>
                      <TableCell>{grille.promotion}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{grille.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            grille.statut === "Complété"
                              ? "secondary"
                              : grille.statut === "En cours"
                                ? "default"
                                : "outline"
                          }
                        >
                          {grille.statut}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users size={16} />
                          <span>{grille.groupes}</span>
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
                              <Link href={`/notations/${grille.id}`} className="flex items-center">
                                <Eye size={16} className="mr-2" />
                                Voir détails
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/notations/${grille.id}/edit`} className="flex items-center">
                                <Pencil size={16} className="mr-2" />
                                Modifier
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/notations/${grille.id}/evaluer`} className="flex items-center">
                                <BookOpen size={16} className="mr-2" />
                                Évaluer
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
