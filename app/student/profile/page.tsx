'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {apiClient} from "@/lib/services/apiClient";
import {toast} from "sonner";
import { StudentLayout } from '@/components/layout/student-layout';

type User = {
    id: number;
    username: string;
    nom: string;
    prenom: string;
    email: string;
    phoneNumber: string;
    address?: string | null;
    imageUrl?: string | null;
    role: { id: number; name: string };
};

const USER_URL = "http://localhost:3000/api/users"

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setFormData({
                nom: parsedUser.nom,
                prenom: parsedUser.prenom,
                email: parsedUser.email,
                phoneNumber: parsedUser.phoneNumber,
                username: parsedUser.username,
                address: parsedUser.address || '',
            });
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!user) return;
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!formData) return;
        if(!user) return;
        const response = await apiClient.put(`${USER_URL}/${user.id}`, formData);
        if(response.status !== 200) {
            toast.error("la mise à jour à échoué");
        }else {
            window.location.reload();
        }
    };

    if (!user) return <p>Chargement des informations...</p>;

    return (
        <StudentLayout>
            <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200 mt-6">
                <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">Mon Profil</h1>

                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Nom</label>
                        <Input
                            className="border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
                            name="nom"
                            value={formData.nom}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Prénom</label>
                        <Input
                            className="border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
                            name="prenom"
                            value={formData.prenom}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                        <Input
                            className="border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Téléphone</label>
                        <Input
                            className="border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Nom d'utilisateur</label>
                        <Input
                            className="border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Adresse</label>
                        <Input
                            className="border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <Button
                    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition-all"
                    onClick={handleSave}
                >
                    Sauvegarder
                </Button>
            </div>
        </StudentLayout>
    );
}
