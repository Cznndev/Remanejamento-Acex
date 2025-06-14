"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { UserProfile } from "@/components/auth/user-profile"
import { Toaster } from "@/components/ui/toaster"
import { AuthService } from "@/lib/auth/auth-service"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const authService = AuthService.getInstance()

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated()
      setIsAuthenticated(authenticated)
      setIsLoading(false)

      // Redireciona para login se não autenticado (exceto na página de login)
      if (!authenticated && pathname !== "/login") {
        window.location.href = "/login"
      }
    }

    checkAuth()
  }, [pathname, authService])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-red-600"></div>
      </div>
    )
  }

  // Se não autenticado e está na página de login, mostra apenas o children (página de login)
  if (!isAuthenticated && pathname === "/login") {
    return (
      <>
        {children}
        <Toaster />
      </>
    )
  }

  // Assegura que um usuário não autenticado não veja o layout principal rapidamente antes do redirect
  if (!isAuthenticated) {
    return null
  }

  // Layout para usuário autenticado
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-900">Sistema de Gestão Escolar</h1>
            <UserProfile />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
      <Toaster />
    </div>
  )
}
