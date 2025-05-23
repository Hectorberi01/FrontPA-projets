'use client'
import { Button } from "@/components/ui/button"
import { LoginForm } from "@/components/auth/login-form"
import Script from "next/script"

import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Script
          src="https://accounts.google.com/gsi/client"
          async
          defer
          strategy="afterInteractive"
      />

      <main className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <img src={"https://www.sully-group.ca/documents/d/sully/actualites-partenariat-esgi-780x420px"}/>
          </div>

          <div className="w-full max-w-md " style={{ maxWidth: "400px",position: "relative" }}>
            <LoginForm />
          </div>
        </div>
      </main>
    </div>
  )
}
