"use client"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowLeft,BarChart,BookOpen,Calendar,Download,Edit,FileText,Mail,MoreHorizontal,Plus,Search,Trash,Upload,User,Users,} from "lucide-react"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { use, useEffect, useState } from "react"
import { getPromotionById } from "@/lib/services/promotionService"
import { PromotionWithDetails } from "@/lib/types/promotion"

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
                {promo?.Students && (
                    <Badge variant="secondary">{promo.Students.length} étudiants</Badge>
                )}
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
                      <AvatarImage src="https://img.freepik.com/vecteurs-libre/illustration-du-jeune-homme-souriant_1308-174669.jpg?semt=ais_hybrid&w=740" alt={"HECTOR"} />
                    </Avatar>
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
                  <span className="font-medium">{promo?.Students.length}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-gray-500" />
                    <span>Projets</span>
                  </div>
                  {promo?.Projects && (
                      <span className="font-medium">{promo?.Projects.length}</span>
                  )}
                </div>
              </div>
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
                    {promo?.Students?.length ?? 0} étudiants inscrits dans cette promotion
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {/*<Button variant="outline" asChild>*/}
                  {/*  {*/}
                  {/*    promo && (*/}
                  {/*      <Link href={`/promotions/${promotionId}/etudiants/importer`}>*/}
                  {/*        <Upload className="mr-2 h-4 w-4" />*/}
                  {/*        Importer*/}
                  {/*      </Link>*/}
                  {/*    )*/}
                  {/*  }*/}
                  {/*</Button>*/}
                  <Button asChild>
                    <Link href={`/promotions/${promotionId}/etudiant`}>
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
                  {/*<Button variant="outline">*/}
                  {/*  <Download className="mr-2 h-4 w-4" />*/}
                  {/*  Exporter*/}
                  {/*</Button>*/}
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Prenom</TableHead>
                        <TableHead>Email</TableHead>
                        {/*<TableHead>Groupe</TableHead>*/}
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {promo?.Students?.map((etudiant) => (
                        <TableRow key={etudiant.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="https://img.freepik.com/vecteurs-libre/illustration-du-jeune-homme-souriant_1308-174669.jpg?semt=ais_hybrid&w=740" alt={etudiant.nom} />
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
                          {/*<TableCell>Groupe A</TableCell>*/}
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
                    <Link href={`/promotions/${promotionId}/etudiants`}>Voir tous les étudiants</Link>
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
                    {promo?.Projects?.length} projets associés à cette promotion
                  </CardDescription>
                </div>
                <Button asChild>
                  <Link href={`/projets/nouveau?promotion=${promotionId}`}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nouveau projet
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {promo?.Projects?.map((projet) => (
                    <Card key={projet.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{projet.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">{projet.description}</p>
                          </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/projets/${projet.id}`} className="flex items-center">Voir détails</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <Button variant="outline" asChild>
                    <Link href={`/projets?promotion=${promotionId}`}>Voir tous les projets</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
