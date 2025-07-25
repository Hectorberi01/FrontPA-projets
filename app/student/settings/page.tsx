'use client';

import { useAuth } from '@/hooks/authContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import { StudentLayout } from '@/components/layout/student-layout';

export default function SettingsPage() {
    const { user, logout } = useAuth();
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);

    return (
        <StudentLayout>
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200 mt-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
                Paramètres
            </h1>

            {/* Section Profil */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Profil</h2>
                <p className="text-gray-600 mb-4">
                    Modifiez vos informations personnelles et votre photo de profil.
                </p>
                <Button asChild variant="outline">
                    <Link href="/student/profile">Modifier le profil</Link>
                </Button>
            </section>

            {/* Préférences */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Préférences</h2>
                <div className="flex items-center justify-between border p-4 rounded-md mb-3">
                    <span className="text-gray-700">Mode d'affichage</span>
                    {/*<Switch checked={darkMode} onCheckedChange={setDarkMode} />*/}
                    <ThemeSwitcher />
                </div>
              
            </section>

            {/* Sécurité */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Sécurité</h2>
                <Button variant="outline" asChild>
                    <Link href="/student/change-password">Changer le mot de passe</Link>
                </Button>
            </section>

            {/* Déconnexion */}
            <section>
                <h2 className="text-xl font-semibold mb-2">Session</h2>
                <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={logout}>
                    Se déconnecter
                </Button>
            </section>
        </div>
        </StudentLayout>
    );
}
