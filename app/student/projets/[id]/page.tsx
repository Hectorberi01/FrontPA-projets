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
import {useRouter} from "next/navigation";
import {useAuth} from "@/hooks/authContext";
import {now} from "moment";
import {color} from "d3-color";

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
  const[estDansGroup, setEstDansGroup] = useState<boolean>();
  const router = useRouter()

  const onClose = useCallback(() => setIsOpen(false), []);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const [openUpload, setOpenUpload] = useState(false)
  const [estsoutenancepasse, setEstSoutenancePasse] = useState<boolean>();
  const { user, token } = useAuth();


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
      createdAt: now,
      updatedAt: now,
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
    const studentId = user?.id;

    const groupe = projets.groups?.find((group: any) =>
        group.groupStudent.some((gs: any) => gs.studentId === studentId)
    );

    if (groupe?.id) {
      setGroupId(groupe.id);
    }

    const estDansUnGroupe = projets.groups.some((group:any) =>
        group.groupStudent.some((member:any) => member.studentId === studentId)
    );

    const estSoutenancePasse = projets.soutenanceDate && new Date(projets.soutenanceDate) < new Date() && projets.allowLate === false;
    setEstSoutenancePasse(estSoutenancePasse)
    console.log("estDansUnGroupe", estDansUnGroupe);
    setEstDansGroup(estDansUnGroupe);


  }, [projets]);

  console.log("estDansGroup", estDansGroup);
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
                  const studentId = user?.id;

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
                const studentId = user?.id;
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
                                <p className="font-medium"><strong>{membre.student.prenom} {membre.student.nom}</strong></p>
                                <p className="text-xs text-gray-500" style={{color:"blue"}}><strong>{membre.student.email}</strong></p>
                              </div>
                              <Badge variant="outline">{membre.student.role.name}</Badge>
                            </div>
                        ))}

                        <h3 style={{color: "green"}}><strong>Note du groupe : </strong></h3>
                        {/*<Button className="w-full" asChild>*/}
                        {/*  <Link href={`/student/groupes/${groupe.id}`}>*/}
                        {/*    <Users className="mr-2 h-4 w-4" />*/}
                        {/*    Gérer mon groupe*/}
                        {/*  </Link>*/}
                        {/*</Button>*/}
                      </div>
                  );
                } else {
                  return (
                      <div className="text-center py-6">
                        <p className="text-gray-500 mb-4">
                          Vous n'êtes pas encore assigné à un groupe pour ce projet.
                        </p>

                        {projets?.statut !== "Terminé" && (
                            <Button size="sm"
                                    onClick={() => {
                                      localStorage.setItem("selectedProject", JSON.stringify(projets));
                                      router.push(`/student/projets/${projets.id}/rejoindre-groupe`);
                                    }}
                            >
                              Rejoindre un groupe
                            </Button>)
                        }
                      </div>
                  );
                }
              })()}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="livrables" className="mt-8">
          <TabsList className="flex space-x-2 rounded-lg bg-gray-100 p-1 w-full max-w-3xl mx-auto">
            <TabsTrigger value="livrables"
                         className="px-4 py-2 text-sm font-medium text-gray-600 data-[state=active]:bg-white data-[state=active]:text-black rounded-md transition"
            >
              Livrables
            </TabsTrigger>
            <TabsTrigger value="rapports"
                         className="px-4 py-2 text-sm font-medium text-gray-600 data-[state=active]:bg-white data-[state=active]:text-black rounded-md transition"
            >
              Rapports
            </TabsTrigger>
            <TabsTrigger value="soutenance"
                         className="px-4 py-2 text-sm font-medium text-gray-600 data-[state=active]:bg-white data-[state=active]:text-black rounded-md transition"
            >
              Soutenance
            </TabsTrigger>
            <TabsTrigger value="ordre"
                         className="px-4 py-2 text-sm font-medium text-gray-600 data-[state=active]:bg-white data-[state=active]:text-black rounded-md transition"
            >
              Ordre de passage
            </TabsTrigger>
          </TabsList>

          <TabsContent value="livrables" className="mt-6">
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Livrables</CardTitle>
                  <CardDescription>Liste des livrables à soumettre pour ce projet</CardDescription>
                  <Dialog>
                    <DialogTrigger asChild>
                      {estDansGroup && (
                          <div className="space-y-2">
                          <Button onClick={() => setOpenUpload(true)} disabled={estsoutenancepasse}>Soumettre un livrable</Button>
                            {estsoutenancepasse && (
                                <p className="text-sm text-red-500">
                                  Vous ne pouvez plus soumettre de livrable, la date de soutenance est dépassée et les retards ne sont pas autorisés.
                                </p>
                            )}
                          </div>
                      )}
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

                  const studentId = user?.id;
                  const groupe = projets?.groups?.find((group: any) =>
                      group.groupStudent.some((gs: any) => gs.studentId === studentId)
                  );

                  if (!groupe) {
                    return (
                        <div className="text-center py-6">
                          <p className="text-gray-500 mb-4">Vous n'avez pas encore de groupe pour ce projet.</p>
                          {projets?.statut !== "Terminé" && (
                              <Button size="sm"
                                      onClick={() => {
                                        localStorage.setItem("selectedProject", JSON.stringify(projets));
                                        router.push(`/student/projets/${projets.id}/rejoindre-groupe`);
                                      }}
                              >
                                Rejoindre un groupe
                              </Button>)
                          }
                        </div>
                    );
                  }

                  const livrablesGroupe = projets.livrables?.filter(
                      (livrable: any) => livrable.groupId === groupe.id
                  ) || [];

                  // if (livrablesGroupe.length === 0) {
                  //   localStorage.setItem("selectedProject", JSON.stringify(projets));
                  //   localStorage.setItem("groupId", JSON.stringify(groupId))
                  //   return <Button size="sm" asChild>
                  //     <Link href={`/student/livrables/${projets.id}/soumettre`}>
                  //       <ClipboardList className="mr-2 h-4 w-4" />
                  //       Soumettre
                  //     </Link>
                  //   </Button>
                  // }

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
                                    <Button variant="outline" size="sm" asChild style={{color:"blue"}}
                                            className="border-blue-600 text-blue-600 hover:bg-blue-50"
                                    >
                                      <Link href={`http://localhost:3000/api/livrables/download?url=${livrable.fileUrl}`}>Télécharger votre livrable</Link>
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
                        )
                        ) }
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


                  <Dialog>
                    <DialogTrigger asChild>
                        {estDansGroup && (
                            <div className="space-y-2">
                              <Button onClick={handleOpen} disabled={estsoutenancepasse}>Rédiger un rapport</Button>

                              {estsoutenancepasse && (
                                <p className="text-sm text-red-500">
                                Vous ne pouvez plus soumettre de rapport, la date de soutenance est dépassée et les retards ne sont pas autorisés.
                                </p>
                              )}
                            </div>
                        )}
                      {/*<Button onClick={handleOpen}>Rédiger un rapport</Button>*/}
                    </DialogTrigger>
                        <RapportEditorModal isOpen={isOpen} onClose={onClose} rapport={reports ?? { title: '', content: '' }} onSave={ handleSave} />
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {(() => {
                  const studentId = user?.id;
                  const groupe = projets?.groups?.find((group: any) =>
                      group.groupStudent.some((gs: any) => gs.studentId === studentId)
                  );

                  if (!groupe) {
                    return (
                        <div className="text-center py-6">
                          <p className="text-gray-500 mb-4">Vous n'avez pas encore de groupe pour ce projet.</p>
                          {projets?.statut !== "Terminé" && (
                          <Button size="sm"
                                  onClick={() => {
                                    localStorage.setItem("selectedProject", JSON.stringify(projets));
                                    router.push(`/student/projets/${projets.id}/rejoindre-groupe`);
                                  }}
                          >
                            {/*<Link href={`/student/projets/${project.id}/rejoindre-groupe`}>Rejoindre un groupe</Link>*/}
                            Rejoindre un groupe
                          </Button>)}
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
                  const studentId = user?.id;
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
                            <p className="font-medium" style={{color:"blue"}}><strong>{date}</strong></p>
                          </div>
                          <div className="border rounded-lg p-4">
                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                              <Calendar size={16} />
                              <span className="text-sm">Heure</span>
                            </div>
                            <p className="font-medium" style={{color:"green"}}><strong>{heure}</strong></p>
                          </div>
                          <div className="border rounded-lg p-4">
                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                              <Calendar size={16} />
                              <span className="text-sm">Lieu</span>
                            </div>
                            <p className="font-medium" style={{color:"red"}}><strong>{lieu}</strong></p>
                          </div>
                          <div className="border rounded-lg p-4">
                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                              <Calendar size={16} />
                              <span className="text-sm">Durée</span>
                            </div>
                            <p className="font-medium"><strong>{duree}</strong></p>
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
          <TabsContent value="ordre" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-gray-700">Ordre de passage</CardTitle>
                  <CardDescription className="text-xs text-gray-500">Ordre de passage pour la soutenance</CardDescription>
                </div>
              </CardHeader>

              <CardContent>
                {projets?.soutenances && projets.soutenances.length > 0  ? (
                    <table className="w-full text-sm text-left border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                      <thead className="bg-green-100 text-green-800">
                      <tr>
                        <th className="p-3 border-b font-semibold">Ordre</th>
                        <th className="p-3 border-b font-semibold">Nom du groupe</th>
                        <th className="p-3 border-b font-semibold">Début</th>
                        <th className="p-3 border-b font-semibold">Fin</th>
                      </tr>
                      </thead>
                      <tbody>
                      {projets.soutenances
                          .sort((a: any, b: any) => a.order - b.order)
                          .map((soutenance: any, index: number) => {
                            const group = projets.groups.find((g: any) => g.id === soutenance.groupId);

                            const formatTime = (iso: string) => {
                              const date = new Date(iso);
                              return date.toLocaleTimeString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              });
                            };

                            return (
                                <tr
                                    key={index}
                                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"}
                                >
                                  <td className="p-3 border-b">{soutenance.order}</td>
                                  <td className="p-3 border-b">{group?.name ?? "Groupe inconnu"}</td>
                                  <td className="p-3 border-b">{formatTime(soutenance.startTime)}</td>
                                  <td className="p-3 border-b">{formatTime(soutenance.endTime)}</td>
                                </tr>
                            );
                          })}
                      </tbody>
                    </table>
                ) : (
                    <div className="text-center text-gray-500 italic">
                      Aucune soutenance prévue pour le moment.
                    </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </StudentLayout>
  )
}
