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
  Target,
  Zap,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { UserProfile } from "@/components/auth/user-profile"

const navItems = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Dashboard Avançado", href: "/dashboard-avancado", icon: Activity },
  { name: "Dashboard Executivo", href: "/dashboard-executivo", icon: Target },
  { name: "Gestão Acadêmica", href: "/gestao-academica", icon: GraduationCap },
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

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname()

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-4 border-b bg-gradient-to-r from-brand-red-500 to-brand-orange-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
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
                  <SheetTitle className="text-lg font-bold text-white">Colégio Plus</SheetTitle>
                  <p className="text-xs opacity-90">Sistema de Gestão</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="text-xs text-white/80 text-left">Remanejamento de Aulas</div>
          </SheetHeader>

          {/* Navigation */}
          <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href} onClick={onClose}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-sm transition-colors duration-200",
                      isActive &&
                        "bg-brand-red-50 dark:bg-brand-red-900/20 text-brand-red-700 dark:text-brand-red-400 border-r-2 border-brand-red-500",
                      !isActive && "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
                    )}
                  >
                    <Icon
                      className={cn(
                        "mr-2 h-4 w-4",
                        isActive
                          ? "text-brand-red-600 dark:text-brand-red-400"
                          : "text-muted-foreground dark:text-gray-400",
                      )}
                    />
                    <span className={cn(isActive ? "font-medium" : "font-normal")}>{item.name}</span>
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t bg-muted/30 dark:bg-gray-800/30 dark:border-gray-700">
            <UserProfile />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
