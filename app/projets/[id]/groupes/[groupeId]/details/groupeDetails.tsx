"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Download, FileText, Users, Mail, Phone } from "lucide-react"
import Link from "next/link"
import {DashboardLayout} from "@/components/layout/dashboard-layout";
import {useEffect, useState} from "react";
import {fecthGroupeById} from "@/lib/services/groupe";

interface PageProps {
    params: {
        id: string
        groupeId: string
    }
}

export default function GroupeDetailsPage({ params }: PageProps) {
    const { id, groupeId } = params
    const [group, setGroup] = useState<any>()


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
