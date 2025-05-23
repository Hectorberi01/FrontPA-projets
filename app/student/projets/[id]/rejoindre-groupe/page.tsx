"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { StudentLayout } from "@/components/layout/student-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Users } from "lucide-react"
import Link from "next/link"

export default function RejoindreGroupePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)

  // Simulation de données pour les groupes disponibles
  const projet = {
    id: Number.parseInt(params.id),
    nom: "Projet Web Full Stack",
    groupes: [
      {
        id: "1",
        nom: "Groupe A",
        membres: [
          { id: 1, nom: "Marie Martin", role: "Chef de projet" },
          { id: 2, nom: "Lucas Bernard", role: "Développeur Backend" },
        ],
        places: 2,
      },
      {
        id: "2",
        nom: "Groupe B",
        membres: [
          { id: 3, nom: "Sophie Petit", role: "Designer UI/UX" },
          { id: 4, nom: "Thomas Leroy", role: "Développeur Frontend" },
          { id: 5, nom: "Emma Moreau", role: "Développeur Backend" },
        ],
        places: 1,
      },
    ],
  }

  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedGroup) return

    setIsLoading(true)

    // Simulation de rejoindre un groupe
    setTimeout(() => {
      setIsLoading(false)
      router.push(`/student/projets/${params.id}`)
    }, 1500)
  }

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulation de création de groupe
    setTimeout(() => {
      setIsLoading(false)
      router.push(`/student/projets/${params.id}`)
    }, 1500)
  }

  return (
    <StudentLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/student/projets/${params.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Rejoindre un groupe</h1>
        </div>

        <Tabs defaultValue="rejoindre" className="w-full max-w-3xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rejoindre">Rejoindre un groupe existant</TabsTrigger>
            <TabsTrigger value="creer">Créer un nouveau groupe</TabsTrigger>
          </TabsList>

          <TabsContent value="rejoindre" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Groupes disponibles</CardTitle>
                <CardDescription>Sélectionnez un groupe à rejoindre pour le projet {projet.nom}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleJoinGroup}>
                  <RadioGroup value={selectedGroup || ""} onValueChange={setSelectedGroup}>
                    <div className="space-y-4">
                      {projet.groupes.map((groupe) => (
                        <div
                          key={groupe.id}
                          className={`border rounded-lg p-4 transition-colors ${
                            selectedGroup === groupe.id ? "border-primary bg-primary/5" : ""
                          }`}
                        >
                          <div className="flex items-start">
                            <RadioGroupItem value={groupe.id} id={`groupe-${groupe.id}`} className="mt-1" />
                            <div className="ml-3 flex-1">
                              <Label
                                htmlFor={`groupe-${groupe.id}`}
                                className="text-base font-medium flex items-center justify-between"
                              >
                                {groupe.nom}
                                <span className="text-sm font-normal text-gray-500">
                                  {groupe.places} place{groupe.places > 1 ? "s" : ""} disponible
                                  {groupe.places > 1 ? "s" : ""}
                                </span>
                              </Label>
                              <div className="mt-2">
                                <p className="text-sm text-gray-500 mb-2">Membres actuels:</p>
                                <div className="space-y-1">
                                  {groupe.membres.map((membre) => (
                                    <div key={membre.id} className="text-sm flex justify-between">
                                      <span>{membre.nom}</span>
                                      <span className="text-gray-500">{membre.role}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" asChild>
                  <Link href={`/student/projets/${params.id}`}>Annuler</Link>
                </Button>
                <Button type="submit" onClick={handleJoinGroup} disabled={isLoading || !selectedGroup}>
                  {isLoading ? "Traitement en cours..." : "Rejoindre le groupe"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="creer" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Créer un nouveau groupe</CardTitle>
                <CardDescription>Créez votre propre groupe pour le projet {projet.nom}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateGroup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nom-groupe">Nom du groupe</Label>
                    <Input id="nom-groupe" placeholder="Ex: Groupe D" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Votre rôle dans le groupe</Label>
                    <Input id="role" placeholder="Ex: Chef de projet" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (optionnelle)</Label>
                    <Input id="description" placeholder="Une brève description de votre groupe" />
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" asChild>
                  <Link href={`/student/projets/${params.id}`}>Annuler</Link>
                </Button>
                <Button type="submit" onClick={handleCreateGroup} disabled={isLoading}>
                  {isLoading ? (
                    "Création en cours..."
                  ) : (
                    <>
                      <Users className="mr-2 h-4 w-4" />
                      Créer le groupe
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StudentLayout>
  )
}
