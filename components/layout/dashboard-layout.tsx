"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  BookOpen,
  Calendar,
  ChevronDown,
  ClipboardList,
  FileText,
  Home,
  LogOut,
  Menu,
  Settings,
  Users,
  Award,
} from "lucide-react"

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  isActive: boolean
  onClick?: () => void
}

function NavItem({ href, icon, label, isActive, onClick }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
        isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole?: "enseignant" | "etudiant"
}

export function DashboardLayout({ children, userRole = "enseignant" }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  const closeMobileNav = () => setIsMobileNavOpen(false)

  const navItems = [
    { href: "/dashboard", icon: <Home size={20} />, label: "Tableau de bord" },
    ...(userRole === "enseignant" ? [{ href: "/promotions", icon: <Users size={20} />, label: "Promotions" }] : []),
    { href: "/projets", icon: <BookOpen size={20} />, label: "Projets" },
    // { href: "/groupes", icon: <Users size={20} />, label: "Groupes" },
    // { href: "/livrables", icon: <ClipboardList size={20} />, label: "Livrables" },
    // { href: "/rapports", icon: <FileText size={20} />, label: "Rapports" },
    ...(userRole === "enseignant"
      ? [
          { href: "/soutenances", icon: <Calendar size={20} />, label: "Soutenances" },
          { href: "/notations", icon: <Award size={20} />, label: "Notations" },
          { href: "/utilisateur", icon: <Users size={20} />, label: "utilisateur" },
        ]
      : []),
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold">Menu</h2>
                </div>
                <nav className="p-4 space-y-1">
                  {navItems.map((item) => (
                    <NavItem
                      key={item.href}
                      href={item.href}
                      icon={item.icon}
                      label={item.label}
                      isActive={pathname === item.href}
                      onClick={closeMobileNav}
                    />
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="font-bold text-xl hidden sm:inline">ESGI</span>
              <span className="font-bold text-xl sm:hidden">ESGI</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
                    <AvatarFallback>{userRole === "enseignant" ? "EN" : "ET"}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">
                    {userRole === "enseignant" ? "Prof. Dupont" : "Étudiant Martin"}
                  </span>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer flex items-center gap-2">
                    <Avatar className="h-4 w-4">
                      <AvatarImage src="/placeholder.svg?height=16&width=16" alt="Avatar" />
                      <AvatarFallback>{userRole === "enseignant" ? "EN" : "ET"}</AvatarFallback>
                    </Avatar>
                    <span>Profil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer flex items-center gap-2">
                    <Settings size={16} />
                    <span>Paramètres</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer flex items-center gap-2 text-red-600">
                  <LogOut size={16} />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Sidebar (desktop only) */}
        <aside className="hidden md:block w-64 border-r border-gray-200 bg-white">
          <nav className="p-4 space-y-1 sticky top-16">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={pathname === item.href}
              />
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-gray-50">{children}</main>
      </div>
    </div>
  )
}
