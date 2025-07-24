"use client"

import React, {useEffect} from "react"

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
import { use } from 'react'
import {joinTogroup} from "@/lib/services/groupe";
import Swal from "sweetalert2";

export default function RejoindreGroupePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [project, setProject] = useState<any>()
  const [userId, setUserId] = useState<number | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("selectedProject");
    if (stored) {
      const project = JSON.parse(stored);
      console.log("project", project);
      setProject(project);
    }
    const userStore = localStorage.getItem("user");
    if(userStore){
      const user = JSON.parse(userStore);
      console.log("user", user);
     // const userId  = user.user.id;
      const userId  = user.id;
      
     setUserId(userId);
    }

    localStorage.removeItem("selectedProject");
  }, []);

  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedGroup) return

    console.log("selectedGroup", selectedGroup)
    setIsLoading(true)
    try {
      if(!userId) return
      const response = await joinTogroup(parseInt(selectedGroup),userId)
      console.log("joinGroup", response)
      if(response){
        Swal.fire({
          title: "success",
          icon: "success",
          draggable: true
        })
      }else{
        Swal.fire({
          title: "error",
          icon: "error",
          draggable: true
        })
      }
    }catch (error) {
      console.error(error)
    }

    // Simulation de rejoindre un groupe
    setTimeout(() => {
      setIsLoading(false)
      router.push(`/student/projets/${id}`)
      //window.location.reload()
    }, 1500)
  }

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulation de création de groupe
    setTimeout(() => {
      setIsLoading(false)
      router.push(`/student/projets/${id}`)
    }, 1500)
  }

  return (
    <StudentLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/student/projets/${id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Rejoindre un groupe</h1>
        </div>

        <Tabs defaultValue="rejoindre" className="w-full max-w-3xl mx-auto">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="rejoindre">Rejoindre un groupe existant</TabsTrigger>
            {/*<TabsTrigger value="creer">Créer un nouveau groupe</TabsTrigger>*/}
          </TabsList>

          <TabsContent value="rejoindre" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Groupes disponibles</CardTitle>
                <CardDescription>Sélectionnez un groupe à rejoindre pour le projet {project?.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleJoinGroup}>
                  <RadioGroup value={selectedGroup || ""} onValueChange={setSelectedGroup} >
                    <div className="space-y-4">
                      {project?.groups.map((groupe:any) => (
                        <div
                          key={groupe.id}
                          className={`border rounded-lg p-4 transition-colors ${
                            selectedGroup === groupe.id ? "border-primary bg-primary/5" : ""
                          }`}
                        >
                          <div className="flex items-start">
                            <RadioGroupItem value={groupe.id} id={`groupe-${groupe.id}`} className="mt-1" disabled={project.maxStudents - groupe.groupStudent.length == 0}/>
                            <div className="ml-3 flex-1">
                              <Label
                                htmlFor={`groupe-${groupe.id}`}
                                className="text-base font-medium flex items-center justify-between"
                              >
                                {groupe.name}
                                {/*<span className="text-sm font-normal text-gray-500">*/}
                                {/*  {groupe.places} place{groupe.places > 1 ? "s" : ""} disponible*/}
                                {/*  {groupe.places > 1 ? "s" : ""}*/}
                                {/*</span>*/}
                                {groupe && (
                                    <span className="text-sm font-normal text-gray-500">
                                      {project.maxStudents - groupe.groupStudent.length} place
                                      {project.maxStudents - groupe.groupStudent.length > 1 ? "s" : ""} disponible
                                    </span>
                                )}
                              </Label>
                              <div className="mt-2">
                                <p className="text-sm text-gray-500 mb-2">Membres actuels:</p>
                                <div className="space-y-1">
                                  {groupe.groupStudent.map((membre: any) => (
                                      <div key={membre.id} className="text-sm flex justify-between">
                                        <span>{membre.student?.nom} {membre.student?.prenom}</span>
                                        <span className="text-gray-500">{membre.student?.role?.name}</span>
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
                  <Link href={`/student/projets/${id}`}>Annuler</Link>
                </Button>
                <Button type="submit" onClick={handleJoinGroup} disabled={isLoading || !selectedGroup}>
                  {isLoading ? "Traitement en cours..." : "Rejoindre le groupe"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StudentLayout>
  )
}
