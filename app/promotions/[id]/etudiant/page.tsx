"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {  ArrowLeft, Save, UserPlus } from "lucide-react"
import Link from "next/link"
import { useRouter,useParams } from "next/navigation"
import {DashboardLayout} from "@/components/layout/dashboard-layout";
import {addStudentToPromotion} from "@/lib/services/promotionService";

// Données mockées pour la promotion
const mockPromotionData = {
    id: 1,
    nom: "Promotion 2024 - Informatique",
    annee: "2024",
    specialite: "Informatique",
    niveau: "Master 1",
}

interface PageProps {
    params: {
        id: string
    }
}

interface EtudiantForm {
    nom: string
    prenom: string
    email: string
    roleId: number
}

export default function AjouterEtudiantPage() {
    const params = useParams();
    const id = params?.id;
    const router = useRouter()
    const promotion = mockPromotionData

    const [formData, setFormData] = useState<EtudiantForm>({
        nom: "",
        prenom: "",
        email: "",
        roleId: 2
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [photoPreview, setPhotoPreview] = useState<string | null>(null)

    const handleInputChange = (field: keyof EtudiantForm, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setFormData((prev) => ({ ...prev, photo: file }))

            // Créer une preview
            const reader = new FileReader()
            reader.onload = (e) => {
                setPhotoPreview(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        console.log("formData", formData)
        // Simulation d'envoi des données
        await new Promise((resolve) => setTimeout(resolve, 2000))
        try {
            const promotionId =parseInt(params.id as string);
            console.log("promotionId", promotionId);
            const newStudent = await addStudentToPromotion(promotionId,formData);
            if(newStudent != undefined && newStudent.status != 200) {
                throw new Error("error")
            }
        }catch (e) {
            console.log(e)
        }
        router.push(`/promotions/${id}`)
    }
    return (
        <DashboardLayout>
        <div className="container mx-auto p-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link href={`/promotions/${id}`}>
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Retour
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <UserPlus className="h-8 w-8" />
                        Ajouter un étudiant
                    </h1>
                    {/*<p className="text-muted-foreground">*/}
                    {/*    Promotion : <Badge variant="secondary">{promotion?.nom}</Badge>*/}
                    {/*</p>*/}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informations personnelles */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informations personnelles</CardTitle>
                        <CardDescription>Renseignez les informations personnelles de l'étudiant</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Photo de profil */}
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={photoPreview || "/placeholder.svg"} />
                                <AvatarFallback>
                                    {formData.prenom[0]}
                                    {formData.nom[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <Label htmlFor="photo">Photo de profil</Label>
                                <Input id="photo" type="file" accept="image/*" onChange={handlePhotoChange} className="mt-1" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="nom">Nom *</Label>
                                <Input
                                    id="nom"
                                    value={formData.nom}
                                    onChange={(e) => handleInputChange("nom", e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="prenom">Prénom *</Label>
                                <Input
                                    id="prenom"
                                    value={formData.prenom}
                                    onChange={(e) => handleInputChange("prenom", e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {/* Boutons d'action */}
                <div className="flex justify-end gap-4">
                    <Link href={`/promotions/${id}`}>
                        <Button variant="outline" type="button">
                            Annuler
                        </Button>
                    </Link>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                Ajout en cours...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Ajouter l'étudiant
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
        </DashboardLayout>
    )
}
