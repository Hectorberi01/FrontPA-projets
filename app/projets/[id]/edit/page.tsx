'use client'
import {DashboardLayout} from "@/components/layout/dashboard-layout";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import {getProjectById, updateProject} from "@/lib/services/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation"

export default function page() {

    const params = useParams();
    const projectId = params.id as string;
    const router = useRouter();

    const [project, setProject] = useState<any>(null);

    const [form, setForm] = useState({
        name: "",
        description: "",
        minStudents: 1,
        maxStudents: 1,
        lieuSoutenance: "",
        status:"",
        deadline: "",
        soutenanceDate: "",
        allowLate: false,
        mode: "random",
    });

    useEffect(() => {
        const fecthProject = async (projectId: string) =>{
            const id = parseInt(projectId);
            const p = await  getProjectById(id)
            setProject(p)
            setForm({
                name: p.name,
                description: p.description,
                minStudents: p.minStudents,
                maxStudents: p.maxStudents,
                lieuSoutenance: p.lieuSoutenance,
                status: p.status,
                deadline: p.deadline?.slice(0, 16),
                soutenanceDate: p.soutenanceDate?.slice(0, 16),
                allowLate: p.allowLate,
                mode: p.mode
            });
        }

        fecthProject(projectId)
    },[projectId])

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSwitch = (checked: boolean) => {
        setForm(prev => ({ ...prev, allowLate: checked }));
    };

    const handleSubmit = async () => {
        try {
            await updateProject(form, parseInt(projectId));
            alert("Projet modifié !");
            router.push("/projets");
        } catch (e) {
            console.error(e);
            alert("Erreur lors de la modification.");
        }
    };
    return (
        <DashboardLayout>
            <div className="container mx-auto py-10">
                <h1 className="text-2xl font-bold mb-4 ">Modifier le projet</h1>
                <div className="bg-white border rounded-lg shadow-md w-full max-w-2xl mx-auto p-6">
                    {project ? (
                        <form className="space-y-4" onSubmit={e => {
                            e.preventDefault();
                            handleSubmit();
                        }}>
                            <div>
                                <Label>Nom</Label>
                                <Input name="name" value={form.name} onChange={handleChange}/>
                            </div>

                            <div>
                                <Label>Description</Label>
                                <Textarea name="description" value={form.description} onChange={handleChange}/>
                            </div>

                            {/*<div>*/}
                            {/*    <Label>URL du projet</Label>*/}
                            {/*    <Input name="url" value={form.url} onChange={handleChange}/>*/}
                            {/*</div>*/}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Min Étudiants</Label>
                                    <Input type="number" name="minStudents" value={form.minStudents}
                                           onChange={handleChange}/>
                                </div>
                                <div>
                                    <Label>Max Étudiants</Label>
                                    <Input type="number" name="maxStudents" value={form.maxStudents}
                                           onChange={handleChange}/>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Deadline</Label>
                                    <Input type="datetime-local" name="deadline" value={form.deadline}
                                           onChange={handleChange}/>
                                </div>
                                <div>
                                    <Label>Date de soutenance</Label>
                                    <Input type="datetime-local" name="soutenanceDate" value={form.soutenanceDate}
                                           onChange={handleChange}/>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Lieu de soutenance</Label>
                                    <Input type="text" name="lieuSoutenance" value={form.lieuSoutenance}
                                           onChange={handleChange}/>
                                </div>
                                <div>
                                    <Label>Status</Label>
                                    <select name="mode" value={form.status} onChange={handleChange}
                                            className="w-full border p-2 rounded">
                                        <option value="draft">Manuel</option>
                                        <option value="visible">Visible</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <Label>Autoriser le retard</Label>
                                <Switch checked={form.allowLate} onCheckedChange={handleSwitch}/>
                            </div>

                            <div>
                                <Label>Mode de répartition</Label>
                                <select name="mode" value={form.mode} onChange={handleChange}
                                        className="w-full border p-2 rounded">
                                    <option value="manual">Manuel</option>
                                    <option value="random">Aléatoire</option>
                                </select>
                            </div>

                            <Button type="submit">Enregistrer</Button>
                        </form>
                    ) : (
                        <p>Chargement...</p>
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}