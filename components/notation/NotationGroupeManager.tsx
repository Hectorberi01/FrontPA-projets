"use client"
import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, AlertCircle, Save, Eye } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { gradingApi } from "@/lib/services/notation"
import debounce from "lodash.debounce"
interface Critere {
    id: number
    nom: string
    poids: number
    description?: string
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

interface NotationGroupeManagerProps {
    projectId: string
    groupId: string
    grilles: Grille[]
    group: any
    onNotationChange?: (notes: any) => void
}

export default function NotationGroupeManager({ 
    projectId, 
    groupId, 
    grilles,
    group,
    onNotationChange 
}: NotationGroupeManagerProps) {
    const [notes, setNotes] = useState<Record<string, Record<number, { note: number; commentaire: string }>>>({})
    const [commentairesGlobaux, setCommentairesGlobaux] = useState<Record<string, string>>({})
    const [commentaireProjet, setCommentaireProjet] = useState("")
    const [grillesValidees, setGrillesValidees] = useState<Record<string, boolean>>({})
    const [notationFinalisee, setNotationFinalisee] = useState(false)
const transformNotes = (rawNotes: any[]) => {
  const structured: Record<string, Record<number, { note: number; commentaire: string }>> = {};

  rawNotes.forEach(note => {
    if (!structured[note.grilleId]) {
      structured[note.grilleId] = {};
    }

    structured[note.grilleId][note.critereId] = {
      note: parseFloat(note.note),
      commentaire: note.commentaire || "",
    };
  });

  return structured;
};


    const debouncedSaveNote = useCallback(
  debounce(async (args) => {
    try {
      await gradingApi.saveNoteForCritere(args.projectId, args.groupId, args.payload)
    } catch (error) {
      console.error("Erreur de sauvegarde:", error)
      toast({ title: "Erreur", description: "Échec de la sauvegarde", variant: "destructive" })
    }
  }, 800), 
  []
)
   
    useEffect(() => {
        const initialNotes: Record<string, Record<number, { note: number; commentaire: string }>> = {}
        grilles.forEach(grille => {
            initialNotes[grille.id] = {}
            grille.criteres.forEach(critere => {
                initialNotes[grille.id][critere.id] = { note: 0, commentaire: "" }
            })
        })
        setNotes(initialNotes)
    }, [grilles])
useEffect(() => {
  const loadExistingNotation = async () => {
    try {
      const existingNotation = await gradingApi.getGroupNotation(projectId, groupId);

      if (existingNotation) {
        const transformedNotes = transformNotes(existingNotation.notes);
        setNotes(transformedNotes);

        // Set commentaire projet
        setCommentaireProjet(existingNotation.commentaireProjet || "");

        // Commentaires globaux non fournis par API -> tu peux les initialiser à vide
        const commentaires: Record<string, string> = {};
        (existingNotation.grillesValidees || []).forEach((grille: { id: string | number }) => {
          commentaires[grille.id] = "";
        });
        setCommentairesGlobaux(commentaires);

        // Marquer les grilles comme validées
        const valides: Record<string, boolean> = {};
        (existingNotation.grillesValidees || []).forEach((grille: { id: string | number }) => {
          valides[grille.id] = true;
        });
        setGrillesValidees(valides);

        // Vérifie s’il y a une notation finalisée
        setNotationFinalisee(!!existingNotation.notationFinalisee);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la notation",
        variant: "destructive"
      });
    }
  };

  loadExistingNotation();
}, [projectId, groupId]);


// Modifier handleNoteChange pour sauvegarder en temps réel
const handleNoteChange = async (grilleId: string, critereId: number, note?: number, commentaire?: string, studentId?: number) => {
  // Mise à jour locale
  setNotes(prev => ({
    ...prev,
    [grilleId]: {
      ...prev[grilleId],
      [critereId]: {
        note: note !== undefined ? note : prev[grilleId]?.[critereId]?.note ?? 0,
        commentaire: commentaire !== undefined ? commentaire : prev[grilleId]?.[critereId]?.commentaire ?? ""
      }
    }
  }));
  debouncedSaveNote({
    projectId,
    groupId,
    payload: {
      grilleId,
      critereId,
      note,
      commentaire,
      studentId,
    }
  })
  // Sauvegarde sur le serveur
  /*try {
    await gradingApi.saveNoteForCritere(projectId, groupId, {
      grilleId,
      critereId,
      note,
      commentaire,
      studentId
    });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    toast({
      title: "Erreur",
      description: "Erreur lors de la sauvegarde de la note",
      variant: "destructive"
    });
  }*/
};

// Modifier validerGrille
const validerGrille = async (grilleId: string) => {
  const grille = grilles.find(g => g.id === grilleId);
  if (!grille || !isGrilleComplete(grille)) {
    toast({
      title: "Erreur",
      description: "Toutes les notes doivent être saisies avant validation",
      variant: "destructive"
    });
    return;
  }

  try {
    await gradingApi.validateGrille(projectId, groupId, grilleId);
    setGrillesValidees(prev => ({ ...prev, [grilleId]: true }));
    toast({
      title: "Succès",
      description: "Grille validée avec succès"
    });
  } catch (error) {
    console.error('Erreur lors de la validation:', error);
    toast({
      title: "Erreur",
      description: "Erreur lors de la validation de la grille",
      variant: "destructive"
    });
  }
};

// Modifier finaliserNotation
const finaliserNotation = async () => {
  const toutesValidees = grilles.every(grille => grillesValidees[grille.id]);
  
  if (!toutesValidees) {
    toast({
      title: "Erreur",
      description: "Toutes les grilles doivent être validées",
      variant: "destructive"
    });
    return;
  }

  try {
    const transformNotesForBackend = () => {
    return grilles.map(grille => {
            const critNotes = notes[grille.id] || {};
            return {
            poids: grille.ponderationGlobale,
            ...critNotes
            };
        });
    };

    const notesFormatees = transformNotesForBackend();
    await gradingApi.finalizeNotation(projectId, groupId, {
    notes: notesFormatees,
    commentairesGlobaux,
    commentaireProjet
    });

    setNotationFinalisee(true);
    toast({
      title: "Succès",
      description: "Notation finalisée et sauvegardée"
    });
  } catch (error) {
    console.error('Erreur lors de la finalisation:', error);
    toast({
      title: "Erreur",
      description: "Erreur lors de la sauvegarde",
      variant: "destructive"
    });
  }
};



    const calcNoteGrille = (grille: Grille) => {
        const critNotes = notes[grille.id] || {}
        let total = 0
        let totalPoids = 0
        
        grille.criteres.forEach(critere => {
            const noteData = critNotes[critere.id]
            if (noteData) {
                total += noteData.note * (critere.poids / 100)
                totalPoids += critere.poids
            }
        })
        
        return totalPoids > 0 ? total : 0
    }

    // Calculer la note globale du projet
    const calcNoteGlobale = () => {
        return grilles.reduce((acc, grille) => {
            const noteGrille = calcNoteGrille(grille)
            return acc + noteGrille * grille.ponderationGlobale
        }, 0)
    }

    // Vérifier si une grille est complète
    const isGrilleComplete = (grille: Grille) => {
        const critNotes = notes[grille.id] || {}
       return grille.criteres.every(critere => {
        const noteData = critNotes[critere.id]
        return noteData && noteData.note !== undefined && noteData.note !== null
        })

    }

    // Valider une grille
   /* const validerGrille = (grilleId: string) => {
        const grille = grilles.find(g => g.id === grilleId)
        if (!grille) return

        if (!isGrilleComplete(grille)) {
            toast({
                title: "Erreur",
                description: "Toutes les notes doivent être saisies avant validation",
                variant: "destructive"
            })
            return
        }

        setGrillesValidees(prev => ({ ...prev, [grilleId]: true }))
        toast({
            title: "Succès",
            description: "Grille validée avec succès"
        })
    }*/
    // Finaliser la notation
   /* const finaliserNotation = async () => {
        // Vérifier que toutes les grilles sont validées
        const toutesValidees = grilles.every(grille => grillesValidees[grille.id])
        
        if (!toutesValidees) {
            toast({
                title: "Erreur",
                description: "Toutes les grilles doivent être validées",
                variant: "destructive"
            })
            return
        }

        try {
            // Ici vous pourriez faire l'appel API pour sauvegarder
            // await saveNotation(projectId, groupId, notes, commentairesGlobaux, commentaireProjet)
            
            setNotationFinalisee(true)
            toast({
                title: "Succès",
                description: "Notation finalisée et sauvegardée"
            })
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Erreur lors de la sauvegarde",
                variant: "destructive"
            })
        }
    }*/

    const getTypeLabel = (type: string) => {
        switch(type) {
            case 'livrable': return 'Livrable'
            case 'rapport': return 'Rapport'
            case 'soutenance': return 'Soutenance'
            default: return type
        }
    }

    const getGrillesByType = (type: string) => {
        return grilles.filter(g => g.type === type)
    }

    if (grilles.length === 0) {
        return (
            <Card className="text-center py-8">
                <CardContent>
                    <AlertCircle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucune grille de notation</h3>
                    <p className="text-muted-foreground">
                        Vous devez d'abord créer des grilles de notation avant de pouvoir noter ce groupe.
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header avec informations du groupe */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Notation du groupe {group?.name}</h2>
                    <p className="text-muted-foreground">
                        {group?.groupStudent?.length || 0} membre(s) • Note actuelle: {calcNoteGlobale().toFixed(2)}/20
                    </p>
                </div>
                
                {notationFinalisee && (
                    <Badge variant="default" className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Notation finalisée
                    </Badge>
                )}
            </div>

            {/* Tabs par type de grille */}
            <Tabs defaultValue="livrable" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="livrable">
                        Livrables ({getGrillesByType('livrable').length})
                    </TabsTrigger>
                    <TabsTrigger value="rapport">
                        Rapports ({getGrillesByType('rapport').length})
                    </TabsTrigger>
                    <TabsTrigger value="soutenance">
                        Soutenances ({getGrillesByType('soutenance').length})
                    </TabsTrigger>
                </TabsList>

                {['livrable', 'rapport', 'soutenance'].map(type => (
                    <TabsContent key={type} value={type} className="space-y-4">
                        {getGrillesByType(type).map(grille => (
                            <Card key={grille.id} className="relative">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="flex items-center gap-2">
                                                {grille.titre}
                                                <Badge variant="secondary">{getTypeLabel(grille.type)}</Badge>
                                                {grillesValidees[grille.id] && (
                                                    <Badge variant="default" className="flex items-center gap-1">
                                                        <CheckCircle className="h-3 w-3" />
                                                        Validée
                                                    </Badge>
                                                )}
                                            </CardTitle>
                                            <CardDescription>
                                                Pondération: {(grille.ponderationGlobale * 100).toFixed(0)}% • 
                                                Note: {calcNoteGrille(grille).toFixed(2)}/20
                                            </CardDescription>
                                        </div>
                                        
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {calcNoteGrille(grille).toFixed(2)}/20
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                Note de la grille
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {/* Critères de notation */}
                                    <div className="space-y-3">
                                        {grille.criteres.map(critere => (
                                            <div key={critere.id} className="p-4 border rounded-lg">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1">
                                                        <h4 className="font-medium">{critere.nom}</h4>
                                                        {critere.description && (
                                                            <p className="text-sm text-muted-foreground mt-1">
                                                                {critere.description}
                                                            </p>
                                                        )}
                                                        <span className="text-sm text-blue-600 font-medium">
                                                            Poids: {critere.poids}%
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <Label htmlFor={`note-${grille.id}-${critere.id}`}>
                                                            Note sur 20
                                                        </Label>
                                                        <Input
                                                            id={`note-${grille.id}-${critere.id}`}
                                                            type="number"
                                                            min="0"
                                                            max="20"
                                                            step="0.25"
                                                            value={notes[grille.id]?.[critere.id]?.note || 0}
                                                            onChange={(e) => {
                                                                const value = parseFloat(e.target.value)
                                                                handleNoteChange(
                                                                    grille.id,
                                                                    critere.id,
                                                                    value || 0
                                                                )
                                                            }}
                                                           // disabled={grillesValidees[grille.id] || notationFinalisee}
                                                            className="text-lg font-semibold"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor={`comment-${grille.id}-${critere.id}`}>
                                                            Commentaire
                                                        </Label>
                                                        <Textarea
                                                            id={`comment-${grille.id}-${critere.id}`}
                                                            value={notes[grille.id]?.[critere.id]?.commentaire || ""}
                                                            onChange={(e) => handleNoteChange(
                                                                grille.id, 
                                                                critere.id, 
                                                                undefined, 
                                                                e.target.value
                                                            )}
                                                            //disabled={grillesValidees[grille.id] || notationFinalisee}
                                                            placeholder="Commentaire sur ce critère..."
                                                            rows={2}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Commentaire global de la grille */}
                                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                        <Label htmlFor={`global-comment-${grille.id}`}>
                                            Commentaire global sur cette grille
                                        </Label>
                                        <Textarea
                                            id={`global-comment-${grille.id}`}
                                            value={commentairesGlobaux[grille.id] || ""}
                                            onChange={(e) => setCommentairesGlobaux(prev => ({
                                                ...prev,
                                                [grille.id]: e.target.value
                                            }))}
                                           // disabled={grillesValidees[grille.id] || notationFinalisee}
                                            placeholder="Commentaire général sur cette partie du projet..."
                                            rows={3}
                                        />
                                    </div>

                                    {/* Bouton de validation */}
                                    <div className="flex items-center justify-between pt-4 border-t">
                                        <div className="flex items-center gap-2">
                                            {!isGrilleComplete(grille) && (
                                                <div className="flex items-center gap-1 text-amber-600 text-sm">
                                                    <AlertCircle className="h-4 w-4" />
                                                    Toutes les notes doivent être saisies
                                                </div>
                                            )}
                                        </div>
                                        
                                        <Button
                                            onClick={() => validerGrille(grille.id)}
                                           // disabled={!isGrilleComplete(grille) || grillesValidees[grille.id] || notationFinalisee}
                                            className="min-w-32"
                                        >
                                            {grillesValidees[grille.id] ? (
                                                <>
                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                    Validée
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-4 w-4 mr-2" />
                                                    Valider
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        
                        {getGrillesByType(type).length === 0 && (
                            <Card className="text-center py-8">
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        Aucune grille de type "{getTypeLabel(type)}" définie
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                ))}
            </Tabs>

            {/* Synthèse finale */}
            <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                    <CardTitle className="text-xl">Synthèse de la notation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Résumé des notes par grille */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {grilles.map(grille => (
                            <div key={grille.id} className="text-center p-4 bg-white rounded-lg">
                                <div className="font-medium text-sm mb-1">{grille.titre}</div>
                                <div className="text-lg font-bold text-blue-600">
                                    {calcNoteGrille(grille).toFixed(2)}/20
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Poids: {(grille.ponderationGlobale * 100).toFixed(0)}%
                                </div>
                                <div className="text-xs mt-1">
                                    {grillesValidees[grille.id] ? (
                                        <Badge variant="default" className="text-xs">Validée</Badge>
                                    ) : (
                                        <Badge variant="secondary" className="text-xs">En cours</Badge>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Commentaire global sur le projet */}
                    <div>
                        <Label htmlFor="commentaire-projet">
                            Commentaire global sur le projet
                        </Label>
                        <Textarea
                            id="commentaire-projet"
                            value={commentaireProjet}
                            onChange={(e) => setCommentaireProjet(e.target.value)}
                           // disabled={notationFinalisee}
                            placeholder="Commentaire général sur l'ensemble du travail du groupe..."
                            rows={4}
                        />
                    </div>

                    {/* Note finale et validation */}
                    <div className="flex items-center justify-between p-6 bg-white rounded-lg">
                        <div>
                            <div className="text-3xl font-bold text-blue-600">
                                {calcNoteGlobale().toFixed(2)}/20
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Note finale (pondérée)
                            </div>
                        </div>
                        
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    // Prévisualisation de la notation
                                    console.log('Notes:', notes)
                                    console.log('Commentaires:', commentairesGlobaux)
                                    console.log('Note finale:', calcNoteGlobale())
                                }}
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                Prévisualiser
                            </Button>
                            
                            <Button
                                onClick={finaliserNotation}
                               // disabled={!grilles.every(g => grillesValidees[g.id]) || notationFinalisee}
                                size="lg"
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                {notationFinalisee ? (
                                    <>
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Notation finalisée
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Finaliser la notation
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Avertissements */}
                    {!grilles.every(g => grillesValidees[g.id]) && (
                        <div className="flex items-center gap-2 text-amber-600 text-sm">
                            <AlertCircle className="h-4 w-4" />
                            Toutes les grilles doivent être validées avant la finalisation
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}