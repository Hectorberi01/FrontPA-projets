import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Calendar,
  ChevronDown,
  Clock,
  Download,
  Eye,
  Filter,
  MapPin,
  MoreHorizontal,
  Printer,
  Search,
  Users,
} from "lucide-react"
import Link from "next/link"

export default function SoutenancesPage() {
  // Simulation de données pour les soutenances
  const soutenances = [
    {
      id: 1,
      projet: "Projet Web Full Stack",
      promotion: "Master 2 Informatique",
      date: "20/06/2023",
      lieu: "Amphithéâtre A",
      duree: "20 minutes",
      groupes: 5,
      statut: "À venir",
    },
    {
      id: 2,
      projet: "Application Mobile",
      promotion: "Licence 3 Informatique",
      date: "22/06/2023",
      lieu: "Salle B204",
      duree: "15 minutes",
      groupes: 7,
      statut: "À venir",
    },
    {
      id: 3,
      projet: "Intelligence Artificielle",
      promotion: "Master 1 IA",
      date: "25/06/2023",
      lieu: "Amphithéâtre B",
      duree: "25 minutes",
      groupes: 4,
      statut: "À venir",
    },
    {
      id: 4,
      projet: "Sécurité Informatique",
      promotion: "Master 2 Cybersécurité",
      date: "15/05/2023",
      lieu: "Salle C103",
      duree: "20 minutes",
      groupes: 6,
      statut: "Terminé",
    },
    {
      id: 5,
      projet: "Développement Jeux Vidéo",
      promotion: "Licence Pro Jeux Vidéo",
      date: "28/06/2023",
      lieu: "Salle D001",
      duree: "30 minutes",
      groupes: 8,
      statut: "À venir",
    },
  ]

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Soutenances</h1>
            <p className="text-gray-600 mt-1">Gérez les soutenances de tous les projets</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild>
              <Link href="/soutenances/nouvelle">Nouvelle soutenance</Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Liste des soutenances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input placeholder="Rechercher une soutenance..." className="pl-10" />
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
                    <DropdownMenuItem>Toutes les soutenances</DropdownMenuItem>
                    <DropdownMenuItem>À venir</DropdownMenuItem>
                    <DropdownMenuItem>Terminées</DropdownMenuItem>
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
                    <TableHead>Projet</TableHead>
                    <TableHead>Promotion</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Lieu</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Groupes</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {soutenances.map((soutenance) => (
                    <TableRow key={soutenance.id}>
                      <TableCell className="font-medium">{soutenance.projet}</TableCell>
                      <TableCell>{soutenance.promotion}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          <span>{soutenance.date}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          <span>{soutenance.lieu}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>{soutenance.duree}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users size={16} />
                          <span>{soutenance.groupes}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={soutenance.statut === "Terminé" ? "secondary" : "outline"}>
                          {soutenance.statut}
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
                              <Link href={`/soutenances/${soutenance.id}`} className="flex items-center">
                                <Eye size={16} className="mr-2" />
                                Voir planning
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/soutenances/${soutenance.id}/edit`} className="flex items-center">
                                <Calendar size={16} className="mr-2" />
                                Modifier
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/soutenances/${soutenance.id}/emargement`} className="flex items-center">
                                <Printer size={16} className="mr-2" />
                                Feuille d'émargement
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
