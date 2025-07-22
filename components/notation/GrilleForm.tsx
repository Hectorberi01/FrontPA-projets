"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash } from "lucide-react"
import Swal from 'sweetalert2'

type Criterion = {
  label: string
  weight: number
  maxScore: number
  commentEnabled: boolean
  isIndividual: boolean
}

export default function CreateGrilleForm({ projectId }: { projectId: string }) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [type, setType] = useState<"livrable" | "rapport" | "soutenance">("livrable")
  const [criteria, setCriteria] = useState<Criterion[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleAddCriterion = () => {
    setCriteria([...criteria, { 
      label: "", 
      weight: 1, 
      maxScore: 20, 
      commentEnabled: true,
      isIndividual: false 
    }])
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      Swal.fire({
        title: "Erreur",
        text: "Le nom de la grille est requis",
        icon: "error"
      })
      return
    }

    if (criteria.length === 0) {
      Swal.fire({
        title: "Erreur", 
        text: "Au moins un critère est requis",
        icon: "error"
      })
      return
    }

    const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0)
    if (totalWeight !== 100) {
      Swal.fire({
        title: "Erreur",
        text: "Le total des pondérations doit être égal à 100",
        icon: "error"
      })
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/grading/grids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type,
          projectId: parseInt(projectId),
          criteria,
        }),
      })

      if (res.ok) {
        Swal.fire({
          title: "Succès",
          text: "Grille créée avec succès",
          icon: "success"
        }).then(() => {
          router.push(`/projets/${projectId}?tab=notation`)
        })
      } else {
        const error = await res.json()
        Swal.fire({
          title: "Erreur",
          text: error.message || "Erreur lors de la création",
          icon: "error"
        })
      }
    } catch (error) {
      Swal.fire({
        title: "Erreur",
        text: "Erreur réseau",
        icon: "error"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold">Créer une nouvelle grille</h2>

      <div>
        <Label>Nom de la grille</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div>
        <Label>Type de grille</Label>
        <select value={type} onChange={(e) => setType(e.target.value as any)} className="border p-2 rounded w-full">
          <option value="livrable">Livrable</option>
          <option value="rapport">Rapport</option>
          <option value="soutenance">Soutenance</option>
        </select>
      </div>

      <h3 className="font-semibold">Critères</h3>
      {criteria.map((criterion, index) => (
        <div key={index} className="p-2 border rounded space-y-2">
          <Input
            placeholder="Libellé"
            value={criterion.label}
            onChange={(e) => {
              const copy = [...criteria]
              copy[index].label = e.target.value
              setCriteria(copy)
            }}
          />
          <Input
            placeholder="Pondération (%)"
            type="number"
            value={criterion.weight}
            onChange={(e) => {
              const copy = [...criteria]
              copy[index].weight = parseInt(e.target.value) || 0
              setCriteria(copy)
            }}
          />
          <Input
            placeholder="Note maximale (/20)"
            type="number"
            value={criterion.maxScore}
            onChange={(e) => {
              const copy = [...criteria]
              copy[index].maxScore = parseInt(e.target.value) || 20
              setCriteria(copy)
            }}
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={criterion.commentEnabled}
              onChange={(e) => {
                const copy = [...criteria]
                copy[index].commentEnabled = e.target.checked
                setCriteria(copy)
              }}
            />
            <span>Commentaire autorisé</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={criterion.isIndividual}
              onChange={(e) => {
                const copy = [...criteria]
                copy[index].isIndividual = e.target.checked
                setCriteria(copy)
              }}
            />
            <span>Notation individuelle</span>
          </label>
          <Button variant="destructive" onClick={() => setCriteria(criteria.filter((_, i) => i !== index))}>
            <Trash size={16} className="mr-2" />
            Supprimer
          </Button>
        </div>
      ))}

      <Button onClick={handleAddCriterion}>
        <Plus size={16} className="mr-2" />
        Ajouter un critère
      </Button>

      <Button 
        className="w-full mt-4" 
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? "Création..." : "Créer la grille"}
      </Button>
    </div>
  )
}