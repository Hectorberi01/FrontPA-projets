import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calendar, Clock, FileText, Users } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  // Simulation de données pour le tableau de bord
  const stats = [
    {
      title: "Projets actifs",
      value: 5,
      icon: <BookOpen className="h-5 w-5 text-blue-500" />,
      href: "/projets",
    },
    {
      title: "Groupes",
      value: 12,
      icon: <Users className="h-5 w-5 text-green-500" />,
      href: "/groupes",
    },
    {
      title: "Livrables en attente",
      value: 8,
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

  const recentProjects = [
    {
      id: 1,
      name: "Projet Web Full Stack",
      description: "Développement d'une application web complète avec frontend et backend",
      deadline: "15/06/2023",
      status: "En cours",
    },
    {
      id: 2,
      name: "Application Mobile",
      description: "Création d'une application mobile cross-platform",
      deadline: "30/06/2023",
      status: "En cours",
    },
    {
      id: 3,
      name: "Intelligence Artificielle",
      description: "Implémentation d'algorithmes d'IA pour la reconnaissance d'images",
      deadline: "10/07/2023",
      status: "À venir",
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
                <Button variant="link" className="p-0 h-auto mt-4" asChild>
                  <Link href={stat.href}>Voir détails</Link>
                </Button>
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
              <div className="space-y-4">
                {recentProjects.map((project) => (
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
                      <span>Échéance: {project.deadline}</span>
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
              <CardTitle>Échéances à venir</CardTitle>
              <CardDescription>Livrables à rendre prochainement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="font-semibold">{deadline.deliverable}</h3>
                    <p className="text-sm text-gray-600 mt-1">{deadline.project}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-500">{deadline.deadline}</span>
                      <Badge variant={deadline.daysLeft <= 3 ? "destructive" : "outline"}>
                        {deadline.daysLeft} jour{deadline.daysLeft > 1 ? "s" : ""}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button variant="outline" asChild>
                  <Link href="/livrables">Voir tous les livrables</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
