import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Edit, Mail, Plus } from "lucide-react"
import Link from "next/link"

export default function GroupeDetailPage({ params }: { params: { id: string } }) {
  // Simulation de données pour un groupe
  const groupe = {
    id: Number.parseInt(params.id),
    nom: "Groupe A",
    projet: {
      id: 1,
      nom: "Projet Web Full Stack",
      description: "Développement d'une application web complète avec frontend et backend",
    },
    promotion: "Master 2 Informatique",
    statut: "Complet",
    progression: 75,
    membres: [
      { id: 1, nom: "Jean Dupont", email: "jean.dupont@example.com", role: "Chef de projet" },
      { id: 2, nom: "Marie Martin", email: "marie.martin@example.com", role: "Développeur Frontend" },
      { id: 3, nom: "Lucas Bernard", email: "lucas.bernard@example.com", role: "Développeur Backend" },
      { id: 4, nom: "Sophie Petit", email: "sophie.petit@example.com", role: "Designer UI/UX" },
    ],
    livrables: [
      { id: 1, nom: "Maquettes et spécifications", date: "25/05/2023", statut: "Soumis", note: "18/20" },
      { id: 2, nom: "Prototype fonctionnel", date: "01/06/2023", statut: "Soumis", note: "16/20" },
      { id: 3, nom: "Application finale", date: "15/06/2023", statut: "En attente", note: "-" },
    ],
    rapports: [
      { id: 1, nom: "Rapport d'analyse", date: "20/05/2023", statut: "Soumis", note: "17/20" },
      { id: 2, nom: "Rapport final", date: "10/06/2023", statut: "En cours", note: "-" },
    ],
    soutenance: {
      date: "20/06/2023",
      heure: "14:30",
      lieu: "Amphithéâtre A",
      duree: "20 minutes",
    },
    notes: [
      { id: 1, nom: "Maquettes et spécifications", note: "18/20", coefficient: 1 },
      { id: 2, nom: "Prototype fonctionnel", note: "16/20", coefficient: 1.5 },
      { id: 3, nom: "Rapport d'analyse", note: "17/20", coefficient: 1 },
      { id: 4, nom: "Soutenance", note: "-", coefficient: 2 },
      { id: 5, nom: "Rapport final", note: "-", coefficient: 1.5 },
      { id: 6, nom: "Application finale", note: "-", coefficient: 3 },
    ],
  }

  // Calcul de la note moyenne (uniquement pour les notes disponibles)
  const notesDisponibles = groupe.notes.filter((note) => note.note !== "-")
  const sommeCoefficients = notesDisponibles.reduce((acc, note) => acc + note.coefficient, 0)
  const sommeNotes = notesDisponibles.reduce((acc, note) => {
    const valeurNote = Number.parseFloat(note.note.split("/")[0])
    return acc + valeurNote * note.coefficient
  }, 0)
  const moyenneActuelle = sommeCoefficients > 0 ? (sommeNotes / sommeCoefficients).toFixed(2) : "-"

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/groupes">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{groupe.nom}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{groupe.projet.nom}</Badge>
                <Badge variant="outline">{groupe.promotion}</Badge>
                <Badge variant={groupe.statut === "Complet" ? "secondary" : "destructive"}>{groupe.statut}</Badge>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild>
              <Link href={`/groupes/${groupe.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Informations du groupe</CardTitle>
              <CardDescription>Détails du projet et progression</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Projet</h3>
                  <p className="mt-1 font-medium">{groupe.projet.nom}</p>
                  <p className="text-sm text-gray-600 mt-1">{groupe.projet.description}</p>
                </div>

                <div className="pt-4">
                  <h3 className="text-sm font-medium text-gray-500">Progression globale</h3>
                  <div className="mt-2 flex items-center gap-4">
                    <Progress value={groupe.progression} className="flex-1" />
                    <span className="text-sm font-medium">{groupe.progression}%</span>
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="text-sm font-medium text-gray-500">Soutenance</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    <div className="border rounded-lg p-3">
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="font-medium">{groupe.soutenance.date}</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <p className="text-xs text-gray-500">Heure</p>
                      <p className="font-medium">{groupe.soutenance.heure}</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <p className="text-xs text-gray-500">Lieu</p>
                      <p className="font-medium">{groupe.soutenance.lieu}</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <p className="text-xs text-gray-500">Durée</p>
                      <p className="font-medium">{groupe.soutenance.duree}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Évaluation</CardTitle>
              <CardDescription>Notes et moyenne actuelle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold">{moyenneActuelle}/20</div>
                <p className="text-sm text-gray-500 mt-1">Moyenne actuelle</p>
              </div>

              <div className="space-y-3">
                {groupe.notes.map((note) => (
                  <div key={note.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{note.nom}</p>
                      <p className="text-xs text-gray-500">Coefficient {note.coefficient}</p>
                    </div>
                    <Badge variant={note.note !== "-" ? "secondary" : "outline"}>{note.note}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="membres" className="mt-8">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="membres">Membres</TabsTrigger>
            <TabsTrigger value="livrables">Livrables</TabsTrigger>
            <TabsTrigger value="rapports">Rapports</TabsTrigger>
          </TabsList>

          <TabsContent value="membres" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Membres du groupe</CardTitle>
                  <CardDescription>Liste des étudiants du groupe</CardDescription>
                </div>
                <Button asChild>
                  <Link href={`/groupes/${groupe.id}/membres/ajouter`}>
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un membre
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {groupe.membres.map((membre) => (
                    <div key={membre.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={membre.nom} />
                          <AvatarFallback>
                            {membre.nom
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{membre.nom}</h3>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Mail size={14} />
                            <span>{membre.email}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{membre.role}</Badge>
                        <Button variant="ghost" size="sm">
                          Voir profil
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="livrables" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Livrables</CardTitle>
                <CardDescription>Suivi des livrables du groupe</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {groupe.livrables.map((livrable) => (
                    <div key={livrable.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{livrable.nom}</h3>
                          <p className="text-sm text-gray-500 mt-1">Date limite: {livrable.date}</p>
                        </div>
                        <div className="flex items-center gap-2">
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
                          {livrable.note !== "-" && <Badge variant="outline">{livrable.note}</Badge>}
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/livrables/${livrable.id}`}>Voir détails</Link>
                        </Button>
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
                <CardDescription>Suivi des rapports du groupe</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {groupe.rapports.map((rapport) => (
                    <div key={rapport.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{rapport.nom}</h3>
                          <p className="text-sm text-gray-500 mt-1">Date limite: {rapport.date}</p>
                        </div>
                        <div className="flex items-center gap-2">
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
                          {rapport.note !== "-" && <Badge variant="outline">{rapport.note}</Badge>}
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end gap-2">
                        {rapport.statut === "En cours" && (
                          <Button size="sm" asChild>
                            <Link href={`/rapports/${rapport.id}/editer`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Éditer
                            </Link>
                          </Button>
                        )}
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/rapports/${rapport.id}`}>Voir détails</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
