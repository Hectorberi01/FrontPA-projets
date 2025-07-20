"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { CheckCircle, Plus, Edit, Trash2, AlertCircle, Save, X } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Critere {
    id: number
    nom: string
    poids: number
    description?: string
    typeEvaluation: 'groupe' | 'individuel'  
    grilleId: string 
}

interface Grille {
    id: string
    titre: string
    type: 'livrable' | 'rapport' | 'soutenance'
    criteres: Critere[]
    ponderationGlobale: number
    validee: boolean
    description?: string
}

interface GrilleNotationManagerProps {
    projectId: string
    groupId: string
    initialGrilles?: Grille[]
    onGrillesChange?: (grilles: Grille[]) => void
}

export default function GrilleNotationManager({ 
    projectId, 
    groupId, 
    initialGrilles = [],
    onGrillesChange 
}: GrilleNotationManagerProps) {
    const [grilles, setGrilles] = useState<Grille[]>(initialGrilles)
    const [editingGrille, setEditingGrille] = useState<string | null>(null)
    const [editingCritere, setEditingCritere] = useState<{grilleId: string, critereId: number} | null>(null)
    const [showCreateGrille, setShowCreateGrille] = useState(false)
    const [showCreateCritere, setShowCreateCritere] = useState<string | null>(null)
    const validateGrille = (grille: Partial<Grille>): string[] => {
      const errors = [];
      if (!grille.titre?.trim()) errors.push("Le titre est requis");
      if (!grille.ponderationGlobale || grille.ponderationGlobale < 0 || grille.ponderationGlobale > 100) {
        errors.push("La pondération doit être entre 0 et 100%");
      }
      return errors;
    };
    const validateCritere = (critere: Partial<Critere>): string[] => {
      const errors = []
      if (!critere.nom?.trim()) errors.push("Nom requis")
      if (critere.poids == null || critere.poids < 0 || critere.poids > 100) errors.push("Poids entre 0 et 100")
      return errors
    }

    const handleApiError = (error: unknown, operation: string) => {
      console.error(`Error ${operation}:`, error);
      toast({
        title: "Erreur",
        description: `Impossible de ${operation}: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive"
      });
    };
        // États pour les formulaires
    const [newGrille, setNewGrille] = useState({
        titre: '',
        type: 'livrable' as const,
        description: '',
        ponderationGlobale: 0
    })

    const BASE_URL = process.env.NEXT_PUBLIC_NOTATION_URL || "http://localhost:3000/api/notations"

    const [newCritere, setNewCritere] = useState<{
        nom: string;
        poids: number;
        description: string;
        typeEvaluation: 'groupe' | 'individuel';
    }>({
        nom: '',
        poids: 0,
        description: '',
        typeEvaluation: 'groupe'
    })

    const [editGrilleData, setEditGrilleData] = useState<Partial<Grille>>({})
    const [editCritereData, setEditCritereData] = useState<Partial<Critere>>({})

    // Charger les grilles et critères au montage du composant
    useEffect(() => {
        loadGrillesCriteres()
    }, [projectId, groupId])

    useEffect(() => {
        if (onGrillesChange) {
            onGrillesChange(grilles)
        }
    }, [grilles, onGrillesChange])

    // Nouvelle fonction pour charger les grilles avec leurs critères
    const loadGrillesCriteres = async () => {
        try {
            const response = await fetch(`${BASE_URL}/${projectId}/grilles`)
            const data = await response.json()
            const normalizedGrilles = data.map((grille: any) => ({
            ...grille,
            ponderationGlobale: typeof grille.ponderationGlobale === 'string' 
              ? parseFloat(grille.ponderationGlobale) 
              : grille.ponderationGlobale
          }))
    
          setGrilles(normalizedGrilles)
            //setGrilles(data1)
           
           
        } catch (error) {
            console.error('Error loading grilles:', error)
            toast({
                title: "Erreur",
                description: "Impossible de charger les grilles",
                variant: "destructive"
            })
        }
    }

    // Fonctions pour les grilles
    const handleCreateGrille = async () => {
        if (!newGrille.titre.trim()) {
            toast({
                title: "Erreur",
                description: "Le titre de la grille est requis",
                variant: "destructive"
            })
            return
        }
            if (getTotalPonderation() + (newGrille.ponderationGlobale / 100) > 1) {
              toast({
                title: "Erreur",
                description: "La pondération totale dépasse 100%",
                variant: "destructive"
              })
              return
            }
        try {
            const response = await fetch(`${BASE_URL}/${projectId}/grilles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    titre: newGrille.titre,
                    type: newGrille.type,
                    description: newGrille.description,
                    ponderationGlobale: newGrille.ponderationGlobale / 100
                })
            })

            if (!response.ok) {
                const errorData = await response.text()
                console.error('Error response:', errorData)
                throw new Error(`HTTP ${response.status}: ${errorData}`)
            }

            const savedGrille = await response.json()
            console.log('Grille créée avec ID:', savedGrille.id)

            const grilleWithCriteres: Grille = {
                ...savedGrille,
                criteres: []
            }

            setGrilles(prev => [...prev, grilleWithCriteres])
            setNewGrille({ titre: '', type: 'livrable', description: '', ponderationGlobale: 0 })
            setShowCreateGrille(false)
            
            toast({
                title: "Succès",
                description: "Grille créée avec succès"
            })

        } catch (error) {
            console.error('Error creating grille:', error)
            toast({
                title: "Erreur",
                description: `Impossible de créer la grille: ${error instanceof Error ? error.message : String(error)}`,
                variant: "destructive"
            })
        }
    }

const handleUpdateGrille = async (grilleId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/grilles/${grilleId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...editGrilleData,
        ponderationGlobale: (editGrilleData.ponderationGlobale || 0) / 100
      }),
    });

    if (!response.ok) throw new Error(await response.text());

    const updated = await response.json();

    setGrilles(prev =>
      prev.map(g =>
        g.id === grilleId ? { ...g, ...updated } : g
      )
    );
    setEditingGrille(null);
    setEditGrilleData({});
    toast({ title: "Succès", description: "Grille mise à jour avec succès" });
  } catch (error) {
    handleApiError(error, "mettre à jour la grille");
  }
};

  const handleDeleteGrille = async (grilleId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/grilles/${grilleId}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error(await response.text());

    setGrilles(prev => prev.filter(g => g.id !== grilleId));
    toast({ title: "Succès", description: "Grille supprimée avec succès" });
  } catch (error) {
    handleApiError(error, "supprimer la grille");
  }
};


    // Fonctions pour les critères - MODIFICATION PRINCIPALE ICI
    const handleCreateCritere = async (grilleId: string) => {
        if (!newCritere.nom.trim()) {
            toast({
                title: "Erreur",
                description: "Le nom du critère est requis",
                variant: "destructive"
            })
            return
        }

        try {
            // ROUTE MODIFIÉE : /:projectId/groups/:groupId/criteres
            const response = await fetch(`${BASE_URL}/${projectId}/groups/${groupId}/criteres`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nom: newCritere.nom,
                    poids: newCritere.poids,
                    description: newCritere.description,
                    typeEvaluation: newCritere.typeEvaluation,
                    grille_id: grilleId
                })
            })

            if (!response.ok) {
                const errorData = await response.text()
                console.error('Error response:', errorData)
                throw new Error(`Erreur lors de la création du critère: ${errorData}`)
            }

            const createdCritere = await response.json()

            setGrilles(prev => prev.map(g => 
                g.id === grilleId 
                    ? { ...g, criteres: [...g.criteres, createdCritere] }
                    : g
            ))

            setNewCritere({ nom: '', poids: 0, description: '', typeEvaluation: 'groupe' })
            setShowCreateCritere(null)
            
            toast({
                title: "Succès",
                description: "Critère ajouté avec succès"
            })
        } catch (error) {
            console.error('Error creating critere:', error)
            toast({
                title: "Erreur",
                description: `Impossible de créer le critère: ${error instanceof Error ? error.message : String(error)}`,
                variant: "destructive"
            })
        }
    }

    const handleUpdateCritere = (grilleId: string, critereId: number) => {
        setGrilles(prev => prev.map(g => 
            g.id === grilleId 
                ? {
                    ...g,
                    criteres: g.criteres.map(c => 
                        c.id === critereId ? { ...c, ...editCritereData } : c
                    )
                }
                : g
        ))

        setEditingCritere(null)
        setEditCritereData({})
        
        toast({
            title: "Succès",
            description: "Critère mis à jour avec succès"
        })
    }

    const handleDeleteCritere = (grilleId: string, critereId: number) => {
        setGrilles(prev => prev.map(g => 
            g.id === grilleId 
                ? { ...g, criteres: g.criteres.filter(c => c.id !== critereId) }
                : g
        ))
        
        toast({
            title: "Succès",
            description: "Critère supprimé avec succès"
        })
    }

const getTotalPonderation = () => {
  return grilles.reduce((total, grille) => total + grille.ponderationGlobale, 0);
};


    const getTypeLabel = (type: string) => {
        switch(type) {
            case 'livrable': return 'Livrable'
            case 'rapport': return 'Rapport'
            case 'soutenance': return 'Soutenance'
            default: return type
        }
    }

    return (
        <div className="space-y-6">
            {/* Header avec bouton d'ajout */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Grilles de notation</h2>
                    <p className="text-muted-foreground">
                        Pondération totale: {(getTotalPonderation() * 100).toFixed(0)}%
                        {getTotalPonderation() !== 1 && (
                            <span className="text-amber-600 ml-2">
                                ⚠️ La pondération totale doit être de 100%
                            </span>
                        )}
                    </p>
                </div>
                
                <Dialog open={showCreateGrille} onOpenChange={setShowCreateGrille}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Nouvelle grille
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Créer une nouvelle grille</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="titre">Titre</Label>
                                <Input
                                    id="titre"
                                    value={newGrille.titre}
                                    onChange={(e) => setNewGrille(prev => ({ ...prev, titre: e.target.value }))}
                                    placeholder="Ex: Évaluation du livrable"
                                />
                            </div>
                            
                            <div>
                                <Label htmlFor="type">Type</Label>
                                <Select value={newGrille.type} onValueChange={(value: any) => setNewGrille(prev => ({ ...prev, type: value }))}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="livrable">Livrable</SelectItem>
                                        <SelectItem value="rapport">Rapport</SelectItem>
                                        <SelectItem value="soutenance">Soutenance</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="ponderation">Pondération (%)</Label>
                                <Input
                                    id="ponderation"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={newGrille.ponderationGlobale}
                                    onChange={(e) => setNewGrille(prev => ({ ...prev, ponderationGlobale: parseInt(e.target.value) || 0 }))}
                                />
                            </div>

                            <div>
                                <Label htmlFor="description">Description (optionnel)</Label>
                                <Textarea
                                    id="description"
                                    value={newGrille.description}
                                    onChange={(e) => setNewGrille(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Description de la grille..."
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 pt-4">
                            <Button onClick={handleCreateGrille}>Créer</Button>
                            <Button variant="outline" onClick={() => setShowCreateGrille(false)}>
                                Annuler
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Liste des grilles */}
            <div className="space-y-4">
                {grilles.map((grille) => (
                  
                    <Card key={grille.id} className="relative">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    {editingGrille === grille.id ? (
                                        <div className="space-y-2">
                                            <Input
                                                value={editGrilleData.titre || grille.titre}
                                                onChange={(e) => setEditGrilleData(prev => ({ ...prev, titre: e.target.value }))}
                                                className="text-lg font-semibold"
                                            />
                                            <div className="flex gap-2">
                                                <Select 
                                                    value={editGrilleData.type || grille.type} 
                                                    onValueChange={(value: any) => setEditGrilleData(prev => ({ ...prev, type: value }))}
                                                >
                                                    <SelectTrigger className="w-32">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="livrable">Livrable</SelectItem>
                                                        <SelectItem value="rapport">Rapport</SelectItem>
                                                        <SelectItem value="soutenance">Soutenance</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={editGrilleData.ponderationGlobale !== undefined ? editGrilleData.ponderationGlobale : grille.ponderationGlobale * 100}
                                                    onChange={(e) => setEditGrilleData(prev => ({ ...prev, ponderationGlobale: parseInt(e.target.value) || 0 }))}
                                                    className="w-20"
                                                />
                                                <span className="self-center">%</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <CardTitle className="flex items-center gap-2">
                                                {grille.titre}
                                                <Badge variant="secondary">{getTypeLabel(grille.type)}</Badge>
                                                {grille.validee && (
                                                    <Badge variant="default" className="flex items-center gap-1">
                                                        <CheckCircle className="h-3 w-3" />
                                                        Validée
                                                    </Badge>
                                                )}
                                            </CardTitle>
                                            <CardDescription>
                                                Pondération: {(grille.ponderationGlobale * 100).toFixed(0)}% {(grille.criteres?.length || 0)} critère(s)

                                            </CardDescription>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex gap-2">
                                    {editingGrille === grille.id ? (
                                        <>
                                            <Button size="sm" onClick={() => handleUpdateGrille(grille.id)}>
                                                <Save className="h-4 w-4" />
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => setEditingGrille(null)}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button 
                                                size="sm" 
                                                variant="outline"
                                                onClick={() => {
                                                    setEditingGrille(grille.id)
                                                    setEditGrilleData({ 
                                                        titre: grille.titre, 
                                                        type: grille.type, 
                                                        ponderationGlobale: grille.ponderationGlobale * 100 
                                                    })
                                                }}
                                                disabled={grille.validee}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button size="sm" variant="destructive" disabled={grille.validee}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Supprimer la grille</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Êtes-vous sûr de vouloir supprimer cette grille ? Cette action est irréversible.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDeleteGrille(grille.id)}>
                                                            Supprimer
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        
                        <CardContent>
                            {/* Liste des critères */}
                         
                              {(() => {
                                    const totalPoids = grille.criteres?.reduce((acc, c) => acc + c.poids, 0) || 0;
                                    return (
                                      <div className="text-sm font-medium mb-4">
                                        Total pondération des critères : {totalPoids}%
                                        {totalPoids !== 100 && (
                                          <span className="text-amber-600 ml-2">
                                            ⚠️ La somme des poids doit être égale à 100%
                                          </span>
                                        )}
                                      </div>
                                    );
                                  })()}
                              <div className="space-y-3">
                                {grille.criteres?.map((critere) => (
                                    <div key={critere.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                        {editingCritere?.grilleId === grille.id && editingCritere.critereId === critere.id ? (
                                          <div className="flex-1 space-y-2">
                                              <div className="flex items-center gap-2">
                                                  <Input
                                                      value={editCritereData.nom || critere.nom}
                                                      onChange={(e) => setEditCritereData(prev => ({ ...prev, nom: e.target.value }))}
                                                      className="flex-1"
                                                  />
                                                  <Input
                                                      type="number"
                                                      min="0"
                                                      max="100"
                                                      value={editCritereData.poids !== undefined ? editCritereData.poids : critere.poids}
                                                      onChange={(e) => setEditCritereData(prev => ({ ...prev, poids: parseInt(e.target.value) || 0 }))}
                                                      className="w-20"
                                                  />
                                                  <span className="text-sm">%</span>
                                              </div>
                                              <Select 
                                                  value={editCritereData.typeEvaluation || critere.typeEvaluation} 
                                                  onValueChange={(value: 'groupe' | 'individuel') => 
                                                      setEditCritereData(prev => ({ ...prev, typeEvaluation: value }))
                                                  }
                                              >
                                                  <SelectTrigger className="w-32">
                                                      <SelectValue />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                      <SelectItem value="groupe">Groupe</SelectItem>
                                                      <SelectItem value="individuel">Individuel</SelectItem>
                                                  </SelectContent>
                                              </Select>
                                              <div className="flex gap-2">
                                                  <Button size="sm" onClick={() => handleUpdateCritere(grille.id, critere.id)}>
                                                      <Save className="h-4 w-4" />
                                                  </Button>
                                                  <Button size="sm" variant="outline" onClick={() => setEditingCritere(null)}>
                                                      <X className="h-4 w-4" />
                                                  </Button>
                                              </div>
                                          </div>
                                      ) : (
                                            <>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">{critere.nom}</span>
                                                        <Badge variant={critere.typeEvaluation === 'groupe' ? 'default' : 'secondary'}>
                                                            {critere.typeEvaluation === 'groupe' ? 'Groupe' : 'Individuel'}
                                                        </Badge>
                                                    </div>
                                                    {critere.description && (
                                                        <p className="text-sm text-muted-foreground mt-1">{critere.description}</p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium">{critere.poids}%</span>
                                                    <Button 
                                                        size="sm" 
                                                        variant="outline"
                                                        onClick={() => {
                                                              setEditingCritere({ grilleId: grille.id, critereId: critere.id })
                                                              setEditCritereData({ 
                                                                  nom: critere.nom, 
                                                                  poids: critere.poids,
                                                                  description: critere.description,
                                                                  typeEvaluation: critere.typeEvaluation
                                                              })
                                                          }}
                                                        disabled={grille.validee}
                                                    >
                                                        <Edit className="h-3 w-3" />
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button size="sm" variant="destructive" disabled={grille.validee}>
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Supprimer le critère</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Êtes-vous sûr de vouloir supprimer ce critère ?
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDeleteCritere(grille.id, critere.id)}>
                                                                    Supprimer
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                                
                                {/* Formulaire d'ajout de critère */}
                           {showCreateCritere === grille.id ? (
                                      <div className="space-y-3 p-3 bg-blue-50 rounded-lg">
                                          <div className="flex items-center gap-2">
                                              <Input
                                                  value={newCritere.nom}
                                                  onChange={(e) => setNewCritere(prev => ({ ...prev, nom: e.target.value }))}
                                                  placeholder="Nom du critère"
                                                  className="flex-1"
                                              />
                                              <Input
                                                  type="number"
                                                  min="0"
                                                  max="100"
                                                  value={newCritere.poids}
                                                  onChange={(e) => setNewCritere(prev => ({ ...prev, poids: parseInt(e.target.value) || 0 }))}
                                                  placeholder="Poids"
                                                  className="w-20"
                                              />
                                              <span className="text-sm">%</span>
                                          </div>
                                          
                                          <div className="flex items-center gap-2">
                                              <Label className="text-sm">Type d'évaluation:</Label>
                                              <Select 
                                                  value={newCritere.typeEvaluation} 
                                                  onValueChange={(value: 'groupe' | 'individuel') => 
                                                      setNewCritere(prev => ({ ...prev, typeEvaluation: value }))
                                                  }
                                              >
                                                  <SelectTrigger className="w-32">
                                                      <SelectValue />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                      <SelectItem value="groupe">Groupe</SelectItem>
                                                      <SelectItem value="individuel">Individuel</SelectItem>
                                                  </SelectContent>
                                              </Select>
                                          </div>
                                          
                                          <Textarea
                                              value={newCritere.description}
                                              onChange={(e) => setNewCritere(prev => ({ ...prev, description: e.target.value }))}
                                              placeholder="Description (optionnel)"
                                              className="w-full"
                                          />
                                          
                                          <div className="flex gap-2">
                                              <Button size="sm" onClick={() => handleCreateCritere(grille.id)}>
                                                  <Save className="h-4 w-4" />
                                              </Button>
                                              <Button size="sm" variant="outline" onClick={() => setShowCreateCritere(null)}>
                                                  <X className="h-4 w-4" />
                                              </Button>
                                          </div>
                                      </div>
                                  )  : (
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => setShowCreateCritere(grille.id)}
                                        disabled={grille.validee}
                                        className="w-full"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Ajouter un critère
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
                
                {grilles.length === 0 && (
                    <Card className="text-center py-8">
                        <CardContent>
                            <p className="text-muted-foreground">Aucune grille de notation définie</p>
                            <p className="text-sm text-muted-foreground mt-2">
                                Cliquez sur "Nouvelle grille" pour commencer
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}