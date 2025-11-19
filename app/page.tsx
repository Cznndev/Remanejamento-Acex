"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Building2, Shield, Moon, Sun, Sparkles, CheckCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { TransitionOverlay } from "@/components/transition-overlay"
import { ValidationMessage } from "@/components/form-validation"
import { PasswordRecoveryModal } from "@/components/password-recovery-modal"
import { TwoFactorAuth } from "@/components/auth/two-factor-auth"
import { cn } from "@/lib/utils"
import "./animations.css"
import "./transition.css"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionMessage, setTransitionMessage] = useState("")
  const [showRecoveryModal, setShowRecoveryModal] = useState(false)
  const [show2FAModal, setShow2FAModal] = useState(false)
  const [loginData, setLoginData] = useState<{ role: string; name: string } | null>(null)

  // Estados de validação
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [emailValid, setEmailValid] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordFocused, setPasswordFocused] = useState(false)

  const router = useRouter()

  // Inicializar tema e limpar sessão
  useEffect(() => {
    // Verificar preferência de tema salva
    const savedTheme = localStorage.getItem("et-wicca-theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    } else {
      setIsDarkMode(false)
      document.documentElement.classList.remove("dark")
    }

    // Remove todos os dados de autenticação
    localStorage.removeItem("et-wicca-auth")
    localStorage.removeItem("et-wicca-user")
    localStorage.removeItem("et-wicca-notifications")
    localStorage.removeItem("et-wicca-settings")

    // Limpa o sessionStorage também
    sessionStorage.clear()

    // Marcar componente como montado para iniciar animações
    setMounted(true)
  }, [])

  // Validar email
  useEffect(() => {
    if (!email) {
      setEmailValid(false)
      setEmailError("")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isValid = emailRegex.test(email)

    if (isValid) {
      setEmailValid(true)
      setEmailError("")
    } else {
      setEmailValid(false)
      setEmailError("Email inválido")
    }
  }, [email])

  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)

    if (newTheme) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("et-wicca-theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("et-wicca-theme", "light")
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    // Marcar campos como tocados para mostrar validação
    setEmailTouched(true)
    setPasswordTouched(true)

    // Verificar se email é válido
    if (!emailValid) {
      return
    }

    // Verificar se senha foi preenchida
    if (!password) {
      return
    }

    setIsLoading(true)

    // Simular autenticação (em produção, isso seria uma chamada para API)
    setTimeout(() => {
      if (email && password) {
        // Definir role baseado no email/senha
        let role = "gestor"
        let name = "Usuário ET & WICCA"

        if (email === "admin@etwicca.com" && password === "admin123") {
          role = "admin"
          name = "Administrador ET & WICCA"
        } else if (email === "ti@etwicca.com" && password === "ti123") {
          role = "ti"
          name = "Técnico TI ET & WICCA"
        } else if (email === "gestor@etwicca.com" && password === "gestor123") {
          role = "gestor"
          name = "Gestor ET & WICCA"
        }

        // Verificar se o usuário tem 2FA ativado
        const has2FA = localStorage.getItem(`2fa_enabled_${email}`) === "true"

        if (has2FA) {
          // Armazenar dados de login para usar após verificação 2FA
          setLoginData({ role, name })
          setIsLoading(false)
          setShow2FAModal(true)
        } else {
          // Continuar com o login normal
          completeLogin(role, name)
        }
      } else {
        setIsLoading(false)
      }
    }, 1000)
  }

  // Função para completar o login após verificação 2FA
  const completeLogin = (role: string, name: string) => {
    // Iniciar transição
    setIsTransitioning(true)

    // Sequência de mensagens de transição
    const messages = [
      "Autenticando...",
      "Preparando seu ambiente...",
      "Carregando configurações...",
      `Bem-vindo, ${name}!`,
    ]

    let messageIndex = 0
    setTransitionMessage(messages[messageIndex])

    const messageInterval = setInterval(() => {
      messageIndex++
      if (messageIndex < messages.length) {
        setTransitionMessage(messages[messageIndex])
      } else {
        clearInterval(messageInterval)
      }
    }, 700)

    // Salvar token de autenticação no localStorage
    localStorage.setItem("et-wicca-auth", "authenticated")
    localStorage.setItem(
      "et-wicca-user",
      JSON.stringify({
        name: name,
        email: email,
        role: role,
      }),
    )

    // Redirecionar após a animação completa
    setTimeout(() => {
      router.push("/dashboard")
    }, 2800)
  }

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowRecoveryModal(true)
  }

  const handle2FAVerified = () => {
    if (loginData) {
      completeLogin(loginData.role, loginData.name)
    }
  }

  if (isTransitioning) {
    return <TransitionOverlay message={transitionMessage} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 p-4">
      {/* Toggle de Tema */}
      <Button
        onClick={toggleTheme}
        variant="outline"
        size="icon"
        className={`fixed top-4 right-4 z-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 ${mounted ? "opacity-100" : "opacity-0"}`}
      >
        {isDarkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-slate-600" />}
      </Button>

      <Card
        className={`w-full max-w-md shadow-xl border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        <CardHeader className="space-y-1 text-center">
          <div className={`flex items-center justify-center gap-2 mb-4 ${mounted ? "opacity-100" : "opacity-0"}`}>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent">
                ET & WICCA
              </h1>
              <p className="text-xs text-blue-500 dark:text-blue-400">Sistema de Gestão de TI</p>
            </div>
          </div>
          <CardTitle
            className={`text-xl text-slate-800 dark:text-slate-100 font-semibold ${mounted ? "opacity-100" : "opacity-0"}`}
          >
            Acesso Restrito
          </CardTitle>
          <CardDescription className={`text-slate-700 dark:text-slate-300 ${mounted ? "opacity-100" : "opacity-0"}`}>
            Entre com suas credenciais para acessar o sistema interno da empresa
          </CardDescription>
        </CardHeader>
        <CardContent className={mounted ? "opacity-100" : "opacity-0"}>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                E-mail
                {emailTouched &&
                  (emailValid ? (
                    <CheckCircle className="h-3.5 w-3.5 text-green-500 dark:text-green-400 ml-1" />
                  ) : (
                    email && <AlertCircle className="h-3.5 w-3.5 text-red-500 dark:text-red-400 ml-1" />
                  ))}
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@etwicca.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  required
                  className={cn(
                    "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400",
                    emailTouched && emailValid && "border-green-500 dark:border-green-400",
                    emailTouched && !emailValid && email && "border-red-500 dark:border-red-400",
                  )}
                />
                {emailTouched && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    {emailValid ? (
                      <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
                    ) : (
                      email && <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
                    )}
                  </div>
                )}
              </div>
              <ValidationMessage message={emailError} type="error" show={emailTouched && !!emailError} />
              <ValidationMessage message="Email válido" type="success" show={emailTouched && emailValid} />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                Senha
                {passwordTouched &&
                  (password ? (
                    <CheckCircle className="h-3.5 w-3.5 text-green-500 dark:text-green-400 ml-1" />
                  ) : (
                    <AlertCircle className="h-3.5 w-3.5 text-red-500 dark:text-red-400 ml-1" />
                  ))}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => {
                    setPasswordTouched(true)
                    setPasswordFocused(false)
                  }}
                  required
                  className={cn(
                    "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400",
                    passwordTouched && password && "border-green-500 dark:border-green-400",
                    passwordTouched && !password && "border-red-500 dark:border-red-400",
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <ValidationMessage message="Senha é obrigatória" type="error" show={passwordTouched && !password} />
              <div className="flex justify-end">
                <Button
                  variant="link"
                  className="p-0 h-auto text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  onClick={handleForgotPassword}
                >
                  Esqueceu sua senha?
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className={cn(
                "w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white shadow-lg",
                (!emailValid || !password) && "opacity-70 cursor-not-allowed",
              )}
              disabled={isLoading || !emailValid || !password}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Entrando...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Entrar no Sistema</span>
                  <Sparkles className="h-4 w-4" />
                </div>
              )}
            </Button>
          </form>

          <div
            className={`mt-6 p-4 bg-blue-50 dark:bg-slate-700/50 rounded-lg border border-blue-100 dark:border-slate-600 ${mounted ? "opacity-100" : "opacity-0"}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Credenciais de Demonstração</span>
            </div>
            <div className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
              <p>
                <strong>Admin:</strong> admin@etwicca.com / admin123
              </p>
              <p>
                <strong>TI:</strong> ti@etwicca.com / ti123
              </p>
              <p>
                <strong>Gestor:</strong> gestor@etwicca.com / gestor123
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-center gap-2">
              <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Proteja sua conta com{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  onClick={() => setShow2FAModal(true)}
                >
                  autenticação de dois fatores
                </Button>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Recuperação de Senha */}
      <PasswordRecoveryModal isOpen={showRecoveryModal} onClose={() => setShowRecoveryModal(false)} />

      {/* Modal de Autenticação de Dois Fatores */}
      <TwoFactorAuth
        isOpen={show2FAModal}
        onClose={() => setShow2FAModal(false)}
        onVerified={handle2FAVerified}
        email={email}
      />
    </div>
  )
}
