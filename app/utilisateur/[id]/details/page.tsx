'use client'
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
    ArrowLeft,
    BookOpen,
    Calendar,
    Edit,
    FileText,
    Mail,
    MapPin,
    Phone,
    Trash,
    User,
    UserCheck,
    UserX,
    Users,
} from "lucide-react"
import Link from "next/link"

interface UserDetailsPageProps {
    userId: string;
}
export default function UtilisateurDetailPage(userId: UserDetailsPageProps) {
    const utilisateur = {
        id: Number.parseInt(userId.userId),
        nom: "Martin",
        prenom: "Marie",
        email: "marie.martin@example.com",
        telephone: "+33 6 12 34 56 78",
        adresse: "123 Rue de la République, 75001 Paris",
        role: "Étudiant",
        promotion: "Master 2 Informatique",
        statut: "Actif",
        dateCreation: "01/09/2022",
        derniereConnexion: "16/05/2023",
        avatar: "/placeholder.svg?height=120&width=120",
        bio: "Étudiante passionnée par le développement web et l'intelligence artificielle. Actuellement en Master 2 Informatique avec une spécialisation en développement full-stack.",
        competences: ["React", "Node.js", "Python", "Machine Learning", "UI/UX Design"],
        statistiques: {
            projetsParticipes: 5,
            livrablesRendus: 12,
            rapportsRediges: 8,
            moyenneGenerale: 16.2,
            tauxParticipation: 95,
        },
        projets: [
            {
                id: 1,
                nom: "Projet Web Full Stack",
                groupe: "Groupe A",
                statut: "En cours",
                progression: 75,
                note: null,
            },
            {
                id: 2,
                nom: "Application Mobile",
                groupe: "Groupe B",
                statut: "Terminé",
                progression: 100,
                note: "17/20",
            },
            {
                id: 3,
                nom: "Intelligence Artificielle",
                groupe: "Groupe C",
                statut: "À venir",
                progression: 0,
                note: null,
            },
        ],
        activiteRecente: [
            {
                id: 1,
                type: "livrable",
                description: "Soumission du prototype fonctionnel",
                date: "15/05/2023",
                projet: "Projet Web Full Stack",
            },
            {
                id: 2,
                type: "rapport",
                description: "Rédaction du rapport d'analyse",
                date: "12/05/2023",
                projet: "Projet Web Full Stack",
            },
            {
                id: 3,
                type: "connexion",
                description: "Connexion à la plateforme",
                date: "16/05/2023",
                projet: null,
            },
            {
                id: 4,
                type: "note",
                description: "Note reçue pour l'application mobile",
                date: "10/05/2023",
                projet: "Application Mobile",
            },
        ],
        groupes: [
            {
                id: 1,
                nom: "Groupe A",
                projet: "Projet Web Full Stack",
                role: "Chef de projet",
                membres: 4,
            },
            {
                id: 2,
                nom: "Groupe B",
                projet: "Application Mobile",
                role: "Développeur Frontend",
                membres: 3,
            },
        ],
    }

    const getActivityIcon = (type: string) => {
        switch (type) {
            case "livrable":
                return <FileText className="h-4 w-4 text-blue-500" />
            case "rapport":
                return <FileText className="h-4 w-4 text-green-500" />
            case "connexion":
                return <User className="h-4 w-4 text-gray-500" />
            case "note":
                return <BookOpen className="h-4 w-4 text-purple-500" />
            default:
                return <User className="h-4 w-4 text-gray-500" />
        }
    }

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/utilisateurs">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {utilisateur.prenom} {utilisateur.nom}
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge
                                    variant={
                                        utilisateur.role === "Administrateur"
                                            ? "destructive"
                                            : utilisateur.role === "Enseignant"
                                                ? "default"
                                                : "secondary"
                                    }
                                >
                                    {utilisateur.role}
                                </Badge>
                                {utilisateur.promotion && <Badge variant="outline">{utilisateur.promotion}</Badge>}
                                <div className="flex items-center gap-1">
                                    {utilisateur.statut === "Actif" ? (
                                        <UserCheck className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <UserX className="h-4 w-4 text-red-500" />
                                    )}
                                    <Badge variant={utilisateur.statut === "Actif" ? "secondary" : "destructive"}>
                                        {utilisateur.statut}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/utilisateurs/${utilisateur.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                            </Link>
                        </Button>
                        <Button variant="destructive">
                            <Trash className="mr-2 h-4 w-4" />
                            Supprimer
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Informations personnelles</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center text-center mb-6">
                                <Avatar className="h-24 w-24 mb-4">
                                    <AvatarImage
                                        src={utilisateur.avatar || "/placeholder.svg"}
                                        alt={`${utilisateur.prenom} ${utilisateur.nom}`}
                                    />
                                    <AvatarFallback className="text-lg">
                                        {utilisateur.prenom[0]}
                                        {utilisateur.nom[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <h3 className="text-xl font-semibold">
                                    {utilisateur.prenom} {utilisateur.nom}
                                </h3>
                                <p className="text-gray-500">{utilisateur.role}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium">{utilisateur.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Téléphone</p>
                                        <p className="font-medium">{utilisateur.telephone}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <MapPin className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Adresse</p>
                                        <p className="font-medium">{utilisateur.adresse}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Membre depuis</p>
                                        <p className="font-medium">{utilisateur.dateCreation}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <User className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Dernière connexion</p>
                                        <p className="font-medium">{utilisateur.derniereConnexion}</p>
                                    </div>
                                </div>
                            </div>

                            {utilisateur.bio && (
                                <div className="mt-6 pt-6 border-t">
                                    <h4 className="font-medium mb-2">À propos</h4>
                                    <p className="text-sm text-gray-600">{utilisateur.bio}</p>
                                </div>
                            )}

                            {utilisateur.competences && utilisateur.competences.length > 0 && (
                                <div className="mt-6 pt-6 border-t">
                                    <h4 className="font-medium mb-3">Compétences</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {utilisateur.competences.map((competence, index) => (
                                            <Badge key={index} variant="outline">
                                                {competence}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Statistiques</CardTitle>
                            <CardDescription>Aperçu des performances de l'utilisateur</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600">{utilisateur.statistiques.projetsParticipes}</div>
                                    <p className="text-sm text-gray-500 mt-1">Projets participés</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-600">{utilisateur.statistiques.livrablesRendus}</div>
                                    <p className="text-sm text-gray-500 mt-1">Livrables rendus</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-purple-600">{utilisateur.statistiques.rapportsRediges}</div>
                                    <p className="text-sm text-gray-500 mt-1">Rapports rédigés</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-orange-600">
                                        {utilisateur.statistiques.moyenneGenerale}/20
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">Moyenne générale</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-emerald-600">
                                        {utilisateur.statistiques.tauxParticipation}%
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">Taux de participation</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="projets" className="mt-8">
                    <TabsList className="grid grid-cols-3 w-full max-w-md">
                        <TabsTrigger value="projets">Projets</TabsTrigger>
                        <TabsTrigger value="groupes">Groupes</TabsTrigger>
                        <TabsTrigger value="activite">Activité</TabsTrigger>
                    </TabsList>

                    <TabsContent value="projets" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Projets</CardTitle>
                                <CardDescription>Liste des projets auxquels l'utilisateur participe</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nom du projet</TableHead>
                                                <TableHead>Groupe</TableHead>
                                                <TableHead>Statut</TableHead>
                                                <TableHead>Progression</TableHead>
                                                <TableHead>Note</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {utilisateur.projets.map((projet) => (
                                                <TableRow key={projet.id}>
                                                    <TableCell className="font-medium">{projet.nom}</TableCell>
                                                    <TableCell>{projet.groupe}</TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={
                                                                projet.statut === "Terminé"
                                                                    ? "secondary"
                                                                    : projet.statut === "En cours"
                                                                        ? "default"
                                                                        : "outline"
                                                            }
                                                        >
                                                            {projet.statut}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Progress value={projet.progression} className="w-20" />
                                                            <span className="text-sm">{projet.progression}%</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {projet.note ? (
                                                            <Badge variant="outline">{projet.note}</Badge>
                                                        ) : (
                                                            <span className="text-gray-400">-</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button variant="outline" size="sm" asChild>
                                                            <Link href={`/projets/${projet.id}`}>Voir détails</Link>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="groupes" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Groupes</CardTitle>
                                <CardDescription>Groupes auxquels l'utilisateur appartient</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {utilisateur.groupes.map((groupe) => (
                                        <div key={groupe.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-semibold">{groupe.nom}</h3>
                                                    <p className="text-sm text-gray-500 mt-1">{groupe.projet}</p>
                                                    <div className="flex items-center gap-4 mt-2">
                                                        <Badge variant="outline">{groupe.role}</Badge>
                                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                                            <Users size={14} />
                                                            <span>{groupe.membres} membres</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/groupes/${groupe.id}`}>Voir groupe</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="activite" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Activité récente</CardTitle>
                                <CardDescription>Dernières actions de l'utilisateur</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {utilisateur.activiteRecente.map((activite) => (
                                        <div key={activite.id} className="flex items-start gap-3 p-3 border rounded-lg">
                                            <div className="mt-1">{getActivityIcon(activite.type)}</div>
                                            <div className="flex-1">
                                                <p className="font-medium">{activite.description}</p>
                                                {activite.projet && <p className="text-sm text-gray-500 mt-1">{activite.projet}</p>}
                                                <p className="text-xs text-gray-400 mt-1">{activite.date}</p>
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
