'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/authContext';
import { toast } from '@/components/ui/use-toast';
import {DashboardLayout} from "@/components/layout/dashboard-layout";
import {apiClient} from "@/lib/services/apiClient";
import Swal from "sweetalert2";

const USER_URL = "http://localhost:3000/api/users"

export default function ChangePasswordPage() {
    const { user, token } = useAuth(); // Pour récupérer le token d'auth
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<any>(null);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast({
                title: 'Erreur',
                description: 'Les mots de passe ne correspondent pas.',
                variant: 'destructive',
            });
            return;
        }

        setFormData({password: newPassword,})
        try {
            setLoading(true);

            if(!user) return;
            const response = await apiClient.put(`${USER_URL}/${user.id}`,formData);

            if(response.status !== 200) {

                Swal.fire({
                    title: "error",
                    icon: "error",
                    draggable: true
                });
            }else {
                Swal.fire({
                    title: "Mot de pas mise à jours. ✅",
                    icon: "success",
                    draggable: true
                });
            }

            toast({
                title: 'Succès',
                description: 'Mot de passe mis à jour avec succès.',
            });

            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            console.error(error);
            toast({
                title: 'Erreur',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
        <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md border mt-6">
            <h1 className="text-2xl font-bold mb-4">Changer mon mot de passe</h1>
            <form onSubmit={handleChangePassword} className="space-y-4">
                {/*<div>*/}
                {/*    <label className="block text-sm font-medium mb-1">Ancien mot de passe</label>*/}
                {/*    <Input*/}
                {/*        type="password"*/}
                {/*        value={oldPassword}*/}
                {/*        onChange={(e) => setOldPassword(e.target.value)}*/}
                {/*        required*/}
                {/*    />*/}
                {/*</div>*/}
                <div>
                    <label className="block text-sm font-medium mb-1">Nouveau mot de passe</label>
                    <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Confirmer le nouveau mot de passe</label>
                    <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Changement...' : 'Changer le mot de passe'}
                </Button>
            </form>
        </div>
        </DashboardLayout>
    )
}
