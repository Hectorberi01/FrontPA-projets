'use client'

import { createContext, useContext, useState, useEffect,ReactNode } from 'react';
import {useRouter} from "next/navigation";

type Role = {
    id: number;
    name: 'STUDENT' | 'ENSEIGNANT' | 'ADMIN';
};

type User = {
    id: number;
    username: string;
    nom: string;
    prenom: string;
    email: string;
    phoneNumber: string;
    isActive: boolean;
    role: Role;
};

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (user: User, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        try{
            if (storedUser && storedToken && storedUser !== "undefined") {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
            }else {
                router.push('/');
            }
        }catch (e) {
            console.log(e);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    }, []);

    const login = (userData:any, authToken:string) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', authToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth doit être utilisé dans un <AuthProvider>')
    }
    return context;
}