"use client"
import { useState, useEffect, useMemo, useRef, useCallback } from "react"
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
  typeEvaluation: 'groupe' | 'individuel'  
  grilleId: string 
}

interface Notation {
  id: string
  grilleId: string
  critereId: number
  studentId: string | null  // Notez que c'est un string ou null
  note: string              // Le backend retourne une string
  commentaire: string | null
  etudiantId: string | null // Apparemment présent dans la réponse
   poids?: number;
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

interface GroupStudent {
  id: number
  studentId: number
  student: {
    id: number
    username: string
    nom: string
    prenom: string
    email: string
    role: {
      id: number
      name: string
    }
  }
}

interface Group {
  id: number
  projectId: number
  name: string
  groupStudent: GroupStudent[]
  reports: any[]
  deliverables: any[]
}

interface NotationGroupeManagerProps {
  projectId: string
  groupId: string
  grilles: Grille[]
  group: Group
  onNotationChange?: (notes: any) => void
}

export default function NotationGroupeManager({ 
  projectId, 
  groupId, 
  grilles,
  group,
  onNotationChange 
}: NotationGroupeManagerProps) {
  const [notations, setNotations] = useState<Notation[]>([]);
  const [commentairesGlobaux, setCommentairesGlobaux] = useState<Record<string, string>>({})
  const [commentaireProjet, setCommentaireProjet] = useState("")
  const [grillesValidees, setGrillesValidees] = useState<Record<string, boolean>>({})
  const [notationFinalisee, setNotationFinalisee] = useState(false)
  const debounceRef = useRef<Record<string, NodeJS.Timeout>>({})

  // Récupère une note spécifique
// Version améliorée :
const getNote = (grilleId: string, critereId: number, etudiantId?: number) => {
  return notations.find(n => 
    n.grilleId === grilleId && 
    n.critereId === critereId &&
    (etudiantId === undefined 
      ? n.studentId === null && n.etudiantId === null
      : n.studentId === etudiantId.toString() || n.etudiantId === etudiantId.toString())
  );
};

  // Met à jour ou ajoute une note
const updateNote = (notation: Notation) => {
  setNotations(prev => {
    const key = `${notation.grilleId}-${notation.critereId}-${notation.studentId ?? 'groupe'}`;
    const existingIndex = prev.findIndex(n => 
      `${n.grilleId}-${n.critereId}-${n.studentId ?? 'groupe'}` === key
    );
    
    return existingIndex >= 0 
      ? prev.map((n, i) => i === existingIndex ? notation : n)
      : [...prev, notation];
  });
};

 const debouncedSave = (notation: Notation) => {
  const key = `${notation.grilleId}-${notation.critereId}-${notation.etudiantId ?? 'groupe'}`;
  
  if (debounceRef.current[key]) {
    clearTimeout(debounceRef.current[key]);
  }
  
  debounceRef.current[key] = setTimeout(async () => {
    try {
      await gradingApi.saveNoteForCritere(
        projectId, 
        groupId, 
        {
          grilleId: notation.grilleId,
          critereId: notation.critereId,
          note: parseFloat(notation.note),
          commentaire: notation.commentaire ?? undefined,
          studentId: notation.etudiantId ? Number(notation.etudiantId) : undefined  // Conversion en number ou undefined
        }
      );
    } catch (error) {
      console.error("Erreur de sauvegarde:", error);
      toast({ 
        title: "Erreur", 
        description: "Échec de la sauvegarde", 
        variant: "destructive" 
      });
    }
  }, 800);
};

 const handleNoteChange = (
  grilleId: string,
  critereId: number,
  note?: number,
  commentaire?: string,
  studentId?: number
) => {
  const existing = getNote(grilleId, critereId, studentId);
  
  const updatedNotation: Notation = {
    id: existing?.id || crypto.randomUUID(),
    grilleId,
    critereId,
    studentId: studentId !== undefined ? studentId.toString() : null,
    etudiantId: studentId !== undefined ? studentId.toString() : null,
    note: (note !== undefined ? note : existing?.note ? parseFloat(existing.note) : 0).toString(),
    commentaire: commentaire ?? existing?.commentaire ?? ""
  };
  
  updateNote(updatedNotation);
  debouncedSave(updatedNotation);
  
  if (onNotationChange) {
    onNotationChange(notations);
  }
};
  useEffect(() => {
  const loadExistingNotation = async () => {
  try {
    const existingNotation = await gradingApi.getGroupNotation(projectId, groupId);

    if (existingNotation) {
      // Convertir les notes de l'API en format Notation[]
      const loadedNotations: Notation[] = existingNotation.notes.map((note: any) => ({
        id: note.id,
        grilleId: note.grilleId,
        critereId: note.critereId,
        studentId: note.studentId,
        note: note.note,
        commentaire: note.commentaire || "",
        etudiantId: note.etudiantId
      }));

      setNotations(loadedNotations);
      setCommentaireProjet(existingNotation.commentaireProjet || "");

      // Initialiser les commentaires globaux
        const commentaires: Record<string, string> = {};
      if (Array.isArray(existingNotation.commentairesGlobaux)) {
        existingNotation.commentairesGlobaux.forEach((grille: { id: string }) => {
          commentaires[grille.id] = "";
        });
      } else if (existingNotation.commentairesGlobaux && typeof existingNotation.commentairesGlobaux === 'object') {
        // Si c'est un objet, parcourir les clés
        Object.keys(existingNotation.commentairesGlobaux).forEach(id => {
          commentaires[id] = existingNotation.commentairesGlobaux[id] || "";
        });
      }

      // Marquer les grilles comme validées (version sécurisée)
      const valides: Record<string, boolean> = {};
      if (Array.isArray(existingNotation.grillesValidees)) {
        existingNotation.grillesValidees.forEach((grille: { id: string }) => {
          valides[grille.id] = true;
        });
      } else if (existingNotation.grillesValidees && typeof existingNotation.grillesValidees === 'object') {
        // Si c'est un objet, parcourir les clés
        Object.keys(existingNotation.grillesValidees).forEach(id => {
          valides[id] = true;
        });
      }

      setCommentairesGlobaux(commentaires);
      setGrillesValidees(valides);
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

  // Nettoyage des timeouts à la destruction du composant
  useEffect(() => {
    return () => {
      Object.values(debounceRef.current).forEach(clearTimeout);
    };
  }, []);

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
    // Note globale du groupe
    const noteFinaleGroupe = calcNoteGlobale();
    
    // Sauvegarder la note de groupe
    const payloadGroupe = {
      commentaireProjet: commentaireProjet || undefined,
      noteFinale: parseFloat(noteFinaleGroupe.toFixed(2)),
      studentId: undefined // null pour le groupe
    };

    await gradingApi.saveNotation(projectId, groupId, payloadGroupe);

    // Optionnel : Sauvegarder des notes individuelles si nécessaire
    if (group?.groupStudent) {
      for (const groupStudent of group.groupStudent) {
        const noteIndividuelle = calcNoteIndividuelle(groupStudent.studentId);
        
        if (noteIndividuelle > 0) {
          const payloadEtudiant = {
            commentaireProjet: `Note individuelle pour ${groupStudent.student.prenom} ${groupStudent.student.nom}`,
            noteFinale: parseFloat(noteIndividuelle.toFixed(2)),
            studentId: groupStudent.studentId.toString()
          };
          
          await gradingApi.saveNotation(projectId, groupId, payloadEtudiant);
        }
      }
    }

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
// Fonction pour calculer la note d'un étudiant spécifique
const calcNoteIndividuelle = (studentId: number) => {
  return grilles.reduce((acc, grille) => {
    let noteGrille = 0;
    let totalPoids = 0;

    grille.criteres.forEach(critere => {
      if (critere.typeEvaluation === "groupe") {
        // Pour les critères de groupe, on prend la note commune
        const note = getNote(grille.id, critere.id);
        if (note) {
          const noteValue = typeof note.note === 'string' ? parseFloat(note.note) : note.note;
          noteGrille += noteValue * (critere.poids / 100);
          totalPoids += critere.poids;
        }
      } else {
        // Pour les critères individuels, on prend la note de l'étudiant
        const note = getNote(grille.id, critere.id, studentId);
        if (note) {
          const noteValue = typeof note.note === 'string' ? parseFloat(note.note) : note.note;
          noteGrille += noteValue * (critere.poids / 100);
          totalPoids += critere.poids;
        }
      }
    });

    return acc + (totalPoids > 0 ? noteGrille : 0) * grille.ponderationGlobale;
  }, 0);
};
 const calcNoteGrille = useCallback((grille: Grille) => {
  return grille.criteres.reduce((total, critere) => {
    if (critere.typeEvaluation === "groupe") {
      const note = getNote(grille.id, critere.id);
      if (note) {
        const noteValue = typeof note.note === 'string' ? parseFloat(note.note) : note.note;
        return total + noteValue * (critere.poids / 100);
      }
    } else {
      const notes = notations.filter(n => 
        n.grilleId === grille.id && 
        n.critereId === critere.id &&
        (n.studentId !== null || n.etudiantId !== null)
      );
      
      if (notes.length > 0) {
        const sum = notes.reduce((acc, n) => {
          const noteValue = typeof n.note === 'string' ? parseFloat(n.note) : n.note;
          return acc + noteValue;
        }, 0);
        return total + (sum / notes.length) * (critere.poids / 100);
      }
    }
    return total;
  }, 0);
}, [notations]);

  // Calculer la note globale du projet
  const calcNoteGlobale = () => {
    return grilles.reduce((acc, grille) => {
      const noteGrille = calcNoteGrille(grille);
      return acc + noteGrille * grille.ponderationGlobale;
    }, 0);
  }

  // Vérifier si une grille est complète
  const isGrilleComplete = (grille: Grille) => {
    return grille.criteres.every(critere => {
      if (critere.typeEvaluation === 'groupe') {
        return !!getNote(grille.id, critere.id);
      } else {
        return group?.groupStudent?.every(student => 
          !!getNote(grille.id, critere.id, student.studentId)
        );
      }
    });
  }

const calcMoyenneCritereIndividuel = (grilleId: string, critereId: number) => {
  const notesEtudiants = notations.filter(n => 
    n.grilleId === grilleId && 
    n.critereId === critereId &&
    (n.studentId !== null || n.etudiantId !== null) // Exclure les notes de groupe
  );
  
  if (notesEtudiants.length === 0) return null;
  
  const sum = notesEtudiants.reduce((acc, n) => {
    // Convertir la note en number si c'est une string
    const noteValue = typeof n.note === 'string' ? parseFloat(n.note) : n.note;
    return acc + noteValue;
  }, 0);
  
  return (sum / notesEtudiants.length).toFixed(2);
};

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'livrable': return 'Livrable';
      case 'rapport': return 'Rapport';
      case 'soutenance': return 'Soutenance';
      default: return type;
    }
  }

  const getGrillesByType = (type: string) => {
    return grilles.filter(g => g.type === type);
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
                      <div key={critere.id} className="p-4 border rounded-lg space-y-4">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">{critere.nom}</h4>
                            {critere.description && (
                              <p className="text-sm text-muted-foreground">{critere.description}</p>
                            )}
                            <span className="text-sm text-blue-600 font-medium">
                              Poids: {critere.poids}% • Évaluation: {critere.typeEvaluation === 'individuel' ? 'Individuelle' : 'Groupe'}
                            </span>

                            {critere.typeEvaluation === 'individuel' && (
                              <p className="text-sm mt-1 text-green-700">
                                Moyenne du critère : {calcMoyenneCritereIndividuel(grille.id, critere.id) ?? '—'}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* GROUPE ou INDIVIDUEL */}
{critere.typeEvaluation === 'individuel' ? (
  <div className="space-y-3">
    {group?.groupStudent?.map((groupStudent) => {
      const note = getNote(grille.id, critere.id, groupStudent.studentId);
      return (
        <div key={`${critere.id}-${groupStudent.studentId}`} className="p-3 border rounded-md">
          <div className="font-medium mb-2">
            {groupStudent.student.prenom} {groupStudent.student.nom} ({groupStudent.student.username})
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Note sur 20</Label>
              <Input
                type="number"
                min="0"
                max="20"
                step="0.25"
                value={note ? parseFloat(note.note) : 0}
                onChange={(e) => handleNoteChange(
                    grille.id, 
                    critere.id, 
                    parseFloat(e.target.value), 
                    undefined, 
                    groupStudent.studentId
                )}
                />
            </div>
            <div>
              <Label>Commentaire</Label>
              <Textarea
                value={note?.commentaire || ""}
                onChange={(e) => handleNoteChange(
                  grille.id, 
                  critere.id, 
                  undefined, 
                  e.target.value, 
                  groupStudent.studentId  // Utilisation de studentId ici
                )}
                rows={2}
              />
            </div>
          </div>
        </div>
      );
    })}
  </div>
) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Note sur 20</Label>
                              <Input
                                type="number"
                                min="0"
                                max="20"
                                step="0.25"
                                value={getNote(grille.id, critere.id)?.note || 0}
                                onChange={(e) => handleNoteChange(
                                  grille.id, 
                                  critere.id, 
                                  parseFloat(e.target.value)
                                )}
                              />
                            </div>
                            <div>
                              <Label>Commentaire</Label>
                              <Textarea
                                value={getNote(grille.id, critere.id)?.commentaire || ""}
                                onChange={(e) => handleNoteChange(
                                  grille.id, 
                                  critere.id, 
                                  undefined, 
                                  e.target.value
                                )}
                                rows={2}
                              />
                            </div>
                          </div>
                        )}
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
                  console.log('Notes:', notations);
                  console.log('Commentaires:', commentairesGlobaux);
                  console.log('Note finale:', calcNoteGlobale());
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                Prévisualiser
              </Button>
              
              <Button
                onClick={finaliserNotation}
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