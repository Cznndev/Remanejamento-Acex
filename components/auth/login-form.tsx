"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react"
import { AuthService } from "@/lib/auth/auth-service"
import { useToast } from "@/hooks/use-toast"

interface LoginFormProps {
  onLoginSuccess: () => void
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const authService = AuthService.getInstance()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await authService.login({ email, password, rememberMe })

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao sistema de gestão escolar.",
      })

      onLoginSuccess()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro ao fazer login")
    } finally {
      setIsLoading(false)
    }
  }

  const demoCredentials = [
    { role: "Administrador", email: "admin@escola.edu", password: "admin123" },
    { role: "Coordenador", email: "coordenador@escola.edu", password: "coord123" },
    { role: "Professor", email: "maria.silva@escola.edu", password: "prof123" },
    { role: "Diretor", email: "diretor@escola.edu", password: "dir123" },
    { role: "Secretaria", email: "secretaria@escola.edu", password: "sec123" },
  ]

  const fillDemoCredentials = (email: string, password: string) => {
    setEmail(email)
    setPassword(password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Sistema de Gestão Escolar</CardTitle>
            <CardDescription>Faça login para acessar o sistema de remanejamento de aulas</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@escola.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm">
                  Lembrar de mim por 30 dias
                </Label>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Entrar
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <div className="w-full">
              <p className="text-sm text-muted-foreground mb-3 text-center">Credenciais de demonstração:</p>
              <div className="grid gap-2">
                {demoCredentials.map((cred, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="justify-start text-xs"
                    onClick={() => fillDemoCredentials(cred.email, cred.password)}
                  >
                    <span className="font-medium mr-2">{cred.role}:</span>
                    <span className="text-muted-foreground">{cred.email}</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
