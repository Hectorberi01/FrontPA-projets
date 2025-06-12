"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Download, FileText, Users, Mail, Phone } from "lucide-react"
import Link from "next/link"
import {DashboardLayout} from "@/components/layout/dashboard-layout";
import {useEffect, useState} from "react";
import {fecthGroupeById} from "@/lib/services/groupe";

// Données mockées - à remplacer par des appels API
const mockGroupData = {
    id: 1,
    nom: "Équipe Alpha",
    description: "Développement d'une application mobile de gestion de tâches",
    statut: "En cours",
    dateCreation: "2024-01-15",
    projet: {
        id: 1,
        nom: "Projet Innovation 2024",
    },
    membres: [
        {
            id: 1,
            nom: "Marie Dubois",
            email: "marie.dubois@email.com",
            telephone: "06 12 34 56 78",
            role: "Chef de projet",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: 2,
            nom: "Pierre Martin",
            email: "pierre.martin@email.com",
            telephone: "06 98 76 54 32",
            role: "Développeur",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: 3,
            nom: "Sophie Laurent",
            email: "sophie.laurent@email.com",
            telephone: "06 11 22 33 44",
            role: "Designer",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: 4,
            nom: "Thomas Rousseau",
            email: "thomas.rousseau@email.com",
            telephone: "06 55 66 77 88",
            role: "Testeur",
            avatar: "/placeholder.svg?height=40&width=40",
        },
    ],
    rapports: [
        {
            id: 1,
            titre: "Rapport d'avancement - Semaine 1",
            description: "Analyse des besoins et définition des spécifications",
            dateCreation: "2024-01-22",
            auteur: "Marie Dubois",
            statut: "Validé",
            fichier: "rapport_s1.pdf",
        },
        {
            id: 2,
            titre: "Rapport d'avancement - Semaine 2",
            description: "Conception de l'architecture et maquettes",
            dateCreation: "2024-01-29",
            auteur: "Sophie Laurent",
            statut: "En attente",
            fichier: "rapport_s2.pdf",
        },
        {
            id: 3,
            titre: "Rapport technique - Base de données",
            description: "Modélisation et implémentation de la base de données",
            dateCreation: "2024-02-05",
            auteur: "Pierre Martin",
            statut: "Brouillon",
            fichier: "rapport_bdd.pdf",
        },
    ],
    livrables: [
        {
            id: 1,
            nom: "Cahier des charges",
            description: "Document de spécifications fonctionnelles et techniques",
            dateEcheance: "2024-02-01",
            statut: "Livré",
            fichier: "cahier_charges.pdf",
            taille: "2.3 MB",
        },
        {
            id: 2,
            nom: "Maquettes UI/UX",
            description: "Prototypes et maquettes de l'interface utilisateur",
            dateEcheance: "2024-02-15",
            statut: "En cours",
            fichier: "maquettes.zip",
            taille: "15.7 MB",
        },
        {
            id: 3,
            nom: "Code source v1.0",
            description: "Première version fonctionnelle de l'application",
            dateEcheance: "2024-03-01",
            statut: "À venir",
            fichier: null,
            taille: null,
        },
    ],
}

interface PageProps {
    params: {
        id: string
        groupeId: string
    }
}

export default function GroupeDetailsPage({ params }: PageProps) {
    const { id, groupeId } = params
    const [group, setGroup] = useState<any>()
    const groupe = mockGroupData // En réalité, on ferait un fetch avec les IDs

    const getStatutColor = (statut: string) => {
        switch (statut.toLowerCase()) {
            case "validé":
            case "livré":
                return "bg-green-100 text-green-800"
            case "en cours":
            case "en attente":
                return "bg-yellow-100 text-yellow-800"
            case "brouillon":
            case "à venir":
                return "bg-gray-100 text-gray-800"
            default:
                return "bg-blue-100 text-blue-800"
        }
    }

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
                console.log("response", response)
                setGroup(response)
            }catch (error){
                console.log(error)
            }
        }

        fetchGroup()
    }, [id, groupeId])

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
                            {group?.groupStudent.length} membres
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenu principal avec onglets */}
            <Tabs defaultValue="membres" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="membres">Membres</TabsTrigger>
                    <TabsTrigger value="rapports">Rapports</TabsTrigger>
                    <TabsTrigger value="livrables">Livrables</TabsTrigger>
                </TabsList>

                {/* Onglet Membres */}
                <TabsContent value="membres" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        {group?.groupStudent.map((student:any) => (
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
                    </div>
                </TabsContent>

                {/* Onglet Rapports */}
                <TabsContent value="rapports" className="space-y-4">
                    <div className="space-y-4">
                        {group?.reports.map((rapport:any) => (
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
                                        {/*<Button variant="outline" size="sm">*/}
                                        {/*    <Download className="h-4 w-4 mr-2" />*/}
                                        {/*    Télécharger*/}
                                        {/*</Button>*/}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Onglet Livrables */}
                <TabsContent value="livrables" className="space-y-4">
                    <div className="space-y-4">
                        {group?.deliverables.map((livrable:any) => (
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
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    </DashboardLayout>
    )
}
