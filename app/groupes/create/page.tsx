"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Filter,
  Info,
  Loader2,
  ShuffleIcon as Random,
  Search,
  Trash,
  Users,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

export default function CreationGroupesPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("manuel")
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [groupSize, setGroupSize] = useState(4)
  const [balanceGroups, setBalanceGroups] = useState(true)
  const [createdGroups, setCreatedGroups] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPromotion, setSelectedPromotion] = useState("")
  const [selectedProjet, setSelectedProjet] = useState("")
  const [groupingCriteria, setGroupingCriteria] = useState("aleatoire")

  // Simulation de données pour les promotions, projets et étudiants
  const promotions = [
    { id: "1", nom: "Master 2 Informatique" },
    { id: "2", nom: "Licence 3 Informatique" },
    { id: "3", nom: "Master 1 IA" },
  ]

  const projets = [
    { id: "1", nom: "Projet Web Full Stack", promotion: "Master 2 Informatique" },
    { id: "2", nom: "Application Mobile", promotion: "Licence 3 Informatique" },
    { id: "3", nom: "Intelligence Artificielle", promotion: "Master 1 IA" },
  ]

  const etudiants = [
    {
      id: "1",
      nom: "Jean Dupont",
      email: "jean.dupont@example.com",
      promotion: "Master 2 Informatique",
      competences: ["React", "Node.js"],
      niveau: "Avancé",
    },
    {
      id: "2",
      nom: "Marie Martin",
      email: "marie.martin@example.com",
      promotion: "Master 2 Informatique",
      competences: ["Angular", "Java"],
      niveau: "Intermédiaire",
    },
    {
      id: "3",
      nom: "Lucas Bernard",
      email: "lucas.bernard@example.com",
      promotion: "Master 2 Informatique",
      competences: ["Python", "Django"],
      niveau: "Avancé",
    },
    {
      id: "4",
      nom: "Sophie Petit",
      email: "sophie.petit@example.com",
      promotion: "Master 2 Informatique",
      competences: ["UI/UX", "Figma"],
      niveau: "Expert",
    },
    {
      id: "5",
      nom: "Thomas Leroy",
      email: "thomas.leroy@example.com",
      promotion: "Master 2 Informatique",
      competences: ["PHP", "Laravel"],
      niveau: "Intermédiaire",
    },
    {
      id: "6",
      nom: "Emma Moreau",
      email: "emma.moreau@example.com",
      promotion: "Master 2 Informatique",
      competences: ["JavaScript", "Vue.js"],
      niveau: "Avancé",
    },
    {
      id: "7",
      nom: "Hugo Dubois",
      email: "hugo.dubois@example.com",
      promotion: "Master 2 Informatique",
      competences: ["C#", ".NET"],
      niveau: "Débutant",
    },
    {
      id: "8",
      nom: "Léa Richard",
      email: "lea.richard@example.com",
      promotion: "Master 2 Informatique",
      competences: ["Java", "Spring"],
      niveau: "Intermédiaire",
    },
    {
      id: "9",
      nom: "Nathan Simon",
      email: "nathan.simon@example.com",
      promotion: "Master 2 Informatique",
      competences: ["React Native", "Firebase"],
      niveau: "Avancé",
    },
    {
      id: "10",
      nom: "Camille Roux",
      email: "camille.roux@example.com",
      promotion: "Master 2 Informatique",
      competences: ["DevOps", "Docker"],
      niveau: "Expert",
    },
    {
      id: "11",
      nom: "Maxime Lefebvre",
      email: "maxime.lefebvre@example.com",
      promotion: "Master 2 Informatique",
      competences: ["Data Science", "Python"],
      niveau: "Avancé",
    },
    {
      id: "12",
      nom: "Chloé Mercier",
      email: "chloe.mercier@example.com",
      promotion: "Master 2 Informatique",
      competences: ["Mobile", "Flutter"],
      niveau: "Intermédiaire",
    },
  ]

  const filteredEtudiants = etudiants.filter(
    (etudiant) =>
      etudiant.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      etudiant.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleStudent = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId],
    )
  }

  const handleCreateGroups = () => {
    setIsLoading(true)

    // Simulation de création de groupes
    setTimeout(() => {
      if (activeTab === "manuel") {
        // Création manuelle - utiliser les étudiants sélectionnés
        const selectedStudentsData = etudiants.filter((etudiant) => selectedStudents.includes(etudiant.id))
        setCreatedGroups([
          {
            id: "1",
            nom: "Groupe A",
            membres: selectedStudentsData,
          },
        ])
      } else {
        // Création automatique - générer des groupes selon les critères
        const groupedStudents:any = []
        const studentsToGroup = [...etudiants]
        const numberOfGroups = Math.ceil(studentsToGroup.length / groupSize)

        if (groupingCriteria === "competences") {
          // Regrouper par compétences similaires
          studentsToGroup.sort((a, b) => a.competences[0].localeCompare(b.competences[0]))
        } else if (groupingCriteria === "niveau") {
          // Équilibrer les niveaux dans chaque groupe
          const niveaux = ["Débutant", "Intermédiaire", "Avancé", "Expert"]
          studentsToGroup.sort((a, b) => niveaux.indexOf(a.niveau) - niveaux.indexOf(b.niveau))
        }
        // Sinon, aléatoire (déjà mélangé)

        // Créer les groupes
        for (let i = 0; i < numberOfGroups; i++) {
          groupedStudents.push({
            id: `${i + 1}`,
            nom: `Groupe ${String.fromCharCode(65 + i)}`, // A, B, C, etc.
            membres: [],
          })
        }

        // Distribuer les étudiants dans les groupes
        studentsToGroup.forEach((student, index) => {
          const groupIndex = index % numberOfGroups
          groupedStudents[groupIndex].membres.push(student)
        })

        setCreatedGroups(groupedStudents)
      }

      setIsLoading(false)
    }, 1500)
  }

  const handleSaveGroups = () => {
    setIsLoading(true)

    // Simulation de sauvegarde des groupes
    setTimeout(() => {
      setIsLoading(false)
      router.push("/groupes")
    }, 1500)
  }

  const handleResetGroups = () => {
    setCreatedGroups([])
    setSelectedStudents([])
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
          <h1 className="text-3xl font-bold text-gray-900">Création de groupes</h1>
        </div>

        {createdGroups.length > 0 ? (
          // Affichage des groupes créés
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Groupes créés</CardTitle>
                <CardDescription>
                  {createdGroups.length} groupe{createdGroups.length > 1 ? "s" : ""} créé
                  {createdGroups.length > 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {createdGroups.map((groupe) => (
                    <Card key={groupe.id}>
                      <CardHeader className="pb-2">
                        <CardTitle>{groupe.nom}</CardTitle>
                        <CardDescription>{groupe.membres.length} membres</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {groupe.membres.map((membre: any) => (
                            <div key={membre.id} className="flex items-center justify-between p-2 border rounded-md">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt={membre.nom} />
                                  <AvatarFallback>
                                    {membre.nom
                                      .split(" ")
                                      .map((n: string) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-sm">{membre.nom}</p>
                                  <p className="text-xs text-gray-500">{membre.email}</p>
                                </div>
                              </div>
                              <Badge variant="outline">{membre.niveau}</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleResetGroups}>
                  <Trash className="mr-2 h-4 w-4" />
                  Réinitialiser
                </Button>
                <Button onClick={handleSaveGroups} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Enregistrer les groupes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          // Interface de création de groupes
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de création</CardTitle>
                <CardDescription>Définissez les paramètres pour la création des groupes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="promotion">Promotion</Label>
                    <Select value={selectedPromotion} onValueChange={setSelectedPromotion}>
                      <SelectTrigger id="promotion">
                        <SelectValue placeholder="Sélectionner une promotion" />
                      </SelectTrigger>
                      <SelectContent>
                        {promotions.map((promotion) => (
                          <SelectItem key={promotion.id} value={promotion.id}>
                            {promotion.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="projet">Projet</Label>
                    <Select value={selectedProjet} onValueChange={setSelectedProjet}>
                      <SelectTrigger id="projet">
                        <SelectValue placeholder="Sélectionner un projet" />
                      </SelectTrigger>
                      <SelectContent>
                        {projets.map((projet) => (
                          <SelectItem key={projet.id} value={projet.id}>
                            {projet.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manuel">Création manuelle</TabsTrigger>
                <TabsTrigger value="automatique">Création automatique</TabsTrigger>
              </TabsList>

              <TabsContent value="manuel" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sélection des étudiants</CardTitle>
                    <CardDescription>Sélectionnez les étudiants qui feront partie du même groupe</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                      <div className="relative flex-1">
                        <Search
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        <Input
                          placeholder="Rechercher un étudiant..."
                          className="pl-10"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="flex items-center gap-2">
                            <Filter size={16} />
                            <span>Filtrer</span>
                            <ChevronDown size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Tous les étudiants</DropdownMenuItem>
                          <DropdownMenuItem>Sans groupe</DropdownMenuItem>
                          <DropdownMenuItem>Par niveau</DropdownMenuItem>
                          <DropdownMenuItem>Par compétence</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
                            <TableHead>Niveau</TableHead>
                            <TableHead>Compétences</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredEtudiants.map((etudiant) => (
                            <TableRow key={etudiant.id}>
                              <TableCell>
                                <Checkbox
                                  checked={selectedStudents.includes(etudiant.id)}
                                  onCheckedChange={() => toggleStudent(etudiant.id)}
                                />
                              </TableCell>
                              <TableCell className="font-medium">{etudiant.nom}</TableCell>
                              <TableCell>{etudiant.email}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    etudiant.niveau === "Expert"
                                      ? "default"
                                      : etudiant.niveau === "Avancé"
                                        ? "secondary"
                                        : "outline"
                                  }
                                >
                                  {etudiant.niveau}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {etudiant.competences.map((competence, index) => (
                                    <Badge key={index} variant="outline" className="mr-1">
                                      {competence}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        {selectedStudents.length} étudiant{selectedStudents.length > 1 ? "s" : ""} sélectionné
                        {selectedStudents.length > 1 ? "s" : ""}
                      </div>
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
                    <Button
                      onClick={handleCreateGroups}
                      disabled={isLoading || selectedStudents.length === 0 || !selectedProjet}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Création en cours...
                        </>
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

              <TabsContent value="automatique" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Génération automatique</CardTitle>
                    <CardDescription>Définissez les critères pour générer automatiquement les groupes</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="taille-groupe" className="mb-2 block">
                          Taille des groupes: {groupSize} étudiant{groupSize > 1 ? "s" : ""}
                        </Label>
                        <Slider
                          id="taille-groupe"
                          min={2}
                          max={6}
                          step={1}
                          value={[groupSize]}
                          onValueChange={(value) => setGroupSize(value[0])}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Avec cette taille, vous aurez environ {Math.ceil(etudiants.length / groupSize)} groupes.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label className="mb-2 block">Critère de regroupement</Label>
                        <RadioGroup value={groupingCriteria} onValueChange={setGroupingCriteria}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="aleatoire" id="aleatoire" />
                            <Label htmlFor="aleatoire">Aléatoire</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="competences" id="competences" />
                            <Label htmlFor="competences">Par compétences similaires</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="niveau" id="niveau" />
                            <Label htmlFor="niveau">Équilibrer les niveaux</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="flex items-center space-x-2 pt-2">
                        <Switch id="balance-groupes" checked={balanceGroups} onCheckedChange={setBalanceGroups} />
                        <Label htmlFor="balance-groupes">Équilibrer la taille des groupes</Label>
                        <div className="relative ml-1 cursor-help">
                          <Info size={14} className="text-gray-400" />
                          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-64 p-2 bg-gray-800 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                            Assure que tous les groupes ont approximativement le même nombre d'étudiants.
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" type="button" asChild>
                      <Link href="/groupes">Annuler</Link>
                    </Button>
                    <Button onClick={handleCreateGroups} disabled={isLoading || !selectedProjet}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Génération en cours...
                        </>
                      ) : (
                        <>
                          <Random className="mr-2 h-4 w-4" />
                          Générer les groupes
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
