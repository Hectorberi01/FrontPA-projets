import { StudentLayout } from "@/components/layout/student-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Eye } from "lucide-react"
import Link from "next/link"

export default function StudentProjetsPage() {
  // Simulation de données pour les projets de l'étudiant
  const projets = [
    {
      id: 1,
      nom: "Projet Web Full Stack",
      description: "Développement d'une application web complète avec frontend et backend",
      promotion: "Master 2 Informatique",
      dateDebut: "10/04/2023",
      dateFin: "15/06/2023",
      statut: "En cours",
      groupe: "Groupe A",
    },
    {
      id: 2,
      nom: "Application Mobile",
      description: "Création d'une application mobile cross-platform avec Flutter",
      promotion: "Master 2 Informatique",
      dateDebut: "01/09/2023",
      dateFin: "15/12/2023",
      statut: "À venir",
      groupe: null,
    },
    {
      id: 3,
      nom: "Sécurité des applications web",
      description: "Analyse et implémentation de mesures de sécurité pour applications web",
      promotion: "Master 2 Informatique",
      dateDebut: "01/02/2023",
      dateFin: "30/04/2023",
      statut: "Terminé",
      groupe: "Groupe C",
    },
  ]

  return (
    <StudentLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes projets</h1>
            <p className="text-gray-600 mt-1">Consultez tous vos projets en cours et à venir</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input placeholder="Rechercher un projet..." className="pl-10" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projets.map((projet) => (
            <Card key={projet.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{projet.nom}</CardTitle>
                    <CardDescription className="mt-1">{projet.promotion}</CardDescription>
                  </div>
                  <Badge
                    variant={
                      projet.statut === "En cours" ? "default" : projet.statut === "Terminé" ? "secondary" : "outline"
                    }
                  >
                    {projet.statut}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{projet.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Date de début:</span>
                    <span className="font-medium">{projet.dateDebut}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Date de fin:</span>
                    <span className="font-medium">{projet.dateFin}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Groupe:</span>
                    <span className="font-medium">{projet.groupe || "Non assigné"}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  {projet.groupe ? (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/student/groupes/${projet.groupe}`}>Voir mon groupe</Link>
                    </Button>
                  ) : (
                    projet.statut !== "Terminé" && (
                      <Button size="sm" asChild>
                        <Link href={`/student/projets/${projet.id}/rejoindre-groupe`}>Rejoindre un groupe</Link>
                      </Button>
                    )
                  )}
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/student/projets/${projet.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Détails
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </StudentLayout>
  )
}
