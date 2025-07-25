"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Download, FileText, Users, Mail, Phone, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import {DashboardLayout} from "@/components/layout/dashboard-layout";
import {useEffect, useState} from "react";
import {fecthGroupeById} from "@/lib/services/groupe";

import { Badge } from "@/components/ui/badge"
import { gradingApi } from "@/lib/services/notation"

import GrilleNotationManager from "@/components/notation/GrilleNotationManager"
import NotationGroupeManager from "@/components/notation/NotationGroupeManager"

interface PageProps {
    params: {
        id: string
        groupeId: string
    }
}

export default function GroupeDetailsPage({ params }: PageProps) {
    const { id, groupeId } = params
    const [group, setGroup] = useState<any>()
    const [grilles, setGrilles] = useState<any[]>([]) // grilles liées à ce projet
    const [globalComment, setGlobalComment] = useState("")
    const [criteria, setCriteria] = useState<any[]>([]);
    const [modeNotation, setModeNotation] = useState<'gestion' | 'notation'>('gestion')

    const [notationValidee, setNotationValidee] = useState(false)
    const [notes, setNotes] = useState<Record<
        string,
        {
            [critereId: string]: { note: number; commentaire: string }
        }
    >>({});

   useEffect(() => {
        console.log("groupId", groupeId)
        console.log("id", id)
        console.log("params1", params)
        const fetchGroup = async()  =>{
            try {
                const Id = parseInt(params.groupeId)
                console.log("id1", Id)
                const response = await fecthGroupeById(Id)
                if (response == undefined) {
                    return;
                }
                console.log("response fecthGroupeById", response)
                setGroup(response)
            }catch (error){
                console.log(error)
            }
        }

        fetchGroup()
    }, [id, groupeId])

    useEffect(() => {
        const fetchData = async () => {
            try {
              /*  const [grillesData, criteriaData] = await Promise.all([
                    gradingApi.getProjectGrilles(id),
                    gradingApi.getProjectCriteria(id)
                ]);*/
            // const fakeGrilles = [
            //         {
            //             id: "grille1",
            //             titre: "Notation du livrable",
            //             type: "livrable",
            //             criteres: [
            //                 { id: 1, nom: "Structure du code", poids: 50 },
            //                 { id: 2, nom: "Lisibilité", poids: 50 },
            //             ],
            //             ponderationGlobale: 0.4,
            //             validee: false,
            //         },
            //         {
            //             id: "grille2",
            //             titre: "Évaluation du rapport",
            //             type: "rapport",
            //             criteres: [
            //                 { id: 3, nom: "Contenu", poids: 70 },
            //                 { id: 4, nom: "Orthographe", poids: 30 },
            //             ],
            //             ponderationGlobale: 0.3,
            //             validee: false,
            //         },
            //         {
            //             id: "grille3",
            //             titre: "Soutenance orale",
            //             type: "soutenance",
            //             criteres: [
            //                 { id: 5, nom: "Clarté", poids: 60 },
            //                 { id: 6, nom: "Maîtrise du sujet", poids: 40 },
            //             ],
            //             ponderationGlobale: 0.3,
            //             validee: false,
            //         },
            //     ];

            //     const fakeCriteria = fakeGrilles.flatMap(g => g.criteres);

            //     setGrilles(fakeGrilles);
            //     setCriteria(fakeCriteria);
              //  setGrilles(grillesData);
               // setCriteria(criteriaData);
           
             const grillesData = await gradingApi.getProjectGrilles(id);
            setGrilles(grillesData);
            
            } catch (error) {
                console.error('Erreur lors du chargement des données:', error);
            }
        };

        if (id) fetchData();
    }, [id]);

  
   
    const getGrillesByType = (type: string) => {
        return grilles.filter(g => g.type === type) || []
    }

    return (
        <DashboardLayout>
            <div className="container mx-auto p-6 space-y-6">
                {/* Header du groupe */}
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold">{group?.name}</h1>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <CalendarDays className="h-4 w-4" />
                                Créé le {new Date(group?.createdAt).toLocaleDateString("fr-FR")}
                            </div>
                            <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {group?.groupStudent?.length || 0} membres {/* Safe access */}
                            </div>
                            {notationValidee && (
                                <Badge variant="default" className="flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    Notation validée
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                {/* Contenu principal avec onglets */}
                <Tabs defaultValue="membres" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4"> {/* Adjusted grid-cols to 4 for "Notation" tab */}
                        <TabsTrigger value="membres">Membres</TabsTrigger>
                        <TabsTrigger value="rapports">Rapports</TabsTrigger>
                        <TabsTrigger value="livrables">Livrables</TabsTrigger>
                        <TabsTrigger value="notation">Notation</TabsTrigger>

                    </TabsList>

                    {/* Onglet Membres */}
                    <TabsContent value="membres" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            {group?.groupStudent?.map((student:any) => ( // Added ?. for safe access
                                <Card key={student.student.id}>
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-4">
                                            <Avatar>
                                                <AvatarImage src={"https://img.freepik.com/vecteurs-libre/illustration-du-jeune-homme-souriant_1308-174669.jpg?semt=ais_hybrid&w=740"} alt={student.student.nom} />
                                                <AvatarFallback>
                                                    {student.student.nom
                                                        .split(" ")
                                                        .map((n:any) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 space-y-2">
                                                <div>
                                                    <h3 className="font-semibold">{student.student.nom} {student.student.prenom} </h3>
                                                </div>
                                                <div className="space-y-1 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-3 w-3" />
                                                        <a href={`mailto:${student.student.email}`} className="hover:text-foreground">
                                                            {student.student.email}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {/* Afficher un message si aucun membre n'est trouvé */}
                            {!group?.groupStudent?.length && <p className="text-gray-600">Aucun membre trouvé pour ce groupe.</p>}
                        </div>
                    </TabsContent>

                    {/* Onglet Rapports */}
                    <TabsContent value="rapports" className="space-y-4">
                        <div className="space-y-4">
                            {group?.reports?.map((rapport:any) => ( // Added ?. for safe access
                                <Card key={rapport.id}>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <CardTitle className="text-lg">{rapport.title}</CardTitle>
                                                <CardDescription>{rapport.content}</CardDescription>
                                            </div>
                                        
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <span>Soumis le :</span>
                                                <span>{new Date(rapport.createdAt).toLocaleDateString("fr-FR")}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {/* Afficher un message si aucun rapport n'est trouvé */}
                            {!group?.reports?.length && <p className="text-gray-600">Aucun rapport trouvé pour ce groupe.</p>}
                        </div>
                    </TabsContent>

                    {/* Onglet Livrables */}
                    <TabsContent value="livrables" className="space-y-4">
                        <div className="space-y-4">
                            {group?.deliverables?.map((livrable:any) => ( // Added ?. for safe access
                                <Card key={livrable.id}>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <CardTitle className="text-lg">{livrable.name}</CardTitle>
                                                <CardDescription>{livrable.description}</CardDescription>
                                            </div>
                                            
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <CalendarDays className="h-3 w-3" />
                                                    Soumis: {new Date(livrable.submittedAt).toLocaleDateString("fr-FR")}
                                                </div>
                                            </div>
                                            {livrable.fileUrl ? (
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`http://localhost:3000/api/livrables/${livrable.id}/download`}>Télécharger le livrable</Link>
                                                </Button>
                                            ) : (
                                                <Button variant="outline" size="sm" disabled>
                                                    Non disponible
                                                </Button>
                                            )}
                                        </div>
                                        {livrable?.githubUrl && (
                                            <div className="text-sm text-muted-foreground">
                                                <span className="font-medium">Lien GitHub : </span>
                                                <a href={livrable.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                                    {livrable.githubUrl}
                                                </a>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                            {/* Afficher un message si aucun livrable n'est trouvé */}
                            {!group?.deliverables?.length && <p className="text-gray-600">Aucun livrable trouvé pour ce groupe.</p>}
                        </div>
                    </TabsContent>
                
                         <TabsContent value="notation" className="space-y-4">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">Notation</h2>
                                <div className="flex gap-2">
                                    <Button 
                                        variant={modeNotation === 'gestion' ? 'default' : 'outline'}
                                        onClick={() => setModeNotation('gestion')}
                                    >
                                        Gérer les grilles
                                    </Button>
                                    <Button 
                                        variant={modeNotation === 'notation' ? 'default' : 'outline'}
                                        onClick={() => setModeNotation('notation')}
                                        disabled={grilles.length === 0}
                                    >
                                        Noter le groupe
                                    </Button>
                                </div>
                            </div>

                        {modeNotation === 'gestion' ? (
                            <GrilleNotationManager 
                                projectId={id} 
                                groupId={groupeId}
                                initialGrilles={grilles}
                                onGrillesChange={setGrilles}
                            />
                        ) : (
                            <NotationGroupeManager
                                projectId={id}
                                groupId={groupeId}
                                grilles={grilles}
                                group={group}
                                onNotationChange={(notes) => console.log('Notation changed:', notes)}
                            />
                        )}

                    </TabsContent>
                  
                </Tabs>
            </div>
        </DashboardLayout>
    )
}