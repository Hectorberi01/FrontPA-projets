'use client'
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BookOpen, Download, Eye, Filter, MoreHorizontal, Plus, Search, Trash, Upload, Users } from "lucide-react"
import Link from "next/link"
import { Promotion, PromotionWithDetails } from "@/lib/types/promotion"
import { use, useEffect, useState } from "react"
import { getPromotions } from "@/lib/services/promotionService"

export default function PromotionsPage() {
  const [promotion, setPromotion] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPromotions = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getPromotions()
      console.log("Promotions:", response)
      setPromotion(response)
    } catch (error) {
      setError(error as string)
      console.error("Error fetching promotions:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPromotions()
  }, [])
  
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Promotions</h1>
            <p className="text-gray-600 mt-1">Gérez toutes vos promotions</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            {/*<Button variant="outline" className="flex items-center gap-2">*/}
            {/*  <Upload className="h-4 w-4" />*/}
            {/*  Importer*/}
            {/*</Button>*/}
            <Button asChild>
              <Link href="/promotions/nouvelle">
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle promotion
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Liste des promotions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input placeholder="Rechercher une promotion..." className="pl-10" />
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter size={16} />
                      <span>Filtrer</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Toutes les promotions</DropdownMenuItem>
                    <DropdownMenuItem>2022-2023</DropdownMenuItem>
                    <DropdownMenuItem>2021-2022</DropdownMenuItem>
                    <DropdownMenuItem>2020-2021</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {/*<Button variant="outline">*/}
                {/*  <Download size={16} className="mr-2" />*/}
                {/*  Exporter*/}
                {/*</Button>*/}
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Année</TableHead>
                    <TableHead>Étudiants</TableHead>
                    <TableHead>Projets</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promotion.map((promotion) => (
                    <TableRow key={promotion.id}>
                      <TableCell className="font-medium">{promotion.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{new Date(promotion.startYear).getFullYear()}-{new Date(promotion.endYear).getFullYear()}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users size={16} />
                          <span>{promotion.students?.length ?? 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <BookOpen size={16} />
                          {/* <span>{promotion.nombreProjets}</span> */}
                          <span>{promotion.numberOfProjects}</span>
                        </div>
                      </TableCell>
                      {/* <TableCell>{promotion.dateCreation}</TableCell> */}
                      <TableCell>2024</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal size={16} />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/promotions/${promotion.id}`} className="flex items-center">
                                <Eye size={16} className="mr-2" 
                                />
                                Voir détails
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/promotions/${promotion.id}/etudiants`} className="flex items-center">
                                <Users size={16} className="mr-2" />
                                Gérer les étudiants
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 flex items-center">
                              <Trash size={16} className="mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
