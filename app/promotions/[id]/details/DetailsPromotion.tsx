"use client"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,BarChart,BookOpen,Calendar,Download,Edit,FileText,Mail,MoreHorizontal,Plus,Search,Trash,Upload,User,Users,} from "lucide-react"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { use, useEffect, useState } from "react"
import { getPromotionById } from "@/lib/services/promotionService"
import { PromotionWithDetails } from "@/lib/types/promotion"
import { set } from "date-fns"

interface PromotionDetailsPageProps {
    promotionId: string;
  }

export default function PromotionDetailsPage({ promotionId }: PromotionDetailsPageProps) {

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [promo, setPromotion] = useState<PromotionWithDetails>()
  const fetchPromotions = async () => {
    setLoading(true)
    try {
      const id = Number.parseInt(promotionId)
      const response = await getPromotionById(id)
      console.log("Promotion data:", response)
      if (response) {
        setPromotion(response)
      } else {
        throw new Error("Erreur lors de la récupération des données")
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPromotions()
  }, [])

  // Simuler une erreur pour le test
  // Simulation de données pour une promotion
  const promotion = {
    id: Number.parseInt(promotionId),
    nom: "Master 2 Informatique",
    annee: "2022-2023",
    description:
      "Formation de niveau Master 2 en informatique, spécialisation en développement logiciel et intelligence artificielle.",
    dateCreation: "01/09/2022",
    dateFin: "30/06/2023",
    responsable: {
      id: 1,
      nom: "Prof. Dupont",
      email: "prof.dupont@example.com",
    },
    statistiques: {
      nombreEtudiants: 45,
      nombreProjets: 3,
      nombreGroupes: 15,
      tauxReussite: 92,
      moyenneGenerale: 14.5,
      repartitionNotes: [
        { intervalle: "16-20", pourcentage: 25 },
        { intervalle: "14-16", pourcentage: 35 },
        { intervalle: "12-14", pourcentage: 30 },
        { intervalle: "10-12", pourcentage: 8 },
        { intervalle: "< 10", pourcentage: 2 },
      ],
    },
    etudiants: [
      {
        id: 1,
        nom: "Jean Dupont",
        email: "jean.dupont@example.com",
        groupe: "Groupe A",
        projet: "Projet Web Full Stack",
        moyenne: 16.5,
      },
      {
        id: 2,
        nom: "Marie Martin",
        email: "marie.martin@example.com",
        groupe: "Groupe A",
        projet: "Projet Web Full Stack",
        moyenne: 17.2,
      },
      {
        id: 3,
        nom: "Lucas Bernard",
        email: "lucas.bernard@example.com",
        groupe: "Groupe B",
        projet: "Projet Web Full Stack",
        moyenne: 15.8,
      },
      {
        id: 4,
        nom: "Sophie Petit",
        email: "sophie.petit@example.com",
        groupe: "Groupe B",
        projet: "Projet Web Full Stack",
        moyenne: 14.9,
      },
      {
        id: 5,
        nom: "Thomas Leroy",
        email: "thomas.leroy@example.com",
        groupe: "Groupe C",
        projet: "Application Mobile",
        moyenne: 13.5,
      },
      {
        id: 6,
        nom: "Emma Moreau",
        email: "emma.moreau@example.com",
        groupe: "Groupe C",
        projet: "Application Mobile",
        moyenne: 15.2,
      },
      {
        id: 7,
        nom: "Hugo Dubois",
        email: "hugo.dubois@example.com",
        groupe: "Groupe D",
        projet: "Application Mobile",
        moyenne: 12.8,
      },
      {
        id: 8,
        nom: "Léa Richard",
        email: "lea.richard@example.com",
        groupe: "Groupe D",
        projet: "Application Mobile",
        moyenne: 14.3,
      },
      {
        id: 9,
        nom: "Nathan Simon",
        email: "nathan.simon@example.com",
        groupe: "Groupe E",
        projet: "Intelligence Artificielle",
        moyenne: 18.1,
      },
      {
        id: 10,
        nom: "Camille Roux",
        email: "camille.roux@example.com",
        groupe: "Groupe E",
        projet: "Intelligence Artificielle",
        moyenne: 16.7,
      },
    ],
    projets: [
      {
        id: 1,
        nom: "Projet Web Full Stack",
        description: "Développement d'une application web complète avec frontend et backend",
        dateDebut: "10/10/2022",
        dateFin: "15/01/2023",
        nombreGroupes: 6,
        progression: 100,
        statut: "Terminé",
      },
      {
        id: 2,
        nom: "Application Mobile",
        description: "Création d'une application mobile cross-platform",
        dateDebut: "01/02/2023",
        dateFin: "15/04/2023",
        nombreGroupes: 5,
        progression: 85,
        statut: "En cours",
      },
      {
        id: 3,
        nom: "Intelligence Artificielle",
        description: "Implémentation d'algorithmes d'IA pour la reconnaissance d'images",
        dateDebut: "01/05/2023",
        dateFin: "30/06/2023",
        nombreGroupes: 4,
        progression: 40,
        statut: "En cours",
      },
    ],
    enseignants: [
      {
        id: 1,
        nom: "Prof. Dupont",
        email: "prof.dupont@example.com",
        role: "Responsable de promotion",
        matieres: ["Développement Web", "Architecture Logicielle"],
      },
      {
        id: 2,
        nom: "Dr. Martin",
        email: "dr.martin@example.com",
        role: "Enseignant",
        matieres: ["Intelligence Artificielle", "Machine Learning"],
      },
      {
        id: 3,
        nom: "Mme. Leroy",
        email: "mme.leroy@example.com",
        role: "Enseignant",
        matieres: ["Développement Mobile", "UX/UI Design"],
      },
      {
        id: 4,
        nom: "M. Bernard",
        email: "m.bernard@example.com",
        role: "Intervenant externe",
        matieres: ["Sécurité Informatique"],
      },
    ],
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/promotions">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{promo?.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                {promo && (
                  <Badge variant="outline">
                    {new Date(promo.startYear).getFullYear()} - {new Date(promo.endYear).getFullYear()}
                  </Badge>
                )}
                {/* <Badge variant="outline">{new Date(promo.startYear).getFullYear()}-{new Date(promo.endYear).getFullYear()}</Badge> */}
                <Badge variant="secondary">{promo?.Students.length} étudiants</Badge>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            {promo && (
              <Button variant="outline" asChild>
                <Link href={`/promotions/${promo.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Link>
              </Button>
            )}
            {/* <Button variant="outline" asChild>
              <Link href={`/promotions/${promo.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </Link>
            </Button> */}
            <Button variant="destructive">
              <Trash className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
              <CardDescription>Détails de la promotion</CardDescription>
            </CardHeader>
            <CardContent>
              {/* <p className="text-gray-700 mb-6">{promo.description}</p> */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date de création</h3>
                  {promo &&( <p className="mt-1">{new Date(promo.createdAt).toLocaleDateString("fr-FR")}</p>)}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date de fin</h3>
                  {promo &&( 
                    <p className="mt-1">{new Date(promo.endYear).toLocaleDateString("fr-FR")}</p>)
                  }
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Responsable</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/placeholder.svg?height=24&width=24" alt={"HECTOR"} />
                      <AvatarFallback>
                        {/* {promotion.responsable.nom
                          .split(" ")
                          .map((n) => n[0])
                          .join("")} */}
                      </AvatarFallback>
                    </Avatar>
                    {/* <span>{promotion.responsable.nom}</span> */}
                    <span>hector ADJAKPA</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email du responsable</h3>
                  <p className="mt-1">hector.adjakpa@gmail.com</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
              <CardDescription>Aperçu de la promotion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-gray-500" />
                    <span>Étudiants</span>
                  </div>
                  <span className="font-medium">{promo?.nombreEtudiants}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-gray-500" />
                    <span>Projets</span>
                  </div>
                  <span className="font-medium">{promo?.Projects.length}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-gray-500" />
                    <span>Groupes</span>
                  </div>
                  <span className="font-medium">15</span>
                </div>
                {/* <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-gray-500" />
                    <span>Taux de réussite</span>
                  </div>
                  <span className="font-medium">{promotion.statistiques.tauxReussite}%</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-gray-500" />
                    <span>Moyenne générale</span>
                  </div>
                  <span className="font-medium">{promotion.statistiques.moyenneGenerale}/20</span>
                </div> */}
              </div>

              {/* <div className="mt-6">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/promotions/${promotion.id}/statistiques`}>
                    <BarChart className="mr-2 h-4 w-4" />
                    Voir statistiques détaillées
                  </Link>
                </Button>
              </div> */}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="etudiants" className="mt-8">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="etudiants">Étudiants</TabsTrigger>
            <TabsTrigger value="projets">Projets</TabsTrigger>
          </TabsList>

          <TabsContent value="etudiants" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Liste des étudiants</CardTitle>
                  <CardDescription>
                    {promo?.Students.length} étudiants inscrits dans cette promotion
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" asChild>
                    {
                      promo && (
                        <Link href={`/promotions/${promo.id}/etudiants/importer`}>
                          <Upload className="mr-2 h-4 w-4" />
                          Importer
                        </Link>
                      )
                    }
                  </Button>
                  <Button asChild>
                    <Link href={`/promotions/${promotion.id}/etudiants/ajouter`}>
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter un étudiant
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input placeholder="Rechercher un étudiant..." className="pl-10" />
                  </div>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Exporter
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Prenom</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Groupe</TableHead>
                        {/* <TableHead>Projet</TableHead> */}
                        {/* <TableHead>Moyenne</TableHead> */}
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {promo?.Students.map((etudiant) => (
                        <TableRow key={etudiant.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder.svg?height=32&width=32" alt={etudiant.nom} />
                                <AvatarFallback>
                                  {etudiant.nom
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{etudiant.nom}</span>
                            </div>
                          </TableCell>
                          <TableCell>{etudiant.prenom}</TableCell>
                          <TableCell>{etudiant.email}</TableCell>
                          {/* <TableCell>{etudiant.groupe}</TableCell> */}
                          <TableCell>Groupe A</TableCell>
                          {/* <TableCell>{etudiant.proje}</TableCell> */}
                          {/* <TableCell>
                            <Badge variant={etudiant.moyenne >= 10 ? "secondary" : "destructive"}>
                              {etudiant.moyenne}/20
                            </Badge>
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
                                  <Link href={`/etudiants/${etudiant.id}`} className="flex items-center">
                                    <User size={16} className="mr-2" />
                                    Voir profil
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/etudiants/${etudiant.id}/edit`} className="flex items-center">
                                    <Edit size={16} className="mr-2" />
                                    Modifier
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/etudiants/${etudiant.id}/notes`} className="flex items-center">
                                    <FileText size={16} className="mr-2" />
                                    Voir notes
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <a href={`mailto:${etudiant.email}`} className="flex items-center">
                                    <Mail size={16} className="mr-2" />
                                    Envoyer un email
                                  </a>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button variant="outline" asChild>
                    <Link href={`/promotions/${promotion.id}/etudiants`}>Voir tous les étudiants</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projets" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Projets de la promotion</CardTitle>
                  <CardDescription>
                    {promotion.statistiques.nombreProjets} projets associés à cette promotion
                  </CardDescription>
                </div>
                <Button asChild>
                  <Link href={`/projets/nouveau?promotion=${promotion.id}`}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nouveau projet
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {promo?.Projects.map((projet) => (
                    <Card key={projet.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{projet.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">{projet.description}</p>
                          </div>
                          {/* <Badge
                            className="mt-2 md:mt-0"
                            variant={
                              projet.statut === "Terminé"
                                ? "secondary"
                                : projet.statut === "En cours"
                                  ? "default"
                                  : "outline"
                            }
                          >
                            {projet.statut}
                          </Badge> */}
                        </div>

                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Période</p>
                            {/* <p className="font-medium">
                              {projet.dateDebut} - {projet.dateFin}
                            </p> */}
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Groupes</p>
                            {/* <p className="font-medium">{projet.nombreGroupes} groupes</p> */}
                            <p className="font-medium">13 groupes</p>
                          </div>
                          {/* <div>
                            <p className="text-sm text-gray-500">Progression</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress value={projet.progression} className="h-2 flex-1" />
                              <span className="text-sm font-medium">{projet.progression}%</span>
                            </div>
                          </div> */}
                        </div>

                        <div className="mt-4 flex justify-end">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/projets/${projet.id}/details`}>Voir détails</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <Button variant="outline" asChild>
                    <Link href={`/projets?promotion=${promotion.id}`}>Voir tous les projets</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end gap-4">
          <Button variant="outline" asChild>
            <Link href={`/promotions/${promotion.id}/calendrier`}>
              <Calendar className="mr-2 h-4 w-4" />
              Voir calendrier
            </Link>
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter les données
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
