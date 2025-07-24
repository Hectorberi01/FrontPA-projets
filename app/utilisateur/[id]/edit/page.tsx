"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Loader2, User } from "lucide-react"
import Link from "next/link"
import Swal from "sweetalert2"
import { getUserById, updateUser } from "@/lib/services/userService"
import { getWithoutStudentPromotions } from "@/lib/services/promotionService"

interface EditUser {
    prenom: string;
    nom: string;
    email: string;
    telephone?: string;
    adresse?: string;
    roleId: string;
    promotionId?: string;
    statut: boolean;
}

export default function EditUtilisateurPage() {
    const router = useRouter()
    const params = useParams()
    const userId = params?.id?.toString()

    const [formData, setFormData] = useState<EditUser>({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        adresse: "",
        roleId: "",
        promotionId: "",
        statut: true,
    })
    const [promotions, setPromotions] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const roles = [
        { id: "1", nom: "STUDENT" },
        { id: "2", nom: "TEACHER" },
    ]

    useEffect(() => {
        if (!userId) return;

        const fetchUser = async () => {
            try {
                const user = await getUserById(Number(userId))
                setFormData({
                    prenom: user.prenom || "",
                    nom: user.nom || "",
                    email: user.email || "",
                    telephone: user.telephone || "",
                    adresse: user.adresse || "",
                    roleId: user.roleId?.toString() || "",
                    promotionId: user.promotionId?.toString() || "",
                    statut: user.statut ?? true,
                })
            } catch (err) {
                console.error("Erreur lors du chargement de l'utilisateur", err)
            }
        }

        const fetchPromotions = async () => {
            const result = await getWithoutStudentPromotions()
            setPromotions(result)
        }

        fetchUser()
        fetchPromotions()
    }, [userId])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const result = await updateUser(Number(userId!), formData)

            if (!result) {
                Swal.fire({ title: "Erreur", icon: "error" })
                return
            }

            Swal.fire({ title: "Utilisateur mis à jour ✅", icon: "success" })
            router.push("/utilisateur")
        } catch (err) {
            console.error(err)
            Swal.fire({ title: "Erreur", icon: "error" })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/utilisateur">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900">Modifier l'utilisateur</h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <Tabs defaultValue="informations" className="w-full">
                        <TabsList className="grid w-full grid-cols-1 max-w-md">
                            <TabsTrigger value="informations">Informations</TabsTrigger>
                        </TabsList>

                        <TabsContent value="informations" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Modifier les informations</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="prenom">Prénom</Label>
                                            <Input name="prenom" value={formData.prenom} onChange={handleInputChange} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="nom">Nom</Label>
                                            <Input name="nom" value={formData.nom} onChange={handleInputChange} required />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="telephone">Téléphone</Label>
                                            <Input name="telephone" value={formData.telephone} onChange={handleInputChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="role">Rôle</Label>
                                            <Select value={formData.roleId} onValueChange={(val) => handleSelectChange("roleId", val)}>
                                                <SelectTrigger id="role">
                                                    <SelectValue placeholder="Sélectionner un rôle" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {roles.map((r) => (
                                                        <SelectItem key={r.id} value={r.id}>{r.nom}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {formData.roleId === "1" && (
                                        <div className="space-y-2">
                                            <Label htmlFor="promotionId">Promotion</Label>
                                            <Select value={formData.promotionId ?? ""} onValueChange={(val) => handleSelectChange("promotionId", val)}>
                                                <SelectTrigger id="promotionId">
                                                    <SelectValue placeholder="Sélectionner une promotion" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {promotions.map((promo) => (
                                                        <SelectItem key={promo.id} value={promo.id.toString()}>{promo.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label htmlFor="adresse">Adresse</Label>
                                        <Textarea name="adresse" value={formData.adresse} onChange={handleInputChange} />
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button variant="outline" type="button" onClick={() => router.push("/utilisateur")}>Annuler</Button>
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Sauvegarde...
                                            </>
                                        ) : (
                                            <>
                                                <User className="mr-2 h-4 w-4" />
                                                Enregistrer
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
