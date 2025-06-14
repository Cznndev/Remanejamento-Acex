"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Users,
  GraduationCap,
  BookOpen,
  Clock,
  Home,
  Calendar,
  RefreshCw,
  FileText,
  Settings,
  Activity,
  Zap,
  Brain,
  Target,
  Cpu,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { UserProfile } from "@/components/auth/user-profile"

const navItems = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Dashboard Avançado", href: "/dashboard-avancado", icon: Activity },
  { name: "Dashboard Executivo", href: "/dashboard-executivo", icon: Target },
  { name: "Machine Learning", href: "/machine-learning", icon: Brain },
  { name: "Tecnologias Avançadas", href: "/tecnologias-avancadas", icon: Cpu },
  { name: "Gestão Acadêmica", href: "/gestao-academica", icon: GraduationCap }, // Nova linha
  { name: "Professores", href: "/professores", icon: Users },
  { name: "Turmas", href: "/turmas", icon: GraduationCap },
  { name: "Disciplinas", href: "/disciplinas", icon: BookOpen },
  { name: "Horários", href: "/horarios", icon: Clock },
  { name: "Salas", href: "/salas", icon: Home },
  { name: "Cronograma", href: "/cronograma", icon: Calendar },
  { name: "Remanejamento", href: "/remanejamento", icon: RefreshCw },
  { name: "Integrações", href: "/integracoes", icon: Zap },
  { name: "Relatórios", href: "/relatorios", icon: FileText },
  { name: "Configurações", href: "/configuracoes", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 border-r bg-background h-full flex flex-col">
      <div className="p-4 border-b bg-gradient-to-r from-brand-red-500 to-brand-orange-500">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image
              src="/images/colegio-plus-logo.png"
              alt="Colégio Plus"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div className="text-white">
            <h1 className="text-lg font-bold">Colégio Plus</h1>
            <p className="text-xs opacity-90">Sistema de Gestão</p>
          </div>
        </div>
        <div className="text-xs text-white/80">Remanejamento de Aulas</div>
      </div>
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-sm",
                  isActive && "bg-brand-red-50 text-brand-red-700 border-r-2 border-brand-red-500",
                )}
              >
                <Icon className={cn("mr-2 h-4 w-4", isActive ? "text-brand-red-600" : "text-muted-foreground")} />
                <span className={cn(isActive ? "font-medium" : "font-normal")}>{item.name}</span>
              </Button>
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t bg-muted/30">
        <UserProfile />
      </div>
    </div>
  )
}
