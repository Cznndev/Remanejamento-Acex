"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  TrendingUp,
  PieChart,
  GraduationCap,
  Users,
  BookOpen,
  Clock,
  Building,
  Calendar,
  RefreshCw,
  Settings,
  BarChart3,
  Puzzle,
  CheckSquare,
} from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { UserProfile } from "@/components/auth/user-profile"
import Image from "next/image"

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Dashboard Avançado",
    href: "/dashboard-avancado",
    icon: TrendingUp,
  },
  {
    title: "Dashboard Executivo",
    href: "/dashboard-executivo",
    icon: PieChart,
  },
  {
    title: "Gestão Acadêmica",
    href: "/gestao-academica",
    icon: GraduationCap,
  },
  {
    title: "Professores",
    href: "/professores",
    icon: Users,
  },
  {
    title: "Turmas",
    href: "/turmas",
    icon: Users,
  },
  {
    title: "Disciplinas",
    href: "/disciplinas",
    icon: BookOpen,
  },
  {
    title: "Horários",
    href: "/horarios",
    icon: Clock,
  },
  {
    title: "Salas",
    href: "/salas",
    icon: Building,
  },
  {
    title: "Cronograma",
    href: "/cronograma",
    icon: Calendar,
  },
  {
    title: "Remanejamento",
    href: "/remanejamento",
    icon: RefreshCw,
  },
  {
    title: "Aprovações",
    href: "/aprovacoes",
    icon: CheckSquare,
  },
  {
    title: "Integrações",
    href: "/integracoes",
    icon: Puzzle,
  },
  {
    title: "Relatórios",
    href: "/relatorios",
    icon: BarChart3,
  },
  {
    title: "Configurações",
    href: "/configuracoes",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden lg:flex h-screen w-64 flex-col fixed left-0 top-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="flex items-center gap-3 p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="relative w-10 h-10">
          <Image src="/images/colegio-plus-logo.png" alt="Colégio Plus" width={40} height={40} className="rounded-lg" />
        </div>
        <div>
          <h1 className="font-bold text-lg bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
            Colégio Plus
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-400">Sistema de Gestão</p>
          <p className="text-xs text-gray-500 dark:text-gray-500">Remanejamento de Aulas</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <ThemeToggle />
        </div>
        <UserProfile />
      </div>
    </div>
  )
}
