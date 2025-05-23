"use client"

import {useEffect} from "react";
import {useRouter} from "next/navigation";


export default function AuthRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        const userStr = document.cookie
            .split('; ')
            .find((row) => row.startsWith('user='))
            ?.split('=')[1];

        const user = userStr ? JSON.parse(decodeURIComponent(userStr)) : null;

        if (user?.role.name === 'ADMIN' || user.role.name === 'Teacher') {
            router.push('/dashboard');
        } else {
            router.push('/student/projets');
        }
    }, [router]);

    return <p>Connexion en cours...</p>;
}