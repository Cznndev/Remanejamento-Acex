"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AuthService } from "@/lib/auth/auth-service"
import type { User } from "@/lib/auth/types"
import { LoginForm } from "./login-form"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermission?: string
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, requiredPermission, fallback }: ProtectedRouteProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const authService = AuthService.getInstance()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }

  const handleLoginSuccess = () => {
    checkAuth()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-2" />
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />
  }

  if (requiredPermission && !authService.hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Acesso Negado</h2>
          <p className="text-muted-foreground">Você não tem permissão para acessar esta página.</p>
          {fallback}
        </div>
      </div>
    )
  }

  return <>{children}</>
}
