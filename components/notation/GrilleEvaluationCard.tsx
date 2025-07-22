// components/notation/GrilleEvaluationCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface GrilleEvaluationCardProps {
    grille: any
    groupeId: number
    students?: any[] // AJOUTER pour les critères individuels
    onNoteChange: (grilleId: string, critereId: number, note?: number, commentaire?: string, studentId?: number) => void // MODIFIER
    onCommentaireGlobalChange?: (grilleId: string, commentaire: string) => void
}

export function GrilleEvaluationCard({
  grille,
  groupeId,
  students = [],
  onNoteChange,
  onCommentaireGlobalChange
}: GrilleEvaluationCardProps) {
  return (
    <div className="space-y-4">
      {grille.criteres.map((critere: any) => (
        <Card key={critere.id} className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-base flex items-center gap-2">
                  {critere.nom}
                  <Badge variant={critere.typeEvaluation === 'groupe' ? 'default' : 'secondary'}>
                    {critere.typeEvaluation}
                  </Badge>
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  Poids: {critere.poids}%
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* ✅ GESTION DES NOTES INDIVIDUELLES */}
            {critere.typeEvaluation === 'individuel' ? (
              students.map((student) => (
                <div key={student.id} className="ml-4 border-l-2 border-l-gray-300 pl-4 space-y-2">
                  <div className="text-sm font-semibold">{student.prenom} {student.nom}</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`note-${critere.id}-${student.id}`}>Note (/20)</Label>
                      <Input
                        id={`note-${critere.id}-${student.id}`}
                        type="number"
                        min="0"
                        max="20"
                        step="0.5"
                        placeholder="0"
                        onChange={(e) =>
                          onNoteChange(
                            grille.id,
                            critere.id,
                            parseFloat(e.target.value) || 0,
                            undefined,
                            student.id
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`commentaire-${critere.id}-${student.id}`}>Commentaire</Label>
                      <Textarea
                        id={`commentaire-${critere.id}-${student.id}`}
                        placeholder="Commentaire pour cet étudiant..."
                        rows={2}
                        onChange={(e) =>
                          onNoteChange(
                            grille.id,
                            critere.id,
                            undefined,
                            e.target.value,
                            student.id
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // ✅ GESTION DES NOTES GROUPE
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`note-${critere.id}`}>Note (/20)</Label>
                  <Input
                    id={`note-${critere.id}`}
                    type="number"
                    min="0"
                    max="20"
                    step="0.5"
                    placeholder="0"
                    onChange={(e) =>
                      onNoteChange(
                        grille.id,
                        critere.id,
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`commentaire-${critere.id}`}>Commentaire</Label>
                  <Textarea
                    id={`commentaire-${critere.id}`}
                    placeholder="Commentaire pour ce critère..."
                    rows={2}
                    onChange={(e) =>
                      onNoteChange(
                        grille.id,
                        critere.id,
                        undefined,
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* ✅ COMMENTAIRE GLOBAL */}
      {onCommentaireGlobalChange && (
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-base">Commentaire global pour cette grille</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Commentaire général sur cette grille d'évaluation..."
              rows={3}
              onChange={(e) => onCommentaireGlobalChange(grille.id, e.target.value)}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
