"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Upload, Users } from "lucide-react"
import Link from "next/link"
import {CreatePromotion, Promotion} from "@/lib/types/promotion"
import { createPromotion } from "@/lib/services/promotionService"

export default function NouvellePromotionPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("informations")
  const [file, setFile] = useState<File | null>(null)
  const [promotion, setPromotion] = useState<CreatePromotion>({
    name: "",
    startYear: new Date(),
    endYear: new Date(),
    createdAt: new Date()
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      console.error("No file selected")
      return
    }
    setIsLoading(true)

    try {      
      const response = await createPromotion(promotion, file);
  
      if (response) {
        console.log("✅ Promotion créée :", response);
        router.push("/promotions");
      } else {
        console.error("❌ Erreur lors de la création de la promotion");
      }
    } catch (error) {
      console.error("❌ Erreur réseau :", error);
    } finally {
      setIsLoading(false); // ✅ Arrêter le chargement après le traitement
    }

  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" asChild>
            <Link href="/promotions">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Nouvelle promotion</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="informations">Informations</TabsTrigger>
              <TabsTrigger value="etudiants">Étudiants</TabsTrigger>
            </TabsList>

            <TabsContent value="informations" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations de la promotion</CardTitle>
                  <CardDescription>Renseignez les informations générales de la promotion</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom de la promotion</Label>
                    <Input 
                      id="nom" 
                      value={promotion?.name} 
                      placeholder="Ex: Master 2 Informatique" 
                      required
                      onChange={(e) => {
                        setPromotion((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="annee">Début Année académique</Label>
                    <Input id="annee" value={promotion?.startYear ? 
                      new Date(promotion.startYear).toISOString().split("T")[0] : ""} 
                      placeholder="Ex: 2023-09-01" 
                      required 
                      type="date"
                      onChange={(e) => {
                          setPromotion((prev) => ({
                            ...prev,
                            startYear: new Date(e.target.value),
                          }))
                        }
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="annee">Fin  Année académique</Label>
                    <Input 
                      id="annee" 
                      value={promotion?.startYear ? 
                      new Date(promotion.endYear).toISOString().split("T")[0] : ""} 
                      placeholder="Ex: 2024-09-01" 
                      required 
                      type="date"
                      onChange={(e) => {
                        setPromotion((prev) => ({
                          ...prev,
                          endYear: new Date(e.target.value),
                        }))
                      }
                    }
                    />
                  </div>

                  {/* <div className="space-y-2">
                    <Label htmlFor="description">Description (optionnelle)</Label>
                    <Textarea id="description" placeholder="Description de la promotion..." rows={4} />
                  </div> */}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" asChild>
                    <Link href="/promotions">Annuler</Link>
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("etudiants")}>
                    Continuer
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="etudiants" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ajouter des étudiants</CardTitle>
                  <CardDescription>Ajoutez des étudiants à la promotion</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <div className="flex flex-col items-center">
                        <Upload className="h-10 w-10 text-gray-400 mb-2" />
                        <h3 className="text-lg font-medium">Importer un fichier</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Glissez-déposez un fichier CSV ou JSON, ou cliquez pour parcourir
                        </p>
                        <Button variant="outline" className="mt-4"
                          onClick={() => {
                            const input = document.createElement("input")
                            input.type = "file"
                            input.accept = ".csv, .json"
                            input.onchange = (e) => {
                              const target = e.target as HTMLInputElement
                              if (target.files && target.files.length > 0) {
                                const selectedFile = target.files[0]
                                console.log("selectedFile", selectedFile)
                                setFile(selectedFile)
                              }
                            }
                            input.click()
                          }}
                        >
                          Parcourir
                        </Button>
                        <p className="text-xs text-gray-500 mt-2">Formats supportés: CSV, JSON (max 5MB)</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {/* <Label htmlFor="etudiants">Ou ajoutez manuellement</Label> */}
                      {/* <Textarea id="etudiants" placeholder="Entrez les emails des étudiants, un par ligne" rows={6} /> */}
                      <p className="text-xs text-gray-500">
                        Les comptes seront automatiquement créés et les étudiants recevront un email d'invitation.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" onClick={() => setActiveTab("informations")}>
                    Retour
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>Création en cours...</>
                    ) : (
                      <>
                        <Users className="mr-2 h-4 w-4" />
                        Créer la promotion
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
