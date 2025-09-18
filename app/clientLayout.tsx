"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { MobileHeader } from "@/components/mobile/mobile-header"
import { MobileSidebar } from "@/components/mobile/mobile-sidebar"
import { useMediaQuery } from "@/hooks/use-media-query"
import { ThemeProvider } from "@/lib/theme/theme-context"
import { AuthService } from "@/lib/auth/auth-service"
import { ThemeAwareLoading } from "@/components/ui/theme-aware-loading"

const pageNames: Record<string, string> = {
  "/": "Dashboard",
  "/dashboard-avancado": "Dashboard Avançado",
  "/dashboard-executivo": "Dashboard Executivo",
  "/gestao-academica": "Gestão Acadêmica",
  "/professores": "Professores",
  "/turmas": "Turmas",
  "/disciplinas": "Disciplinas",
  "/horarios": "Horários",
  "/salas": "Salas",
  "/cronograma": "Cronograma",
  "/remanejamento": "Remanejamento",
  "/aprovacoes": "Aprovações",
  "/integracoes": "Integrações",
  "/relatorios": "Relatórios",
  "/configuracoes": "Configurações",
  "/perfil": "Perfil",
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const isMobile = useMediaQuery("(max-width: 1024px)")
  const authService = AuthService.getInstance()

  useEffect(() => {
    const checkAuth = () => {
      const user = authService.getCurrentUser()
      setIsAuthenticated(!!user)
    }

    checkAuth()
  }, [])

  if (isAuthenticated === null) {
    return <ThemeAwareLoading />
  }

  if (!isAuthenticated) {
    return <>{children}</>
  }

  const currentPageName = pageNames[pathname] || "Página"

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Mobile Header */}
        {isMobile && <MobileHeader currentPage={currentPageName} onMenuClick={() => setSidebarOpen(true)} />}

        {/* Mobile Sidebar */}
        {isMobile && <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />}

        {/* Main Content */}
        <main className={`${isMobile ? "pt-16" : "lg:ml-64"} min-h-screen`}>{children}</main>
      </div>
    </ThemeProvider>
  )
}
