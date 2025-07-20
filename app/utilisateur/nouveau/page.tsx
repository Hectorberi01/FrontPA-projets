"use client"

import React, {useEffect} from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, User } from "lucide-react"
import Link from "next/link"
import { getWithoutStudentPromotions} from "@/lib/services/promotionService";
import {CreateUser} from "@/lib/services/userService";
import Swal from "sweetalert2";


interface createUser {
    prenom: string;
    nom: string;
    email: string;
    telephone?: string;
    adresse?: string;
    roleId: string;
    promotionId?: string;
    statut: boolean;
}

export default function NouvelUtilisateurPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState("informations")
    const [promotions, setPromotions] = useState<any[]>([])
    const [formData, setFormData] = useState<createUser>({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        adresse: "",
        roleId: "",
        promotionId: "",
        statut: true,
    })

    const roles = [
        { id: "1", nom: "STUDENT" },
        { id: "2", nom: "TEACHER" },
    ]


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const result = await CreateUser(formData)
        if(!result){
            Swal.fire({
                title: "error",
                icon: "error",
                draggable: true
            })
        }

        Swal.fire({
            title: "success",
            icon: "success",
            draggable: true
        })
        setTimeout(() => {
             setIsLoading(false)
             router.push("/utilisateur")
        }, 5000)
    }

    useEffect(() => {
        const fecthPromotions = async ()=>{
            const promotions = await getWithoutStudentPromotions()
            setPromotions(promotions)
        }
        fecthPromotions()
    },[])

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/utilisateurs">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900">Nouvel utilisateur</h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-1 max-w-md">
                            <TabsTrigger value="informations">Informations</TabsTrigger>
                        </TabsList>

                        <TabsContent value="informations" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informations personnelles</CardTitle>
                                    <CardDescription>Renseignez les informations de base de l'utilisateur</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="prenom">Prénom</Label>
                                            <Input id="prenom" name="prenom" value={formData?.prenom} onChange={handleInputChange} required />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="nom">Nom</Label>
                                            <Input id="nom" name="nom" value={formData?.nom} onChange={handleInputChange} required />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData?.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="telephone">Téléphone (optionnel)</Label>
                                            <Input id="telephone" name="telephone" value={formData?.telephone} onChange={handleInputChange} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="role">Rôle</Label>
                                            <Select value={formData?.roleId} onValueChange={(value) => handleSelectChange("roleId", value)}>
                                                <SelectTrigger id="role">
                                                    <SelectValue placeholder="Sélectionner un rôle" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {roles.map((role) => (
                                                        <SelectItem key={role.id} value={role.id}>
                                                            {role.nom}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {formData?.roleId === "1" && (
                                        <div className="space-y-2">
                                            <Label htmlFor="promotion">Promotion</Label>
                                            <Select
                                                value={formData?.promotionId?.toString()}
                                                onValueChange={(value) => handleSelectChange("promotionId", value)}
                                            >
                                                <SelectTrigger id="promotion">
                                                    <SelectValue placeholder="Sélectionner une promotion" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {promotions.map((promotion) => (
                                                        <SelectItem key={promotion.id} value={promotion.id.toString()}>
                                                            {promotion.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label htmlFor="adresse">Adresse (optionnelle)</Label>
                                        <Textarea
                                            id="adresse"
                                            name="adresse"
                                            value={formData?.adresse}
                                            onChange={handleInputChange}
                                            rows={3}
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button variant="outline" type="button" onClick={() => setActiveTab("compte")}>
                                        Retour
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isLoading || !formData?.prenom || !formData?.nom || !formData?.email || !formData?.roleId}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Création en cours...
                                            </>
                                        ) : (
                                            <>
                                                <User className="mr-2 h-4 w-4" />
                                                Créer l'utilisateur
                                            </>
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </form>
            </div>
        </DashboardLayout>
    )
}
