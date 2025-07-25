'use client'
import {DashboardLayout} from "@/components/layout/dashboard-layout";
import {useEffect, useState} from "react";
import {CreateProject} from "@/lib/types/projet";
import {createProject} from "@/lib/services/project";
import { useRouter } from "next/navigation";

import {getPromotions} from "@/lib/services/promotionService";
import {boolean} from "zod";
interface promo {
    id: number;
    name: string;
}

export default function CreateProjectPage() {
    const router = useRouter();
    const [promotions, setPromotions] = useState<promo[]>([]);
    const [project, setProject] = useState<any>({
        name: '',
        description: '',
        soutenanceDate: null,
        soutenanceDuration: 0,
        minStudents: 1,
        maxStudents: 1,
        lieuSoutenance:'',
        url:"",
        deadline: null,
        allowLate: false,
        mode: 'manual',
        status: 'draft',
        promotionId: null
    });

    const[file , setFile] = useState<File>();

    const handleChangeFile =(e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const parsedValue =
            value === "true"
                ? true
                : value === "false"
                    ? false
                    : ["minStudents", "maxStudents", "promotionId"].includes(name)
                        ? parseInt(value)
                        : value;


        setProject((prev:any) => ({
            ...prev,
            [name]: parsedValue,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const result = await createProject(project,file)

            if (!result) {
                alert("Une erreur s'est produite");
                return;
            }

            alert("Projet créé avec succès ✅");
            router.push("/projets");
        } catch (err) {
            console.error(err);
            alert("Erreur ❌ lors de la création du projet");
        }
    };

    const fetchPromotions = async () => {
        try {
            const result = await getPromotions()
            setPromotions(result)
        }catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchPromotions();
    }, []);

    return (
        <DashboardLayout>
            <main className="p-4 max-w-2xl mx-auto">
                <h1 className="text-xl font-bold mb-4">Créer un projet</h1>
                <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="block font-medium">Nom du projet</label>
                                <input id="name" name="name" value={project.name} onChange={handleChange} required
                                       className="w-full border p-2"/>
                            </div>

                            <div>
                                <label htmlFor="description" className="block font-medium">Description</label>
                                <textarea id="description" name="description" value={project.description}
                                          onChange={handleChange} required className="w-full border p-2"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="soutenanceDate" className="block font-medium">Date de soutenance</label>
                                <input id="soutenanceDate" name="soutenanceDate" type="datetime-local"
                                       value={project.soutenanceDate ?? ''} onChange={handleChange}
                                       className="w-full border p-2"/>
                            </div>

                            <div>
                                <label htmlFor="soutenanceDate" className="block font-medium">Deadline</label>
                                <input id="deadline" name="deadline" type="datetime-local"
                                       value={project.deadline ?? ''} onChange={handleChange}
                                       className="w-full border p-2"
                                       required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="minStudents" className="block font-medium">Min étudiant par
                                    groupe</label>
                                <input id="minStudents" name="minStudents" type="number" value={project.minStudents}
                                       onChange={handleChange} className="w-full border p-2"/>
                            </div>

                            <div>
                                <label htmlFor="maxStudents" className="block font-medium">Max étudiant par
                                    groupe</label>
                                <input id="maxStudents" name="maxStudents" type="number" value={project.maxStudents}
                                       onChange={handleChange} className="w-full border p-2"/>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="status" className="block font-medium">Retard</label>
                                <select id="status" name="status" value={project.allowLate?.toString()}
                                        onChange={handleChange}
                                        className="w-full border p-2">
                                    <option value="true">Oui</option>
                                    <option value="false">Non</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="mode" className="block font-medium">Type de groupe</label>
                                <select id="mode" name="mode" value={project.mode} onChange={handleChange}
                                        className="w-full border p-2">
                                    <option value="manual">Manuel</option>
                                    <option value="random">Aléatoire</option>
                                    <option value="free">Libre</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="status" className="block font-medium">Statut</label>
                                <select id="status" name="status" value={project.status} onChange={handleChange}
                                        className="w-full border p-2">
                                    <option value="draft">Brouillon</option>
                                    <option value="visible">Visible</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="promotionId" className="block font-medium">Promotion</label>
                                <select
                                    id="promotionId"
                                    name="promotionId"
                                    value={project.promotionId ?? ''}
                                    onChange={handleChange}
                                    className="w-full border p-2"
                                >
                                    <option value="" disabled>-- Choisir une promotion --</option>
                                    {promotions.map((promo) => (
                                        <option key={promo.id} value={promo.id}>
                                            {promo.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="status" className="block font-medium">Sale de soutenance *</label>
                                <input id="lieuSoutenance" name="lieuSoutenance" type="test" value={project.lieuSoutenance}
                                       onChange={handleChange} className="w-full border p-2" required/>
                            </div>

                            <div>
                                <label htmlFor="promotionId" className="block font-medium">Duré par groupe *</label>
                                <input id="soutenanceDuration" name="soutenanceDuration" type="number" value={project.soutenanceDuration}
                                       onChange={handleChange} className="w-full border p-2" required/>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="file" className="block font-medium">Document PDF</label>
                            <input
                                id="file"
                                name="file"
                                type="file"
                                accept="application/pdf"
                                onChange={handleChangeFile}
                                className="block w-full border p-2 rounded"/>
                        </div>

                        <button type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Créer
                        </button>
                    </form>
                </div>
            </main>
            );
        </DashboardLayout>
    )
}