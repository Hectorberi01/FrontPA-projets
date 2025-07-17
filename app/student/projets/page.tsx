'use client'
import { StudentLayout } from "@/components/layout/student-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Eye } from "lucide-react"
import Link from "next/link"
import {useEffect, useState} from "react";
import {getPromotionByStudentId} from "@/lib/services/promotionService";
import {useRouter} from "next/navigation";
import {useAuth} from "@/hooks/authContext";

export default function StudentProjetsPage() {
  const [promotions, setPromotion] = useState<any>()
  const router = useRouter()
  const { user, token } = useAuth();


  const fetchProjects = async () => {
    try {
      if (!user) {
        router.push("/");
        return;
      }

      const userId = user.id;
      if (!userId) {
        console.warn("User ID not found in localStorage.");
        return;
      }

      const response = await getPromotionByStudentId(userId);
      console.log(response);
      setPromotion(response || []);
    }catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchProjects()
  },[])
  return (
    <StudentLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes projets</h1>
            <p className="text-gray-600 mt-1">Consultez tous vos projets en cours et à venir</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input placeholder="Rechercher un projet..." className="pl-10" />
          </div>
        </div>

        <div >
          {promotions?.map((promo:any) => (
              <div key={promo.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {promo.projects.map((project:any) => (
                      <Card key={project.id} className="overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{project.name}</CardTitle>
                              <CardDescription className="mt-1">{promo.promotion}</CardDescription>
                            </div>
                            <Badge
                                variant={
                                  project.statut === "En cours" ? "default" : project.statut === "Terminé" ? "secondary" : "outline"
                                }
                            >
                              {project.statut}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>

                          <div className="space-y-2 mb-4">
                            {/*<div className="flex items-center justify-between text-sm">*/}
                            {/*  <span className="text-gray-500">Date de début:</span>*/}
                            {/*  <span className="font-medium">{projet.dateDebut}</span>*/}
                            {/*</div>*/}
                            {/*<div className="flex items-center justify-between text-sm">*/}
                            {/*  <span className="text-gray-500">Date de fin:</span>*/}
                            {/*  <span className="font-medium">{projet.dateFin}</span>*/}
                            {/*</div>*/}
                            {/*<div className="flex items-center justify-between text-sm">*/}
                            {/*  <span className="text-gray-500">Groupe:</span>*/}
                            {/*  <span className="font-medium">{project.groupe || "Non assigné"}</span>*/}
                            {/*</div>*/}
                          </div>

                          {project.groups && (
                              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                                {(() => {
                                  const studentId = user?.id;

                                  let myGroupId: number | null = null;

                                  project.groups.forEach((group: any) => {
                                    if (group.groupStudent.some((gs: any) => gs.studentId === studentId)) {
                                      myGroupId = group.id;
                                    }
                                  });

                                  return myGroupId ? (
                                      <Button variant="outline" size="sm" asChild
                                              className="border-blue-600 text-blue-600 hover:bg-blue-50"
                                      >
                                        <Link href={`/student/projets/${project.id}`}>Voir mon groupe</Link>
                                      </Button>
                                  ) : (
                                      project.statut !== "Terminé" && (
                                          <Button size="sm"
                                                  onClick={() => {
                                                    localStorage.setItem("selectedProject", JSON.stringify(project));
                                                    router.push(`/student/projets/${project.id}/rejoindre-groupe`);
                                                  }}
                                          >
                                            {/*<Link href={`/student/projets/${project.id}/rejoindre-groupe`}>Rejoindre un groupe</Link>*/}
                                            Rejoindre un groupe
                                          </Button>
                                      )
                                  );
                                })()}

                                <Button variant="ghost" size="sm" asChild
                                        style={{border:"blue"}}
                                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                                >
                                  <Link href={`/student/projets/${project.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Détails
                                  </Link>
                                </Button>
                              </div>
                          )}

                        </CardContent>
                      </Card>
                 ))}
              </div>
          ))}
        </div>
      </div>
    </StudentLayout>
  )
}
