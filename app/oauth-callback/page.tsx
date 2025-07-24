"use client"

import {useEffect, useRef} from "react";
import {useRouter} from "next/navigation";
import {useAuth} from "@/hooks/authContext";


export default function AuthRedirectPage() {
    const router = useRouter();
    const { login } = useAuth();
    const hasRun = useRef(false);
    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;
        try {
            console.log("Tous les cookies:", document.cookie);

            const userCookie = document.cookie
            .split('; ')
            .find((row) => row.startsWith('user='))
            ?.split('=')[1];

        // Récupération du cookie "token"
        const tokenCookie = document.cookie
            .split('; ')
            .find((row) => row.startsWith('token='))
            ?.split('=')[1];

        if (!userCookie || !tokenCookie) {
            console.log("error");
            router.push('/');
            return;
        }

        const decodedUser = decodeURIComponent(userCookie);
        const user = JSON.parse(decodedUser) ;

        const token = decodeURIComponent(tokenCookie);

        console.log("user", user);
        console.log("token", token);

        login(user, token);

        setTimeout(() => {
        switch (user?.role?.name) {
            case "ADMIN":
            case "TEACHER":
                router.push("/dashboard");
                break;
            case "STUDENT":
                router.push("/student/projets");
                break;
            default:
                console.error('Erreur OAuth Callback:');
                router.push("/");
                break;
        }}, 500);
        } catch (e) {
            console.error('Erreur OAuth Callback:', e);
            router.push('/');
        }

    }, [router, login]);

    return <p>Connexion en cours...</p>;
}