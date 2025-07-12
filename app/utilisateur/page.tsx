'use client'
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    ChevronDown,
    Download,
    Eye,
    Filter,
    Mail,
    MoreHorizontal,
    Plus,
    Search,
    Trash,
    Upload,
    User,
    UserCheck,
    UserX,
} from "lucide-react"
import Link from "next/link"
import {use, useEffect, useState} from "react";
import {getAll} from "@/lib/services/userService";

export default function UtilisateursPage() {

    const [utilisateurs, setUtilisateurs] = useState([])

    useEffect(() => {
        const fetchUtilisateur = async ()=>{
            try {
                const response = await getAll()
                setUtilisateurs(response)
            }catch (e) {
                console.error(e)
            }
        }

        fetchUtilisateur()

    }, []);

    const statistiques = {
        total: utilisateurs.length,
        enseignants: utilisateurs.filter((u:any) => u.role === "TEACHER").length,
        etudiants: utilisateurs.filter((u:any) => u.role === "STUDENT").length,
        administrateurs: utilisateurs.filter((u:any) => u.role === "Administrateur").length,
        actifs: utilisateurs.filter((u:any) => u.statut === "Actif").length,
        inactifs: utilisateurs.filter((u:any) => u.statut === "Inactif").length,
    }

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Utilisateurs</h1>
                        <p className="text-gray-600 mt-1">Gérez tous les utilisateurs de la plateforme</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex gap-2">
                        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                            <Upload className="h-4 w-4" />
                            Importer
                        </Button>
                        <Button asChild>
                            <Link href="/utilisateur/nouveau">
                                <Plus className="mr-2 h-4 w-4" />
                                Nouvel utilisateur
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Total utilisateurs</p>
                                    <h3 className="text-3xl font-bold mt-1">{statistiques.total}</h3>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                    <User className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Enseignants</p>
                                    <h3 className="text-3xl font-bold mt-1">{statistiques.enseignants}</h3>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                                    <UserCheck className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Étudiants</p>
                                    <h3 className="text-3xl font-bold mt-1">{statistiques.etudiants}</h3>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                                    <User className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Utilisateurs actifs</p>
                                    <h3 className="text-3xl font-bold mt-1">{statistiques.actifs}</h3>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                                    <UserCheck className="h-6 w-6 text-emerald-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle>Liste des utilisateurs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <Input placeholder="Rechercher un utilisateur..." className="pl-10" />
                            </div>
                            <div className="flex gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                                            <Filter size={16} />
                                            <span>Rôle</span>
                                            <ChevronDown size={16} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>Tous les rôles</DropdownMenuItem>
                                        <DropdownMenuItem>Enseignants</DropdownMenuItem>
                                        <DropdownMenuItem>Étudiants</DropdownMenuItem>
                                        <DropdownMenuItem>Administrateurs</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                                            <Filter size={16} />
                                            <span>Statut</span>
                                            <ChevronDown size={16} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>Tous les statuts</DropdownMenuItem>
                                        <DropdownMenuItem>Actifs</DropdownMenuItem>
                                        <DropdownMenuItem>Inactifs</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Button variant="outline">
                                    <Download size={16} className="mr-2" />
                                    Exporter
                                </Button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Utilisateur</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Rôle</TableHead>
                                        <TableHead>Promotion</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead>Dernière connexion</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {utilisateurs.map((utilisateur:any) => (
                                        <TableRow key={utilisateur.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage
                                                            src={utilisateur.avatar || "/placeholder.svg"}
                                                            alt={`${utilisateur.prenom} ${utilisateur.nom}`}
                                                        />
                                                        <AvatarFallback>
                                                            {utilisateur.prenom[0]}
                                                            {utilisateur.nom[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">
                                                            {utilisateur.prenom} {utilisateur.nom}
                                                        </p>
                                                        <p className="text-sm text-gray-500">Créé le {utilisateur.dateCreation}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{utilisateur.email}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        utilisateur.role === "Administrateur"
                                                            ? "destructive"
                                                            : utilisateur.role === "TEACHER"
                                                                ? "default"
                                                                : "secondary"
                                                    }
                                                >
                                                    {utilisateur.role === "TEACHER"
                                                        ? "Enseignant"
                                                        : utilisateur.role === "STUDENT"
                                                            ? "Étudiant"
                                                            : utilisateur.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{utilisateur.promotion || "-"}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {utilisateur.statut === "Actif" ? (
                                                        <UserCheck className="h-4 w-4 text-green-500" />
                                                    ) : (
                                                        <UserX className="h-4 w-4 text-red-500" />
                                                    )}
                                                    <Badge variant={utilisateur.statut === "Actif" ? "secondary" : "destructive"}>
                                                        {utilisateur.statut}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell>{utilisateur.derniereConnexion}</TableCell>
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
                                                            <Link href={`/utilisateur/${utilisateur.id}`} className="flex items-center">
                                                                <Eye size={16} className="mr-2" />
                                                                Voir détails
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/utilisateur/${utilisateur.id}/edit`} className="flex items-center">
                                                                <User size={16} className="mr-2" />
                                                                Modifier
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <a href={`mailto:${utilisateur.email}`} className="flex items-center">
                                                                <Mail size={16} className="mr-2" />
                                                                Envoyer un email
                                                            </a>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600 flex items-center">
                                                            <Trash size={16} className="mr-2" />
                                                            Supprimer
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
