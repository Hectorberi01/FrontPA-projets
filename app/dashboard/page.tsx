'use client'
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calendar, Clock, FileText, Users } from "lucide-react"
import Link from "next/link"
import {AuthProvider} from "@/hooks/authContext";
import {useEffect, useState} from "react";
import {promise} from "zod";
import {apiClient} from "@/lib/services/apiClient";

const PROJECT_URL ="http://localhost:3000/api/projects"
const GROUPS_URL ="http://localhost:3000/api/groups"
const LIVRABLE_URL ="http://localhost:3000/api/livrables"
const PROMOTIONS_URL ="http://localhost:3000/api/promotions"
export default function DashboardPage() {
  const [projects, setProjects] = useState<any>()
  const [livrables, setLivrables] = useState<any>()
  const [groups, setGroups] = useState<any>()
  const [promotions, setPromotions] = useState<any>()

  const stats = [
    {
      title: "Projets actifs",
      value: projects?.projects.length,
      icon: <BookOpen className="h-5 w-5 text-blue-500" />,
      href: "/projets",
    },
    {
      title: "Groupes",
      value: groups?.length,
      icon: <Users className="h-5 w-5 text-green-500" />,
      href: "/groupes",
    },
    {
      title: "Livrables en attente",
      value: livrables?.length,
      icon: <FileText className="h-5 w-5 text-amber-500" />,
      href: "/livrables",
    },
    {
      title: "Soutenances à venir",
      value: 3,
      icon: <Calendar className="h-5 w-5 text-purple-500" />,
      href: "/soutenances",
    },
  ]

  const upcomingDeadlines = [
    {
      id: 1,
      project: "Projet Web Full Stack",
      deliverable: "Maquettes et spécifications",
      deadline: "25/05/2023",
      daysLeft: 2,
    },
    {
      id: 2,
      project: "Application Mobile",
      deliverable: "Prototype fonctionnel",
      deadline: "01/06/2023",
      daysLeft: 9,
    },
    {
      id: 3,
      project: "Intelligence Artificielle",
      deliverable: "Rapport préliminaire",
      deadline: "05/06/2023",
      daysLeft: 13,
    },
  ]

  useEffect(() => {
    const fecthdata = async () =>{
      try {
        const [projectsRes, groupsRes, livrableRes, promotionsRes] = await Promise.all([
            apiClient.get<any[]>(PROJECT_URL),
            apiClient.get<any[]>(`${GROUPS_URL}`),
            apiClient.get<any>(LIVRABLE_URL),
            apiClient.get<any>(PROMOTIONS_URL),
        ])

        if(projectsRes.status !== 200) throw new Error('Échec récupération projets')
        if(groupsRes.status !== 200) throw new Error('Échec récupération groupes')
        if(livrableRes.status !== 200) throw new Error('Échec récupération livrable')
        if(promotionsRes.status !== 200) throw new Error('Échec récupération livrable')

        setProjects(projectsRes.data);
        setGroups(groupsRes.data);
        setLivrables(livrableRes.data);
        setPromotions(promotionsRes.data);

      }catch (e) {

      }
    }
    fecthdata()
  },[])
console.log("projects",projects)
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
            <p className="text-gray-600 mt-1">Bienvenue sur votre espace de gestion de projets</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button asChild>
              <Link href="/projets/nouveau">Nouveau projet</Link>
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">{stat.icon}</div>
                </div>
                {/*<Button variant="link" className="p-0 h-auto mt-4" asChild>*/}
                {/*  <Link href={stat.href}>Voir détails</Link>*/}
                {/*</Button>*/}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projets récents */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Projets récents</CardTitle>
              <CardDescription>Vos projets les plus récents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {projects?.projects.map((project:any) => (
                  <div key={project.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{project.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">{project.description}</p>
                      </div>
                      <Badge variant={project.status === "En cours" ? "default" : "secondary"}>{project.status}</Badge>
                    </div>
                    <div className="flex items-center mt-4 text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Échéance: {new Date(project.deadline).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/projets/${project.id}`}>Voir détails</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button variant="outline" asChild>
                  <Link href="/projets">Voir tous les projets</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Échéances à venir */}
          <Card>
            <CardHeader>
              <CardTitle>Promotions</CardTitle>
              <CardDescription>List des promotions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {promotions?.map((promotion:any) => (
                    <div key={promotion.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <h3 className="font-semibold">Promotion : {promotion.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">De : {new Date(promotion.startYear).toLocaleDateString('fr-FR')}</p>
                      <p className="text-sm text-gray-600 mt-1"> à : {new Date(promotion.endYear).toLocaleDateString('fr-FR')}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-500">{promotion.deadline}</span>
                        {/*<Badge variant={promotion.daysLeft <= 3 ? "destructive" : "outline"}>*/}
                        {/*  {promotion.daysLeft} jour{promotion.daysLeft > 1 ? "s" : ""}*/}
                        {/*</Badge>*/}
                        <Button variant="outline" asChild>
                          <Link href={`/promotions/${promotion.id}`} className="flex items-center">Détails</Link>
                        </Button>
                      </div>
                    </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button variant="outline" asChild>
                  <Link href={`/promotions`}>Voir tous les promotions</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
