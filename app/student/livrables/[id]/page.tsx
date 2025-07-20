import { StudentLayout } from "@/components/layout/student-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Calendar, ClipboardList, FileText, Users } from "lucide-react"
import Link from "next/link"

export default function StudentProjetDetailPage({ params }: { params: { id: string } }) {
  // Simulation de données pour un projet
  const projet = {
    id: Number.parseInt(params.id),
    nom: "Projet Web Full Stack",
    description:
      "Développement d'une application web complète avec frontend et backend. Les étudiants devront concevoir et implémenter une application web fonctionnelle en utilisant les technologies modernes de développement web.",
    promotion: "Master 2 Informatique",
    dateDebut: "10/04/2023",
    dateFin: "15/06/2023",
    statut: "En cours",
    progression: 65,
    groupe: {
      id: 1,
      nom: "Groupe A",
      membres: [
        { id: 1, nom: "Martin Dupont (Vous)", email: "martin.dupont@example.com", role: "Chef de projet" },
        { id: 2, nom: "Marie Martin", email: "marie.martin@example.com", role: "Développeur Frontend" },
        { id: 3, nom: "Lucas Bernard", email: "lucas.bernard@example.com", role: "Développeur Backend" },
        { id: 4, nom: "Sophie Petit", email: "sophie.petit@example.com", role: "Designer UI/UX" },
      ],
    },
    livrables: [
      { id: 1, nom: "Maquettes et spécifications", deadline: "25/05/2023", statut: "Soumis" },
      { id: 2, nom: "Prototype fonctionnel", deadline: "01/06/2023", statut: "En cours" },
      { id: 3, nom: "Application finale", deadline: "15/06/2023", statut: "À venir" },
    ],
    rapports: [
      { id: 1, nom: "Rapport d'analyse", deadline: "20/05/2023", statut: "Soumis" },
      { id: 2, nom: "Rapport final", deadline: "10/06/2023", statut: "En cours" },
    ],
    soutenance: {
      date: "20/06/2023",
      heure: "14:30",
      lieu: "Amphithéâtre A",
      duree: "20 minutes",
    },
  }

  return (
    <StudentLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/student/projets">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{projet.nom}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{projet.promotion}</Badge>
                <Badge
                  variant={
                    projet.statut === "En cours" ? "default" : projet.statut === "Terminé" ? "secondary" : "outline"
                  }
                >
                  {projet.statut}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{projet.description}</p>

              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Progression globale</h3>
                  <div className="mt-2 flex items-center gap-4">
                    <Progress value={projet.progression} className="flex-1" />
                    <span className="text-sm font-medium">{projet.progression}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Date de début</h3>
                    <p className="mt-1">{projet.dateDebut}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Date de fin</h3>
                    <p className="mt-1">{projet.dateFin}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mon groupe</CardTitle>
              <CardDescription>
                {projet.groupe ? `${projet.groupe.nom} - ${projet.groupe.membres.length} membres` : "Non assigné"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {projet.groupe ? (
                <div className="space-y-4">
                  {projet.groupe.membres.map((membre) => (
                    <div key={membre.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">{membre.nom}</p>
                        <p className="text-xs text-gray-500">{membre.email}</p>
                      </div>
                      <Badge variant="outline">{membre.role}</Badge>
                    </div>
                  ))}
                  <Button className="w-full" asChild>
                    <Link href={`/student/groupes/${projet.groupe.id}`}>
                      <Users className="mr-2 h-4 w-4" />
                      Gérer mon groupe
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">Vous n'êtes pas encore assigné à un groupe pour ce projet.</p>
                  <Button asChild>
                    <Link href={`/student/projets/${projet.id}/rejoindre-groupe`}>Rejoindre un groupe</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="livrables" className="mt-8">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="livrables">Livrables</TabsTrigger>
            <TabsTrigger value="rapports">Rapports</TabsTrigger>
            <TabsTrigger value="soutenance">Soutenance</TabsTrigger>
          </TabsList>

          <TabsContent value="livrables" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Livrables</CardTitle>
                <CardDescription>Liste des livrables à soumettre pour ce projet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projet.livrables.map((livrable) => (
                    <div key={livrable.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{livrable.nom}</h3>
                          <p className="text-sm text-gray-500 mt-1">Date limite: {livrable.deadline}</p>
                        </div>
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
                      </div>
                      <div className="mt-4 flex justify-end">
                        {livrable.statut === "Soumis" ? (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/student/livrables/${livrable.id}`}>Voir détails</Link>
                          </Button>
                        ) : (
                          <Button size="sm" asChild>
                            <Link href={`/student/livrables/${livrable.id}/soumettre`}>
                              <ClipboardList className="mr-2 h-4 w-4" />
                              {livrable.statut === "En cours" ? "Continuer" : "Soumettre"}
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rapports" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Rapports</CardTitle>
                <CardDescription>Rapports à rédiger pour ce projet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projet.rapports.map((rapport) => (
                    <div key={rapport.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{rapport.nom}</h3>
                          <p className="text-sm text-gray-500 mt-1">Date limite: {rapport.deadline}</p>
                        </div>
                        <Badge
                          variant={
                            rapport.statut === "Soumis"
                              ? "secondary"
                              : rapport.statut === "En cours"
                                ? "default"
                                : "outline"
                          }
                        >
                          {rapport.statut}
                        </Badge>
                      </div>
                      <div className="mt-4 flex justify-end">
                        {rapport.statut === "Soumis" ? (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/student/rapports/${rapport.id}`}>Voir rapport</Link>
                          </Button>
                        ) : (
                          <Button size="sm" asChild>
                            <Link href={`/student/rapports/${rapport.id}/editer`}>
                              <FileText className="mr-2 h-4 w-4" />
                              {rapport.statut === "En cours" ? "Continuer" : "Rédiger"}
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="soutenance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Soutenance</CardTitle>
                <CardDescription>Informations sur la soutenance du projet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <Calendar size={16} />
                        <span className="text-sm">Date</span>
                      </div>
                      <p className="font-medium">{projet.soutenance.date}</p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <Calendar size={16} />
                        <span className="text-sm">Heure</span>
                      </div>
                      <p className="font-medium">{projet.soutenance.heure}</p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <Calendar size={16} />
                        <span className="text-sm">Lieu</span>
                      </div>
                      <p className="font-medium">{projet.soutenance.lieu}</p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <Calendar size={16} />
                        <span className="text-sm">Durée</span>
                      </div>
                      <p className="font-medium">{projet.soutenance.duree}</p>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
                    <h3 className="font-medium text-amber-800 mb-2">Rappel important</h3>
                    <p className="text-sm text-amber-700">
                      N'oubliez pas de préparer votre présentation et d'arriver au moins 15 minutes avant l'heure prévue
                      de votre soutenance.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StudentLayout>
  )
}
