"use client"

import type React from "react"

import { Inter } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"
import { UserProfile } from "@/components/auth/user-profile"
import { Toaster } from "@/components/ui/toaster"
import { AuthService } from "@/lib/auth/auth-service"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { ThemeProvider } from "@/lib/theme/theme-context"

const inter = Inter({ subsets: ["latin"] })

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
  }, [pathname])

  if (isLoading) {
    return (
      <html lang="pt-BR">
        <body className={inter.className}>
          <ThemeProvider>
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-600"></div>
            </div>
          </ThemeProvider>
        </body>
      </html>
    )
  }

  // Se não autenticado e não está na página de login, mostra apenas o children (página de login)
  if (!isAuthenticated && pathname === "/login") {
    return (
      <html lang="pt-BR">
        <body className={inter.className}>
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    )
  }

  // Layout autenticado
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ThemeProvider>
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
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
