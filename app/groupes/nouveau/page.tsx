"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Search, Trash, Users } from "lucide-react"
import Link from "next/link"

export default function NouveauGroupePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])

  // Simulation de données pour les projets et les étudiants
  const projets = [
    { id: "1", nom: "Projet Web Full Stack", promotion: "Master 2 Informatique" },
    { id: "2", nom: "Application Mobile", promotion: "Licence 3 Informatique" },
    { id: "3", nom: "Intelligence Artificielle", promotion: "Master 1 IA" },
  ]

  const etudiants = [
    { id: "1", nom: "Jean Dupont", email: "jean.dupont@example.com", promotion: "Master 2 Informatique" },
    { id: "2", nom: "Marie Martin", email: "marie.martin@example.com", promotion: "Master 2 Informatique" },
    { id: "3", nom: "Lucas Bernard", email: "lucas.bernard@example.com", promotion: "Master 2 Informatique" },
    { id: "4", nom: "Sophie Petit", email: "sophie.petit@example.com", promotion: "Master 2 Informatique" },
    { id: "5", nom: "Thomas Leroy", email: "thomas.leroy@example.com", promotion: "Master 2 Informatique" },
    { id: "6", nom: "Emma Moreau", email: "emma.moreau@example.com", promotion: "Master 2 Informatique" },
    { id: "7", nom: "Hugo Dubois", email: "hugo.dubois@example.com", promotion: "Master 2 Informatique" },
    { id: "8", nom: "Léa Richard", email: "lea.richard@example.com", promotion: "Master 2 Informatique" },
  ]

  const toggleStudent = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId],
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulation de création de groupe
    setTimeout(() => {
      setIsLoading(false)
      router.push("/groupes")
    }, 1500)
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" asChild>
            <Link href="/groupes">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Nouveau groupe</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Informations du groupe</CardTitle>
                <CardDescription>Définissez les informations de base du groupe</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom du groupe</Label>
                  <Input id="nom" placeholder="Ex: Groupe A" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projet">Projet</Label>
                  <Select>
                    <SelectTrigger id="projet">
                      <SelectValue placeholder="Sélectionner un projet" />
                    </SelectTrigger>
                    <SelectContent>
                      {projets.map((projet) => (
                        <SelectItem key={projet.id} value={projet.id}>
                          {projet.nom} ({projet.promotion})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Membres du groupe</CardTitle>
                <CardDescription>Sélectionnez les étudiants qui feront partie de ce groupe</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input placeholder="Rechercher un étudiant..." className="pl-10" />
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <span className="sr-only">Sélection</span>
                        </TableHead>
                        <TableHead>Nom</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Promotion</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {etudiants.map((etudiant) => (
                        <TableRow key={etudiant.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedStudents.includes(etudiant.id)}
                              onCheckedChange={() => toggleStudent(etudiant.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{etudiant.nom}</TableCell>
                          <TableCell>{etudiant.email}</TableCell>
                          <TableCell>{etudiant.promotion}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-500">{selectedStudents.length} étudiant(s) sélectionné(s)</div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedStudents([])}
                    disabled={selectedStudents.length === 0}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Effacer la sélection
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" asChild>
                  <Link href="/groupes">Annuler</Link>
                </Button>
                <Button type="submit" disabled={isLoading || selectedStudents.length === 0}>
                  {isLoading ? (
                    <>Création en cours...</>
                  ) : (
                    <>
                      <Users className="mr-2 h-4 w-4" />
                      Créer le groupe
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
