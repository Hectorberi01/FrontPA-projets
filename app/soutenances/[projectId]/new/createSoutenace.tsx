"use client"
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, ArrowLeft, Save, Plus } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {DashboardLayout} from "@/components/layout/dashboard-layout";
import {addSoutenance} from "@/lib/services/project";

// Données mockées pour le projet
const mockProjectData = {
    id: 1,
    nom: "Projet Innovation 2024",
    description: "Développement d'une application mobile innovante",
    promotion: "Master 1 Informatique",
    enseignantResponsable: "Dr. Martin Dupont",
}

interface PageProps {
    params: {
        projectId: string
    }
}

interface SoutenanceForm {
    soutenanceDate: Date,
    soutenanceDuration: number
    lieuSoutenance: string
}

interface Props {
    projectId: string;
}
export default function CreerSoutenancePage({projectId}: Props) {

    const router = useRouter()
    const projet = mockProjectData

    const [formData, setFormData] = useState<SoutenanceForm>({
        soutenanceDate:new Date(),
        soutenanceDuration: 0,
        lieuSoutenance: "",
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleInputChange = (field: keyof SoutenanceForm, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulation d'envoi des données
       const response = await addSoutenance(parseInt(projectId),formData)
        if (!response.ok) {
            console.error(response.error)
        }

        // Redirection vers la page du projet
        router.push(`/projets/${projectId}`)
    }

    return (
        <DashboardLayout>
        <div className="container mx-auto p-6 max-w-2xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link href={`/projets/${projectId}`}>
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Retour
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Plus className="h-8 w-8" />
                        Créer une soutenance
                    </h1>
                    {/*<p className="text-muted-foreground">*/}
                        Projet : <Badge variant="secondary">{projet.nom}</Badge>
                    {/*</p>*/}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Informations de la soutenance</CardTitle>
                        <CardDescription>Renseignez les informations principales de la soutenance</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Date de soutenance */}
                        <div>
                            <Label>Date de soutenance *</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.soutenanceDate ? (
                                            format(formData.soutenanceDate, "PPP", { locale: fr })
                                        ) : (
                                            <span>Sélectionner une date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={formData.soutenanceDate}
                                        onSelect={(date) => handleInputChange("soutenanceDate", date)}
                                        disabled={(date) => date < new Date()}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Durée de soutenance */}
                        <div>
                            <Label htmlFor="soutenanceDuration">Durée de soutenance (minutes) *</Label>
                            <Input
                                id="soutenanceDuration"
                                type="number"
                                min="1"
                                value={formData.soutenanceDuration || ""}
                                onChange={(e) => handleInputChange("soutenanceDuration", Number.parseInt(e.target.value) || 0)}
                                placeholder="Ex: 120"
                                required
                            />
                        </div>

                        {/* Lieu de soutenance */}
                        <div>
                            <Label htmlFor="lieuSoutenance">Lieu de soutenance *</Label>
                            <Input
                                id="lieuSoutenance"
                                value={formData.lieuSoutenance}
                                onChange={(e) => handleInputChange("lieuSoutenance", e.target.value)}
                                placeholder="Ex: Amphithéâtre A, Salle 101..."
                                required
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Boutons d'action */}
                <div className="flex justify-end gap-4">
                    <Link href={`/projets/${projectId}`}>
                        <Button variant="outline" type="button">
                            Annuler
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        disabled={
                            isSubmitting || !formData.soutenanceDate || !formData.soutenanceDuration || !formData.lieuSoutenance
                        }
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                Création en cours...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Créer la soutenance
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
        </DashboardLayout>
    )
}
