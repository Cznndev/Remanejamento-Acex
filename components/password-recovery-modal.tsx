"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, ArrowLeft, CheckCircle, Mail, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface PasswordRecoveryModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PasswordRecoveryModal({ isOpen, onClose }: PasswordRecoveryModalProps) {
  const [email, setEmail] = useState("")
  const [emailValid, setEmailValid] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    setEmailValid(validateEmail(value))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setEmailTouched(true)

    if (!emailValid) {
      setErrorMessage("Por favor, insira um email válido.")
      return
    }

    setIsLoading(true)
    setErrorMessage("")

    // Simular envio de email de recuperação
    setTimeout(() => {
      // Verificar se é um email de demonstração
      const demoEmails = ["admin@etwicca.com", "ti@etwicca.com", "gestor@etwicca.com"]

      if (demoEmails.includes(email.toLowerCase())) {
        setIsSuccess(true)
        setIsLoading(false)
      } else {
        // Simular erro para emails não reconhecidos
        setErrorMessage("Email não encontrado no sistema.")
        setIsLoading(false)
      }
    }, 1500)
  }

  const handleReset = () => {
    setEmail("")
    setEmailValid(false)
    setEmailTouched(false)
    setIsSuccess(false)
    setErrorMessage("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-center text-slate-800 dark:text-slate-100">
            {isSuccess ? "Email Enviado" : "Recuperação de Senha"}
          </DialogTitle>
          <DialogDescription className="text-center text-slate-600 dark:text-slate-400">
            {isSuccess
              ? "Verifique sua caixa de entrada para instruções de recuperação."
              : "Insira seu email para receber instruções de recuperação de senha."}
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-4 space-y-4">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 text-center max-w-xs">
              Um email com instruções para redefinir sua senha foi enviado para <strong>{email}</strong>.
            </p>
            <Button onClick={handleReset} className="mt-4 w-full">
              Voltar para o Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recovery-email" className="text-slate-700 dark:text-slate-300">
                Email
              </Label>
              <div className="relative">
                <Input
                  id="recovery-email"
                  type="email"
                  placeholder="seu.email@etwicca.com"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => setEmailTouched(true)}
                  className={cn(
                    "pl-9 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700",
                    emailTouched && emailValid && "border-green-500 dark:border-green-400",
                    emailTouched && !emailValid && email && "border-red-500 dark:border-red-400",
                  )}
                  disabled={isLoading}
                  required
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                {emailTouched && email && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {emailValid ? (
                      <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
                    )}
                  </div>
                )}
              </div>
              {errorMessage && (
                <p className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  {errorMessage}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <Button type="submit" disabled={isLoading || (!emailValid && emailTouched)}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar Instruções"
                )}
              </Button>
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para o Login
              </Button>
            </div>

            <div className="bg-blue-50 dark:bg-slate-700/50 p-3 rounded-md border border-blue-100 dark:border-slate-600">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                <strong>Dica:</strong> Para demonstração, use um dos emails de exemplo: admin@etwicca.com,
                ti@etwicca.com ou gestor@etwicca.com
              </p>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
