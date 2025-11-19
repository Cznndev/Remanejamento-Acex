"use client"

import type React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  HardDrive,
  ComputerIcon as Software,
  Network,
  Database,
  FileText,
  BarChart3,
  Activity,
  Users,
  Settings,
  Bell,
  Bot,
  Menu,
  Shield,
  TrendingUp,
  Sparkles,
} from "lucide-react"

interface DashboardShellProps {
  children: React.ReactNode
  onTabChange: (tab: string) => void
  activeTab: string
}

export function DashboardShell({ children, onTabChange, activeTab }: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Obter informações do usuário para controle de acesso
  const userData = typeof window !== "undefined" ? localStorage.getItem("et-wicca-user") : null
  const user = userData ? JSON.parse(userData) : null

  const navigation = [
    {
      name: "Visão Geral",
      value: "visao-geral",
      icon: LayoutDashboard,
      access: ["admin", "ti", "gestor"],
      badge: null,
      color: "text-blue-400",
    },
    {
      name: "Hardware",
      value: "hardware",
      icon: HardDrive,
      access: ["admin", "ti"],
      badge: "12",
      color: "text-green-400",
    },
    {
      name: "Software",
      value: "software",
      icon: Software,
      access: ["admin", "ti"],
      badge: "8",
      color: "text-purple-400",
    },
    {
      name: "Rede",
      value: "rede",
      icon: Network,
      access: ["admin", "ti"],
      badge: "5",
      color: "text-orange-400",
    },
    {
      name: "Banco de Dados",
      value: "banco-dados",
      icon: Database,
      access: ["admin", "ti"],
      badge: "3",
      color: "text-cyan-400",
    },
    {
      name: "Relatórios",
      value: "relatorios",
      icon: FileText,
      access: ["admin", "ti", "gestor"],
      badge: null,
      color: "text-indigo-400",
    },
    {
      name: "Relatórios Avançados",
      value: "relatorios-avancados",
      icon: BarChart3,
      access: ["admin", "ti", "gestor"],
      badge: "NEW",
      color: "text-pink-400",
    },
    {
      name: "Monitoramento",
      value: "monitoramento",
      icon: Activity,
      access: ["admin", "ti"],
      badge: "LIVE",
      color: "text-red-400",
    },
    {
      name: "Alertas",
      value: "alertas",
      icon: Bell,
      access: ["admin", "ti"],
      badge: "2",
      color: "text-yellow-400",
    },
    {
      name: "Automação & IA",
      value: "automacao-ia",
      icon: Bot,
      access: ["admin", "ti"],
      badge: "AI",
      color: "text-emerald-400",
    },
    {
      name: "Analytics",
      value: "analytics",
      icon: TrendingUp,
      access: ["admin", "ti", "gestor"],
      badge: "PRO",
      color: "text-violet-400",
    },
    {
      name: "Usuários",
      value: "usuarios",
      icon: Users,
      access: ["admin"],
      badge: "24",
      color: "text-blue-400",
    },
    {
      name: "Logs de Auditoria",
      value: "auditoria",
      icon: Shield,
      access: ["admin"],
      badge: null,
      color: "text-slate-400",
    },
    {
      name: "Configurações",
      value: "configuracoes",
      icon: Settings,
      access: ["admin"],
      badge: null,
      color: "text-gray-400",
    },
  ]

  // Filtrar navegação baseada no acesso do usuário
  const filteredNavigation = navigation.filter((item) => user && item.access.includes(user.role))

  const SidebarContent = () => (
    <div className="flex h-full flex-col et-wicca-sidebar">
      {/* Header */}
      <div className="flex h-16 items-center justify-center border-b border-sidebar-border px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-sidebar-foreground">ET & WICCA</h2>
            <p className="text-xs text-sidebar-foreground/60">Sistema de Gestão</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className="border-b border-sidebar-border px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
              {user.name?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">{user.role}</p>
            </div>
            <Badge variant="secondary" className="text-xs">
              {user.role === "admin" ? "Admin" : user.role === "ti" ? "TI" : "Gestor"}
            </Badge>
          </div>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {filteredNavigation.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.value
            return (
              <Button
                key={item.value}
                variant="ghost"
                className={cn(
                  "w-full justify-start h-11 et-wicca-nav-item",
                  isActive ? "et-wicca-nav-item-active" : "et-wicca-nav-item-inactive",
                )}
                onClick={() => {
                  onTabChange(item.value)
                  setIsSidebarOpen(false)
                }}
              >
                <Icon className={cn("mr-3 h-4 w-4", isActive ? "text-primary-foreground" : item.color)} />
                <span className="flex-1 text-left">{item.name}</span>
                {item.badge && (
                  <Badge
                    variant={isActive ? "secondary" : "outline"}
                    className={cn(
                      "ml-auto text-xs",
                      isActive ? "bg-primary-foreground/20 text-primary-foreground" : "",
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Button>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <div className="text-center">
          <p className="text-xs text-sidebar-foreground/40">v2.0.0</p>
          <p className="text-xs text-sidebar-foreground/40">© 2024 ET & WICCA</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Desktop Sidebar */}
      <div className="hidden w-72 lg:block">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden fixed top-4 left-4 z-40 glass-effect hover-glow">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 animate-fade-in">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
