"use client"

import React, {useEffect} from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FaGoogle, FaMicrosoft } from "react-icons/fa"
import {login} from "@/lib/services/auth";

declare global {
  interface Window {
    google: any;
  }
}
export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userRole, setUserRole] = useState<"enseignant" | "etudiant">("enseignant")


  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const data = {
      email,
      password,
    }
    try {
      const response = await login(data)
      if (response){
        const userStr = localStorage.getItem("user");
        console.log("userStr", userStr)
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user.user.role.name === "Teacher") {
            router.push("/dashboard");
          } else if (user.user.role.name === "student") {
            router.push("/student/projets");
          }
        }
      }
    }catch (error) {
      console.error(error)
    }
    // Simulation d'authentification
    /*setTimeout(() => {
      setIsLoading(false)
      // Redirection vers le dashboard ou l'interface étudiant selon le rôle
      if (userRole === "enseignant") {
        router.push("/dashboard")
      } else {
        router.push("/student/projets")
      }
    }, 1500)*/
  }

  const handleOAuthLogin = (provider: string) => {
    setIsLoading(true)
    if (provider === "google") {
      router.push('http://localhost:3001/api/auth/google');
    }

  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
        <CardDescription>Connectez-vous à votre compte pour accéder à la plateforme</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex border rounded-md overflow-hidden">
            <button
              type="button"
              className={`flex-1 py-2 text-center ${
                userRole === "enseignant" ? "bg-primary text-white" : "bg-gray-100"
              }`}
              onClick={() => setUserRole("enseignant")}
            >
              Enseignant
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-center ${userRole === "etudiant" ? "bg-primary text-white" : "bg-gray-100"}`}
              onClick={() => setUserRole("etudiant")}
            >
              Étudiant
            </button>
          </div>
        </div>

        <Tabs defaultValue="credentials" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="credentials">Identifiants</TabsTrigger>
            <TabsTrigger value="oauth">OAuth</TabsTrigger>
          </TabsList>

          <TabsContent value="credentials">
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Button variant="link" className="p-0 h-auto text-sm" type="button">
                    Mot de passe oublié?
                  </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="oauth" className="space-y-4 mt-4">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={() => handleOAuthLogin("google")}
              disabled={isLoading}
            >
              <FaGoogle />
              <span>Continuer avec Google</span>
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={() => handleOAuthLogin("microsoft")}
              disabled={isLoading}
            >
              <FaMicrosoft />
              <span>Continuer avec Microsoft</span>
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <p className="text-sm text-gray-500">
          {userRole === "enseignant"
            ? "Seuls les enseignants peuvent créer un compte."
            : "Les comptes étudiants sont créés par les enseignants."}
        </p>
      </CardFooter>
    </Card>
  )
}
