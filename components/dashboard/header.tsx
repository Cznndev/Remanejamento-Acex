"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Building2, LogOut, Settings, User, Moon, Sun, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { useTheme } from "next-themes"

interface DashboardHeaderProps {
  heading: string
  subheading?: string
  children?: React.ReactNode
}

export function DashboardHeader({ heading, subheading, children }: DashboardHeaderProps) {
  const [user, setUser] = useState(null)
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const userData = localStorage.getItem("et-wicca-user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    // Remove todos os dados de autenticação
    localStorage.removeItem("et-wicca-auth")
    localStorage.removeItem("et-wicca-user")

    // Remove quaisquer outros dados relacionados à sessão
    localStorage.removeItem("et-wicca-notifications")
    localStorage.removeItem("et-wicca-settings")

    // Limpa o sessionStorage também
    sessionStorage.clear()

    // Redireciona para a página de login
    router.push("/")
  }

  return (
    <div className="et-wicca-card mb-6 p-4 hover-lift">
      <div className="flex items-center justify-between">
        {/* Logo e Título */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl et-wicca-gradient shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-2xl md:text-3xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  ET & WICCA
                </h1>
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              </div>
              <p className="text-sm text-muted-foreground">Sistema de Gestão de TI</p>
            </div>
          </div>
        </div>

        {/* Ações do Header */}
        <div className="flex items-center gap-3">
          {children}

          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hover-glow"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Notificações */}
          <NotificationCenter />

          {/* Menu do Usuário */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover-glow">
                  <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                    <AvatarFallback className="et-wicca-gradient text-white font-semibold">
                      {user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <Badge variant="secondary" className="text-xs">
                        {user.role === "admin" ? "Admin" : user.role === "ti" ? "TI" : "Gestor"}
                      </Badge>
                    </div>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover-lift">
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover-lift">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover-lift">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Breadcrumb/Título da Página */}
      {(heading || subheading) && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{heading}</h2>
              {subheading && <p className="text-muted-foreground mt-1">{subheading}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
