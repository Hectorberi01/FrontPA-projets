'use client'
import { StudentLayout } from "@/components/layout/student-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, ClipboardList, FileText, Users } from "lucide-react"
import Link from "next/link"
import {useCallback, useEffect, useState} from "react";
import {getProjectById} from "@/lib/services/project";
import { use } from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {RapportEditorModal} from "@/components/modals/rapport-editor-modal";
import {createNewReport} from "@/lib/services/report";
import Swal from "sweetalert2";
import {DocumentUploadModal} from "@/components/modals/upload-livrable-modal";
import {uploadLivrable} from "@/lib/services/livrables";

interface report {
  title:string
  content:string
}
export default function StudentProjetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [projets, setProjet] = useState<any>()
  const  [isOpen, setIsOpen] = useState<boolean>(false);
  const [reports, setReports] = useState<report>();
  const[groupId, setGroupId] = useState();

  const onClose = useCallback(() => setIsOpen(false), []);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const [openUpload, setOpenUpload] = useState(false)


  const handleUpload = async (data: { name: string ,description: string, repoLink?: string, file: File }) => {
    const formData = new FormData();
    formData.append("name",data.name);
    formData.append("description",data.description);
    formData.append("file",data.file);
    formData.append("projectId", projets.id);
    if (data.repoLink) {
      formData.append("githubUrl", data.repoLink);
    }
    if (groupId !== undefined) {
      formData.append("groupId", groupId);
    }
    onClose();
    try {
      const response = await uploadLivrable(formData);
      if(response){
        Swal.fire({
          title: "livrable soumis avec succes",
          icon: "success",
          draggable: true
        }).then(() => {
          setTimeout(() => {
            window.location.reload();
          }, 10000);
        });
      }else {
        Swal.fire({
          title: "un erreur lors de la soumision du livrable",
          icon: "error",
          draggable: true
        }).then(() => {
          setTimeout(() => {
            window.location.reload();
          }, 10000);
        });
      }
    }catch(error) {

    }
    window.location.reload();
    console.log("Fichiers uploadés :", data)
  }

  const handleSave = async (data:any) => {

    const reportData = {
      projectId: projets?.id,
      groupId: groupId,
      title: data.title,
      content: data.content,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    handleClose();

    if(reportData.projectId ===0 && reportData.groupId === 0 ) {
      alert("Imposible de créer le rapport")
    }else {
      const result = await createNewReport(reportData);
      if (result) {
        Swal.fire({
          title: "rapport soumis avec succes",
          icon: "success",
          draggable: true
        }).then(() => {
          setTimeout(() => {
            window.location.reload();
          }, 10000);
        });
      }else {
        Swal.fire({
          title: "un erreur lors de la soumision",
          icon: "error",
          draggable: true
        }).then(() => {
          setTimeout(() => {
            window.location.reload();
          }, 10000);
        });
      }
    }
    //window.location.reload();
  }
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const result = await getProjectById(Number(id))
        setProjet(result)
      } catch (err) {
        console.error("Projet non trouvé", err)
      }
    }
    if (id) fetchProject()
  }, [id])

  useEffect(() => {
    if (!projets) return;

    const studentData = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    const user = studentData ? JSON.parse(studentData) : null;
    const studentId = user?.user?.id;

    const groupe = projets.groups?.find((group: any) =>
        group.groupStudent.some((gs: any) => gs.studentId === studentId)
    );

    if (groupe?.id) {
      setGroupId(groupe.id);
    }
  }, [projets]);

  return (
    <StudentLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/student/projets">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{projets?.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                {/*<Badge variant="outline">{projet.promotion}</Badge>*/}
                {(() => {
                  const today = new Date();
                  const soutenanceDate = projets?.soutenanceDate ? new Date(projets?.soutenanceDate) : null;

                  const statut =
                      soutenanceDate && soutenanceDate < today ? "Terminé" : "En cours";

                  return (
                      <Badge
                          variant={
                            statut === "En cours"
                                ? "default"
                                : statut === "Terminé"
                                    ? "secondary"
                                    : "outline"
                          }
                      >
                        {statut}
                      </Badge>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{projets?.description}</p>

              <div className="mt-6 space-y-4">
                {/*<div>*/}
                {/*  <h3 className="text-sm font-medium text-gray-500">Progression globale</h3>*/}
                {/*  <div className="mt-2 flex items-center gap-4">*/}
                {/*    <Progress value={projet.progression} className="flex-1" />*/}
                {/*    <span className="text-sm font-medium">{projet.progression}%</span>*/}
                {/*  </div>*/}
                {/*</div>*/}

                {/*<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">*/}
                {/*  <div>*/}
                {/*    <h3 className="text-sm font-medium text-gray-500">Date de début</h3>*/}
                {/*    <p className="mt-1">{projet.dateDebut}</p>*/}
                {/*  </div>*/}
                {/*  <div>*/}
                {/*    <h3 className="text-sm font-medium text-gray-500">Date de fin</h3>*/}
                {/*    <p className="mt-1">{projet.dateFin}</p>*/}
                {/*  </div>*/}
                {/*</div>*/}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mon groupe</CardTitle>
              <CardDescription>
                {/*{projet.groupe ? `${projet.groupe.nom} - ${projet.groupe.membres.length} membres` : "Non assigné"}*/}
                {(() => {
                  const studentData = typeof window !== "undefined" ? localStorage.getItem("user") : null;
                  const user = studentData ? JSON.parse(studentData) : null;
                  const studentId = user?.user?.id;

                  const groupe = projets?.groups?.find((group: any) =>
                      group.groupStudent.some((gs: any) => gs.studentId === studentId)
                  );

                  return groupe
                      ? `${groupe.name} - ${groupe.groupStudent.length} membre${groupe.groupStudent.length > 1 ? 's' : ''}`
                      : "Non assigné";
                })()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const studentData = typeof window !== "undefined" ? localStorage.getItem("user") : null;
                const user = studentData ? JSON.parse(studentData) : null;
                const studentId = user?.user?.id;

                const groupe = projets?.groups?.find((group: any) =>
                    group.groupStudent.some((gs: any) => gs.studentId === studentId)
                );

                if (groupe) {
                  return (
                      <div className="space-y-4">
                        {groupe.groupStudent.map((membre: any) => (
                            <div
                                key={membre.id}
                                className="flex items-center justify-between py-2 border-b last:border-0"
                            >
                              <div>
                                <p className="font-medium">{membre.student.prenom} {membre.student.nom}</p>
                                <p className="text-xs text-gray-500">{membre.student.email}</p>
                              </div>
                              <Badge variant="outline">{membre.student.role.name}</Badge>
                            </div>
                        ))}

                        <Button className="w-full" asChild>
                          <Link href={`/student/groupes/${groupe.id}`}>
                            <Users className="mr-2 h-4 w-4" />
                            Gérer mon groupe
                          </Link>
                        </Button>
                      </div>
                  );
                } else {
                  return (
                      <div className="text-center py-6">
                        <p className="text-gray-500 mb-4">
                          Vous n'êtes pas encore assigné à un groupe pour ce projet.
                        </p>
                        <Button asChild>
                          <Link href={`/student/projets/${projets?.id}/rejoindre-groupe`}>
                            Rejoindre un groupe
                          </Link>
                        </Button>
                      </div>
                  );
                }
              })()}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="livrables" className="mt-8">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="livrables">Livrables</TabsTrigger>
            <TabsTrigger value="rapports">Rapports</TabsTrigger>
            <TabsTrigger value="soutenance">Soutenance</TabsTrigger>
          </TabsList>

          <TabsContent value="livrables" className="mt-6">
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Livrables</CardTitle>
                  <CardDescription>Liste des livrables à soumettre pour ce projet</CardDescription>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button onClick={() => setOpenUpload(true)}>Soumettre un livrable</Button>
                    </DialogTrigger>
                    <DocumentUploadModal
                        isOpen={openUpload}
                        onClose={() => setOpenUpload(false)}
                        onUpload={handleUpload}
                    />
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {(() => {
                  const studentData = typeof window !== "undefined" ? localStorage.getItem("user") : null;
                  const user = studentData ? JSON.parse(studentData) : null;
                  const studentId = user?.user?.id;

                  const groupe = projets?.groups?.find((group: any) =>
                      group.groupStudent.some((gs: any) => gs.studentId === studentId)
                  );

                  if (!groupe) {
                    return (
                        <div className="text-center py-6">
                          <p className="text-gray-500 mb-4">Vous n'avez pas encore de groupe pour ce projet.</p>
                          <Button asChild>
                            <Link href={`/student/projets/${projets?.id}/rejoindre-groupe`}>Rejoindre un groupe</Link>
                          </Button>
                        </div>
                    );
                  }

                  const livrablesGroupe = projets.livrables?.filter(
                      (livrable: any) => livrable.groupId === groupe.id
                  ) || [];

                  if (livrablesGroupe.length === 0) {
                    return <p className="text-gray-500">Aucun livrable soumis par votre groupe.</p>;
                  }

                  return (
                      <div className="space-y-4">
                        {livrablesGroupe.map((livrable: any) => (
                            <div
                                key={livrable.id}
                                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold">{livrable.name}</h3>
                                  <p className="text-sm text-gray-500 mt-1">
                                    Soumis le : {new Date(livrable.submittedAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <Badge variant={livrable.submittedAt ? "secondary" : "outline"}>
                                  {livrable.submittedAt ? "Soumis" : "Non soumis"}
                                </Badge>
                              </div>

                              <div className="mt-4 flex justify-end">
                                {livrable.submittedAt ? (
                                    <Button variant="outline" size="sm" asChild>
                                      <Link href={`http://localhost:3000/api/livrables/${livrable.id}/download`}>Télécharger votre livrable</Link>
                                    </Button>
                                ) : (
                                    <Button size="sm" asChild>
                                      <Link href={`/student/livrables/${livrable.id}/soumettre`}>
                                        <ClipboardList className="mr-2 h-4 w-4" />
                                        Soumettre
                                      </Link>
                                    </Button>
                                )}
                              </div>
                            </div>
                        ))}
                      </div>
                  );
                })()}
              </CardContent>

            </Card>
          </TabsContent>

          <TabsContent value="rapports" className="mt-6">
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Rapports</CardTitle>
                  <CardDescription>Liste des rapports du projet</CardDescription>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={handleOpen}>Rédiger un rapport</Button>
                  </DialogTrigger>
                      <RapportEditorModal isOpen={isOpen} onClose={onClose} rapport={reports ?? { title: '', content: '' }} onSave={ handleSave} />
                </Dialog>
              </CardHeader>
              <CardContent>
                {(() => {
                  const studentData = typeof window !== "undefined" ? localStorage.getItem("user") : null;
                  const user = studentData ? JSON.parse(studentData) : null;
                  const studentId = user?.user?.id;

                  const groupe = projets?.groups?.find((group: any) =>
                      group.groupStudent.some((gs: any) => gs.studentId === studentId)
                  );

                  if (!groupe) {
                    return (
                        <div className="text-center py-6">
                          <p className="text-gray-500 mb-4">Vous n'avez pas encore de groupe pour ce projet.</p>
                          <Button asChild>
                            <Link href={`/student/projets/${projets?.id}/rejoindre-groupe`}>Rejoindre un groupe</Link>
                          </Button>
                        </div>
                    );
                  }

                  const rapportsGroupe = projets.reports?.filter(
                      (rapport: any) => rapport.groupId === groupe.id
                  ) || [];

                  if (rapportsGroupe.length === 0) {
                    return <p className="text-gray-500">Aucun rapport trouvé pour votre groupe.</p>;
                  }

                  return (
                      <div className="space-y-4">
                        {rapportsGroupe.map((rapport: any) => {
                          const statut = rapport.content
                              ? "Soumis"
                              : rapport.title
                                  ? "En cours"
                                  : "Non commencé";

                          return (
                              <div
                                  key={rapport.id}
                                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-semibold">{rapport.title || "Rapport sans titre"}</h3>
                                    <div dangerouslySetInnerHTML={{__html: rapport.content}}/>
                                    <p className="text-sm text-gray-500 mt-1">
                                      {/*{rapport?.content}*/}
                                      Dernière mise à jour : {new Date(rapport.updatedAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <Badge
                                      variant={
                                        statut === "Soumis"
                                            ? "secondary"
                                            : statut === "En cours"
                                                ? "default"
                                                : "outline"
                                      }
                                  >
                                    {statut}
                                  </Badge>
                                </div>

                                {/*<div className="mt-4 flex justify-end">*/}
                                {/*  {statut === "Soumis" ? (*/}
                                {/*      <Button variant="outline" size="sm" asChild>*/}
                                {/*        <Link href={`/student/rapports/${rapport.id}`}>Voir rapport</Link>*/}
                                {/*      </Button>*/}
                                {/*  ) : (*/}
                                {/*      <Button size="sm" asChild>*/}
                                {/*        <Link href={`/student/rapports/${rapport.id}/editer`}>*/}
                                {/*          <FileText className="mr-2 h-4 w-4" />*/}
                                {/*          {statut === "En cours" ? "Continuer" : "Rédiger"}*/}
                                {/*        </Link>*/}
                                {/*      </Button>*/}
                                {/*  )}*/}
                                {/*</div>*/}
                              </div>
                          );
                        })}
                      </div>
                  );
                })()}
              </CardContent>

            </Card>
          </TabsContent>

          <TabsContent value="soutenance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Soutenance</CardTitle>
                <CardDescription>Informations sur la soutenance du projet</CardDescription>
              </CardHeader>

              <CardContent>
                {(() => {
                  const studentData = typeof window !== "undefined" ? localStorage.getItem("user") : null;
                  const user = studentData ? JSON.parse(studentData) : null;
                  const studentId = user?.user?.id;

                  const groupe = projets?.groups?.find((group: any) =>
                      group.groupStudent.some((gs: any) => gs.studentId === studentId)
                  );

                  if (!groupe) {
                    return (
                        <div className="text-center py-6">
                          <p className="text-gray-500 mb-4">Vous n'avez pas encore de groupe pour ce projet.</p>
                        </div>
                    );
                  }

                  const soutenance = projets.soutenances?.find(
                      (s: any) => s.groupId === groupe.id
                  );

                  if (!soutenance) {
                    return (
                        <div className="text-center py-6">
                          <p className="text-gray-500 mb-4">Aucune soutenance prévue pour votre groupe.</p>
                        </div>
                    );
                  }

                  const date = new Date(soutenance.startTime).toLocaleDateString();
                  const heure = `${new Date(soutenance.startTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })} - ${new Date(soutenance.endTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}`;

                  const dureeMs = new Date(soutenance.endTime).getTime() - new Date(soutenance.startTime).getTime();
                  const minutes = Math.floor(dureeMs / 1000 / 60);
                  const duree = `${minutes} minutes`;

                  const lieu = projets.lieuSoutenance || "À confirmer";

                  return (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="border rounded-lg p-4">
                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                              <Calendar size={16} />
                              <span className="text-sm">Date</span>
                            </div>
                            <p className="font-medium">{date}</p>
                          </div>
                          <div className="border rounded-lg p-4">
                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                              <Calendar size={16} />
                              <span className="text-sm">Heure</span>
                            </div>
                            <p className="font-medium">{heure}</p>
                          </div>
                          <div className="border rounded-lg p-4">
                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                              <Calendar size={16} />
                              <span className="text-sm">Lieu</span>
                            </div>
                            <p className="font-medium">{lieu}</p>
                          </div>
                          <div className="border rounded-lg p-4">
                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                              <Calendar size={16} />
                              <span className="text-sm">Durée</span>
                            </div>
                            <p className="font-medium">{duree}</p>
                          </div>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
                          <h3 className="font-medium text-amber-800 mb-2">Rappel important</h3>
                          <p className="text-sm text-amber-700">
                            N'oubliez pas de préparer votre présentation et d'arriver au moins 15 minutes avant l'heure prévue
                            de votre soutenance.
                          </p>
                        </div>
                      </div>
                  );
                })()}
              </CardContent>

            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StudentLayout>
  )
}
