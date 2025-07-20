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
import {similarityCheck} from "@/lib/services/livrables";
import Swal from 'sweetalert2'
import {generateSoutenanceSchedule} from "@/lib/services/soutenance";

interface ProjectDetailsPageProps {
    projectId: string;
}
export default function ProjetDetailPage({projectId}: ProjectDetailsPageProps ) {
    const [projets, setProjet] = useState<any>()
    const [hasEmptyGroups, setHasEmptyGroup] = useState<boolean>();


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

    useEffect(() => {
        if (!projets?.groups) return;

        const hasEmptyGroup = projets.groups.some((group: any) =>
            (group.groupStudent ?? []).length === 0
        );

        setHasEmptyGroup(hasEmptyGroup);
    }, [projets]);

    const handleRunSimilarityCheck = async () => {
        try {
            const response = await similarityCheck(parseInt(projectId))
            if(response){
                Swal.fire({
                    title: "Analyse fini avec success",
                    icon: "success",
                    draggable: true
                });
                window.location.reload()
            }else {
                Swal.fire({
                    title: "errer",
                    icon: "error",
                    draggable: true
                });
                window.location.reload()
            }
        } catch (err) {
            console.error(err);
            alert("Erreur inattendue.");
        }
    };

    const handleGenerateSoutenanceOrder = async () => {
        try {
            const res = await generateSoutenanceSchedule(projets.id)
            if(!res) {
                Swal.fire({
                    icon: "error",
                    title: "error",
                    text: "Something went wrong!",
                    draggable: true
                });
            }else {
                Swal.fire({
                    title: "Success!",
                    icon: "success",
                    draggable: true
                });
            }
            window.location.reload()
        } catch (err) {
            console.error(err);
            alert("Erreur serveur.");
        }
    };

    console.log("hasEmptyGroups", hasEmptyGroups)
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
                                        <p className="mt-1">
                                            {projets?.soutenanceDate
                                                ? new Date(projets.soutenanceDate).toLocaleDateString("fr-FR", {
                                                    day: "2-digit",
                                                    month: "long",
                                                    year: "numeric",
                                                })
                                                : "Date non définie"}
                                        </p>
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
                                    <span className="font-medium">{projets?.livrables.length}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-gray-500"/>
                                        <span>Rapports</span>
                                    </div>
                                    <span className="font-medium">{projets?.rapports?.length ?? 0}</span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-gray-500" />
                                        <span>Soutenance</span>
                                    </div>
                                    <span className="font-medium">
                                        {projets?.soutenanceDate ? new Date(projets.soutenanceDate).toLocaleDateString('fr-FR') : 'Date non définie'}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="groupes" className="mt-8">
                    <TabsList className="grid grid-cols-7 w-full max-w-2xl">
                        <TabsTrigger value="groupes" className="w-full text-center">Groupes</TabsTrigger>
                        <TabsTrigger value="livrables" className="w-full text-center">Livrables</TabsTrigger>
                        <TabsTrigger value="rapports" className="w-full text-center">Rapports</TabsTrigger>
                        <TabsTrigger value="soutenances" className="w-full text-center">Soutenances</TabsTrigger>
                        <TabsTrigger value="ordre-passage" className="w-full text-center">Passage</TabsTrigger>
                        <TabsTrigger value="section-triche" className="w-full text-center">Triche</TabsTrigger>
                        <TabsTrigger value="notation" className="w-full text-center">Notation</TabsTrigger>

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
                                                <p className="mt-1 font-medium">
                                                    {new Date(projets?.soutenanceDate).toLocaleDateString("fr-FR", {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric",
                                                    })}
                                                </p>
                                            </div>
                                            <div className="border rounded-lg p-4">
                                                <h3 className="text-sm font-medium text-gray-500">Lieu</h3>
                                                <p className="mt-1 font-medium">{projets?.lieuSoutenance}</p>
                                            </div>
                                            <div className="border rounded-lg p-4">
                                                <h3 className="text-sm font-medium text-gray-500">Durée</h3>
                                                <p className="mt-1 font-medium">{projets?.soutenanceDuration} minutes par groupe</p>
                                            </div>
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
                    <TabsContent value="ordre-passage" className="mt-6">
                        <CardContent>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm font-medium text-gray-500">Order de passage</CardTitle>
                                    <CardDescription>Ordre de passage pour la soutenance</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {projets?.soutenances && projets.soutenances.length > 0 && !hasEmptyGroups ? (
                                        <table
                                            className="w-full text-sm text-left border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                                            <thead className="bg-green-100 text-green-800">
                                            <tr>
                                                <th className="p-3 border-b font-semibold">Ordre</th>
                                                <th className="p-3 border-b font-semibold">Nom du groupe</th>
                                                <th className="p-3 border-b font-semibold">Début</th>
                                                <th className="p-3 border-b font-semibold">Fin</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {projets.soutenances
                                                .sort((a: any, b: any) => a.order - b.order)
                                                .map((soutenance: any, index: any) => {
                                                    const group = projets?.groups.find((g: any) => g.id === soutenance.groupId);

                                                    const formatTime = (iso: string) => {
                                                        const date = new Date(iso);
                                                        return date.toLocaleTimeString("fr-FR", {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        });
                                                    };

                                                    return (
                                                        <tr key={index}
                                                            className={index % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"}>
                                                            <td className="p-3 border-b">{soutenance.order}</td>
                                                            <td className="p-3 border-b">{group?.name ?? "Groupe inconnu"}</td>
                                                            <td className="p-3 border-b">{formatTime(soutenance.startTime)}</td>
                                                            <td className="p-3 border-b">{formatTime(soutenance.endTime)}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>

                                    ) : (
                                        hasEmptyGroups ? (
                                            <div className="text-center text-gray-500 py-6">
                                                <p className="mb-4">Un ou plusieurs groupes ne contiennent pas
                                                    d’étudiants.</p>
                                            </div>

                                        ) : (
                                            <div className="text-center text-gray-500 py-6">
                                                <p className="mb-4">Aucune soutenance prévue.</p>
                                                <button onClick={handleGenerateSoutenanceOrder}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                                >
                                                    Générer l’ordre de passage
                                                </button>
                                            </div>
                                        )
                                    )}
                                </CardContent>

                            </Card>
                        </CardContent>
                    </TabsContent>
                    <TabsContent value="section-triche" className="mt-6">
                        <CardContent>
                        <Card>
                            <CardHeader>
                                    <CardTitle>Cohérence entre les livrables</CardTitle>
                                    <CardDescription>
                                        Vérifier s'il y a un groupe qui a copié sur un autre
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {(!projets?.similarity?.comparisons || projets.similarity.comparisons.length === 0) ? (
                                        <div className="text-center py-6">
                                            <p className="mb-4">Aucune comparaison n'a encore été effectuée.</p>
                                            <button
                                                onClick={handleRunSimilarityCheck}
                                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                            >
                                                Lancer l'analyse de similarité
                                            </button>
                                        </div>
                                    ) : (
                                        <table className="w-full text-left border border-gray-300">
                                            <thead className="bg-gray-100">
                                            <tr>
                                                <th className="p-2 border-b">Groupe A</th>
                                                <th className="p-2 border-b">Groupe B</th>
                                                <th className="p-2 border-b">Score</th>
                                                <th className="p-2 border-b">Suspect</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                                {projets?.similarity.comparisons
                                                    .filter((c:any, i:any, arr:any) => {
                                                        // Supprime les doublons en combinant les deux IDs (peu importe l'ordre)
                                                        const key = [c.deliverableA, c.deliverableB].sort().join("-");
                                                        return i === arr.findIndex((item:any) => [item.deliverableA, item.deliverableB].sort().join("-") === key);
                                                    })
                                                    .map((comparison:any, index:any) => {
                                                        const findGroupName = (deliverableId: number) => {
                                                            const livrable = projets?.livrables.find((l:any) => l.id === deliverableId);
                                                            const group = projets?.groups.find((g:any) => g.id === livrable?.groupId);
                                                            return group?.name || `Groupe inconnu`;
                                                        };

                                                        return (
                                                            <tr key={index} className="border-t">
                                                                <td className="p-2">{findGroupName(comparison.deliverableA)}</td>
                                                                <td className="p-2">{findGroupName(comparison.deliverableB)}</td>
                                                                <td className="p-2">{comparison.score}</td>
                                                                <td className="p-2">
                                                                    {comparison.isSuspected ? (
                                                                        <span className="text-red-600 font-semibold">Oui</span>
                                                                    ) : (
                                                                        "Non"
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                            </tbody>
                                        </table>
                                    )}
                                </CardContent>
                            </Card>
                        </CardContent>
                    </TabsContent>
               <TabsContent value="notation" className="mt-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Notation</CardTitle>
                    </div>
                   
                    </CardHeader>
                    <CardContent>
                    {/* Section des grilles existantes */}
                   

                    {/* Section des groupes - gardez votre code existant */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Évaluations par groupe</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projets?.groups?.map((groupe: any) => (
                            <Card key={groupe.id}>
                            <CardContent className="p-4 space-y-4">
                                <div className="flex justify-between items-center">
                                <h3 className="font-semibold">{groupe.name}</h3>
                                <Badge variant={groupe.hasCompletedEvaluations ? "default" : "secondary"}>
                                    {groupe.hasCompletedEvaluations ? "Noté" : "En attente"}
                                </Badge>
                                </div>
                                <Button variant="default" asChild>
                                <Link href={`/projets/${projets?.id}/groupes/${groupe.id}?tab=notation`}>
                                    Voir les grilles de notation
                                </Link>
                                </Button>
                            </CardContent>
                            </Card>
                        ))}
                        </div>
                    </div>
                    </CardContent>
                </Card>
                </TabsContent>

                </Tabs>
            </div>
        </DashboardLayout>
    )
}
