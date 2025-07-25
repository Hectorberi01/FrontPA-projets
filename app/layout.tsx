import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import {AuthProvider} from "@/hooks/authContext";

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Gestionnaire de Projets Étudiants",
  description: "Plateforme de gestion de projets pour enseignants et étudiants",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (

    <html lang="fr" suppressHydrationWarning className="h-full">
      <body className={inter.className + " h-full bg-white dark:bg-gray-900"}>
      <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
      </body>
    </html>
  )
}
