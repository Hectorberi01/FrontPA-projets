"use client"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, ClipboardList, Edit, FileText, Users, Plus } from "lucide-react"
import Link from "next/link"
import { use, useEffect, useState } from "react"
import {getProjectById} from "@/lib/services/project";

interface ProjectDetailsPageProps {
    projectId: string;
}
export default function ProjetDetailPage({projectId}: ProjectDetailsPageProps ) {
    const [projets, setProjet] = useState<any>()

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const result = await getProjectById(Number(projectId))
                setProjet(result)
            } catch (err) {
                console.error("Projet non trouvé", err)
            }
        }

        if (projectId) fetchProject()
    }, [projectId])

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/projets">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{projets?.name}</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline">{projets?.promotion?.name}</Badge>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <Button asChild>
                            {projets?.id && (
                                <Link href={`/projets/${projets.id}/edit`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Modifier
                                </Link>
                            )}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700">{projets?.description}</p>

                            <div className="mt-6 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Date de création</h3>
                                        <p className="mt-1">
                                            {new Date(projets?.createdAt).toLocaleString("fr-FR", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Date de fin</h3>
                                        {/*<p className="mt-1">{projet.dateFin}</p>*/}
                                        <p className="mt-1">15/06/2023</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Statistiques</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-2 border-b">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-5 w-5 text-gray-500" />
                                        <span>Groupes</span>
                                    </div>
                                    <span className="font-medium">{projets?.groups.length}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b">
                                    <div className="flex items-center gap-2">
                                        <ClipboardList className="h-5 w-5 text-gray-500"/>
                                        <span>Livrables</span>
                                    </div>
                                    {/*<span className="font-medium">{projets.livrables.length}</span>*/}
                                    <span className="font-medium">3</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-gray-500"/>
                                        <span>Rapports</span>
                                    </div>
                                    {/*<span className="font-medium">{projet.rapports.length}</span>*/}
                                    <span className="font-medium">4</span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-gray-500" />
                                        <span>Soutenance</span>
                                    </div>
                                    {/*<span className="font-medium">{projets?.soutenances}</span>*/}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="groupes" className="mt-8">
                    <TabsList className="grid grid-cols-4 w-full max-w-2xl">
                        <TabsTrigger value="groupes">Groupes</TabsTrigger>
                        <TabsTrigger value="livrables">Livrables</TabsTrigger>
                        <TabsTrigger value="rapports">Rapports</TabsTrigger>
                        <TabsTrigger value="soutenances">Soutenances</TabsTrigger>
                    </TabsList>

                    <TabsContent value="groupes" className="mt-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Groupes</CardTitle>
                                    <CardDescription>Liste des groupes du projet</CardDescription>
                                </div>
                                <Button asChild>
                                    {projets?.id && (
                                        <Link href={`/projets/${projets.id}/groupes/nouveau`}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Nouveau grouper
                                        </Link>
                                    )}
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {projets?.groups?.map((groupe:any) => (
                                        <Card key={groupe.id}>
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-semibold">{groupe.name}</h3>
                                                    <Badge variant="outline">{groupe.membres} membres</Badge>
                                                </div>
                                                <div className="mt-4 flex justify-end">
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={`/projets/${projets.id}/groupes/${groupe.id}`}>Voir détails</Link>
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="livrables" className="mt-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Livrables</CardTitle>
                                    <CardDescription>Liste des livrables du projet</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {projets?.livrables?.map((livrable:any) => (
                                        <div key={livrable.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold">{livrable.name}</h3>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Soumis :{" "}
                                                        {new Date(livrable.submittedAt).toLocaleString("fr-FR", {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit"
                                                        })}
                                                    </p>
                                                    <p> Groupe: {projets.groups.find((g: any) => g.id === livrable.groupId)?.name || "Inconnu"} </p>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex justify-end">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`http://localhost:3000/api/livrables/${livrable.id}/download`}>Télécharger le livrable</Link>
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
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Rapports</CardTitle>
                                    <CardDescription>Liste des rapports du projet</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {projets?.reports?.map((rapport:any) => (
                                        <div key={rapport.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold">{rapport.title}</h3>
                                                    <p>{rapport.content}</p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Soumis :{" "}
                                                        {new Date(rapport.createdAt).toLocaleString("fr-FR", {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit"
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="soutenances" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Soutenances</CardTitle>
                                <CardDescription>Informations sur les soutenances du projet</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {projets?.soutenanceDate ?(
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div className="border rounded-lg p-4">
                                                <h3 className="text-sm font-medium text-gray-500">Date</h3>
                                                {/*<p className="mt-1 font-medium">{projet.soutenances.date}</p>*/}
                                                <p className="mt-1 font-medium">{projets?.soutenanceDate}</p>
                                            </div>
                                            <div className="border rounded-lg p-4">
                                                <h3 className="text-sm font-medium text-gray-500">Lieu</h3>
                                                {/*<p className="mt-1 font-medium">{projet.soutenances.lieu}</p>*/}
                                                <p className="mt-1 font-medium">{projets?.lieuSoutenance}</p>
                                            </div>
                                            <div className="border rounded-lg p-4">
                                                <h3 className="text-sm font-medium text-gray-500">Durée</h3>
                                                {/*<p className="mt-1 font-medium">{projet.soutenances.duree}</p>*/}
                                                <p className="mt-1 font-medium">{projets?.soutenanceDuration} minutes par groupe</p>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex justify-end gap-4">
                                            <Button asChild>
                                                <Link href={`/projets/${projets?.id}/soutenances/edit`}>Générer l'ordre de passage</Link>
                                            </Button>
                                            <Button variant="outline" asChild>
                                                <Link href={`/projets/${projets?.id}/soutenances/planning`}>Voir
                                                    planning</Link>
                                            </Button>
                                            <Button asChild>
                                                <Link href={`/projets/${projets?.id}/soutenances/edit`}>Modifier</Link>
                                            </Button>
                                        </div>
                                    </div>
                                ): (
                                    <div className="flex justify-end">
                                        <Button asChild>
                                        <Link href={`/soutenances/${projets?.id}`}>
                                            Ajouter les informations de soutenance
                                        </Link>
                                         </Button>
                                    </div>
                                )}

                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    )
}
