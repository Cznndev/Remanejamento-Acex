"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle, Copy, AlertCircle, Smartphone, KeyRound, Shield, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface TwoFactorAuthProps {
  isOpen: boolean
  onClose: () => void
  onVerified: () => void
  email: string
}

export function TwoFactorAuth({ isOpen, onClose, onVerified, email }: TwoFactorAuthProps) {
  const [step, setStep] = useState<"verify" | "setup" | "backup" | "success">("verify")
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [secret, setSecret] = useState("")
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [recoveryMethod, setRecoveryMethod] = useState<"app" | "backup">("app")

  // Simular carregamento de dados do usuário
  useEffect(() => {
    if (isOpen) {
      // Verificar se o usuário já tem 2FA configurado
      const has2FA = localStorage.getItem(`2fa_enabled_${email}`) === "true"

      if (has2FA) {
        setStep("verify")
      } else {
        // Gerar segredo e QR code para configuração
        generateSecret()
      }
    }
  }, [isOpen, email])

  // Gerar segredo para configuração
  const generateSecret = () => {
    // Em produção, isso seria feito no servidor
    const randomSecret = Array.from({ length: 16 }, () =>
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567".charAt(Math.floor(Math.random() * 32)),
    ).join("")

    setSecret(randomSecret)

    // Gerar URL para QR code
    const otpAuthUrl = `otpauth://totp/ET%26WICCA:${encodeURIComponent(email)}?secret=${randomSecret}&issuer=ET%26WICCA&algorithm=SHA1&digits=6&period=30`

    // Em produção, usaríamos uma biblioteca como qrcode para gerar o QR code
    // Aqui estamos usando um serviço externo para demonstração
    setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpAuthUrl)}`)

    setStep("setup")
  }

  // Verificar código 2FA
  const verifyCode = () => {
    setError("")
    setIsLoading(true)

    // Validar formato do código
    if (!/^\d{6}$/.test(code)) {
      setError("O código deve conter 6 dígitos")
      setIsLoading(false)
      return
    }

    // Simular verificação do código (em produção, isso seria feito no servidor)
    setTimeout(() => {
      // Para demonstração, aceitamos qualquer código que termine em "00" como válido
      const isValid = code.endsWith("00")

      if (isValid) {
        if (step === "setup") {
          // Gerar códigos de backup
          generateBackupCodes()
        } else {
          // Login bem-sucedido
          onVerified()
          onClose()
        }
      } else {
        setError("Código inválido. Tente novamente.")
      }
      setIsLoading(false)
    }, 1500)
  }

  // Gerar códigos de backup
  const generateBackupCodes = () => {
    const codes = Array.from({ length: 10 }, () => {
      const group1 = Math.random().toString(36).substring(2, 6).toUpperCase()
      const group2 = Math.random().toString(36).substring(2, 6).toUpperCase()
      return `${group1}-${group2}`
    })

    setBackupCodes(codes)
    setStep("backup")
  }

  // Finalizar configuração
  const finishSetup = () => {
    // Salvar configuração 2FA (em produção, isso seria feito no servidor)
    localStorage.setItem(`2fa_enabled_${email}`, "true")
    localStorage.setItem(`2fa_secret_${email}`, secret)
    localStorage.setItem(`2fa_backup_codes_${email}`, JSON.stringify(backupCodes))

    setStep("success")
  }

  // Verificar código de backup
  const verifyBackupCode = () => {
    setError("")
    setIsLoading(true)

    // Validar formato do código de backup
    if (!/^[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)) {
      setError("Formato de código inválido. Use o formato XXXX-XXXX")
      setIsLoading(false)
      return
    }

    // Simular verificação do código (em produção, isso seria feito no servidor)
    setTimeout(() => {
      // Para demonstração, aceitamos qualquer código que contenha "AA" como válido
      const isValid = code.includes("AA")

      if (isValid) {
        // Login bem-sucedido
        onVerified()
        onClose()
      } else {
        setError("Código de backup inválido. Tente novamente.")
      }
      setIsLoading(false)
    }, 1500)
  }

  // Copiar códigos de backup para a área de transferência
  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join("\n"))
  }

  // Renderizar conteúdo com base no passo atual
  const renderContent = () => {
    switch (step) {
      case "verify":
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Verificação em Duas Etapas
              </DialogTitle>
              <DialogDescription>
                Digite o código de 6 dígitos do seu aplicativo autenticador para continuar.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Tabs value={recoveryMethod} onValueChange={(v) => setRecoveryMethod(v as "app" | "backup")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="app" className="flex items-center gap-1">
                    <Smartphone className="h-3.5 w-3.5" />
                    <span>Aplicativo</span>
                  </TabsTrigger>
                  <TabsTrigger value="backup" className="flex items-center gap-1">
                    <KeyRound className="h-3.5 w-3.5" />
                    <span>Código de Backup</span>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="app" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Smartphone className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div className="text-center mb-4">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Abra seu aplicativo autenticador e digite o código de 6 dígitos para {email}
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <Input
                        className="text-center text-lg max-w-[200px] font-mono"
                        placeholder="000000"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        maxLength={6}
                      />
                    </div>
                  </div>
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Erro</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </TabsContent>
                <TabsContent value="backup" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <KeyRound className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                      </div>
                    </div>
                    <div className="text-center mb-4">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Digite um dos seus códigos de backup no formato XXXX-XXXX
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <Input
                        className="text-center text-lg max-w-[200px] font-mono"
                        placeholder="XXXX-XXXX"
                        value={code}
                        onChange={(e) => {
                          const value = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "")
                          setCode(value)
                        }}
                        maxLength={9}
                      />
                    </div>
                  </div>
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Erro</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </TabsContent>
              </Tabs>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                Cancelar
              </Button>
              <Button
                onClick={recoveryMethod === "app" ? verifyCode : verifyBackupCode}
                disabled={isLoading || (recoveryMethod === "app" ? code.length !== 6 : !code)}
                className={cn(
                  "relative",
                  recoveryMethod === "app" ? "bg-blue-600 hover:bg-blue-700" : "bg-amber-600 hover:bg-amber-700",
                )}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    <span>Verificando...</span>
                  </>
                ) : (
                  <>
                    <span>Verificar</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )

      case "setup":
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Configurar Autenticação de Dois Fatores
              </DialogTitle>
              <DialogDescription>
                Escaneie o QR code com seu aplicativo autenticador para aumentar a segurança da sua conta.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-white p-2 rounded-lg">
                  {qrCodeUrl && (
                    <img
                      src={qrCodeUrl || "/placeholder.svg"}
                      alt="QR Code"
                      width={200}
                      height={200}
                      className="rounded"
                    />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Escaneie o QR code acima com um aplicativo autenticador como Google Authenticator, Authy ou
                    Microsoft Authenticator.
                  </p>
                  <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Ou insira este código manualmente:
                    </p>
                    <p className="font-mono text-sm select-all">{secret}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <label htmlFor="verification-code" className="text-sm font-medium">
                  Digite o código de 6 dígitos do seu aplicativo
                </label>
                <Input
                  id="verification-code"
                  className="text-center text-lg font-mono"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                Cancelar
              </Button>
              <Button
                onClick={verifyCode}
                disabled={isLoading || code.length !== 6}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    <span>Verificando...</span>
                  </>
                ) : (
                  <>
                    <span>Verificar e Continuar</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )

      case "backup":
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                Códigos de Backup
              </DialogTitle>
              <DialogDescription>
                Guarde estes códigos em um local seguro. Você pode usá-los para acessar sua conta caso perca acesso ao
                seu aplicativo autenticador.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertTitle className="text-amber-800 dark:text-amber-300">Importante</AlertTitle>
                <AlertDescription className="text-amber-700 dark:text-amber-400">
                  Cada código só pode ser usado uma vez. Guarde-os em um local seguro e não compartilhe com ninguém.
                </AlertDescription>
              </Alert>

              <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
                <div className="grid grid-cols-2 gap-2">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="font-mono text-sm text-slate-700 dark:text-slate-300">
                      {code}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center">
                <Button variant="outline" onClick={copyBackupCodes} className="flex items-center gap-2">
                  <Copy className="h-4 w-4" />
                  Copiar códigos
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={finishSetup} className="bg-blue-600 hover:bg-blue-700">
                Concluir Configuração
              </Button>
            </DialogFooter>
          </>
        )

      case "success":
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="h-5 w-5" />
                Configuração Concluída
              </DialogTitle>
              <DialogDescription>
                A autenticação de dois fatores foi ativada com sucesso para sua conta.
              </DialogDescription>
            </DialogHeader>
            <div className="py-8 flex flex-col items-center justify-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Shield className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                  Sua conta está protegida
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  A partir de agora, você precisará fornecer um código de verificação ao fazer login.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={onClose} className="bg-green-600 hover:bg-green-700 w-full">
                Entendi
              </Button>
            </DialogFooter>
          </>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">{renderContent()}</DialogContent>
    </Dialog>
  )
}
