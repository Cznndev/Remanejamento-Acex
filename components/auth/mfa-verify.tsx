"use client"

import type React from "react"
import { useState } from "react"
import { MFAManager, MFAStorage } from "@/lib/auth/mfa"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, AlertCircle, KeyRound } from "lucide-react"

interface MFAVerifyProps {
  userId: string
  onVerified: () => void
  onCancel: () => void
}

export const MFAVerify: React.FC<MFAVerifyProps> = ({ userId, onVerified, onCancel }) => {
  const [code, setCode] = useState<string>("")
  const [backupCode, setBackupCode] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const [isVerifying, setIsVerifying] = useState<boolean>(false)

  // Verificar código TOTP
  const verifyTOTP = () => {
    setIsVerifying(true)
    setError("")

    if (code.length !== 6) {
      setError("O código deve ter 6 dígitos")
      setIsVerifying(false)
      return
    }

    const secret = MFAStorage.getMFASecret(userId)

    if (!secret) {
      setError("Configuração MFA não encontrada")
      setIsVerifying(false)
      return
    }

    const isValid = MFAManager.verifyTOTP(secret, code)

    if (isValid) {
      setSuccess("Código verificado com sucesso!")
      setTimeout(() => {
        onVerified()
      }, 1000)
    } else {
      setError("Código inválido. Tente novamente.")
      setIsVerifying(false)
    }
  }

  // Verificar código de backup
  const verifyBackupCode = () => {
    setIsVerifying(true)
    setError("")

    if (!backupCode || backupCode.length < 10) {
      setError("Código de backup inválido")
      setIsVerifying(false)
      return
    }

    const isValid = MFAStorage.useBackupCode(userId, backupCode)

    if (isValid) {
      setSuccess("Código de backup verificado com sucesso!")
      setTimeout(() => {
        onVerified()
      }, 1000)
    } else {
      setError("Código de backup inválido ou já utilizado")
      setIsVerifying(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Verificação de Dois Fatores</CardTitle>
        <CardDescription>Digite o código do seu aplicativo autenticador para continuar.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="app" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="app">Código</TabsTrigger>
            <TabsTrigger value="backup">Código de Backup</TabsTrigger>
          </TabsList>
          <TabsContent value="app">
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <label htmlFor="totp-code" className="text-sm font-medium">
                  Código de verificação
                </label>
                <Input
                  id="totp-code"
                  placeholder="Digite o código de 6 dígitos"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  disabled={isVerifying}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Sucesso</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
          <TabsContent value="backup">
            <div className="space-y-4 mt-4">
              <Alert>
                <KeyRound className="h-4 w-4" />
                <AlertTitle>Código de backup</AlertTitle>
                <AlertDescription>
                  Use um dos seus códigos de backup se você não tiver acesso ao seu aplicativo autenticador. Cada código
                  só pode ser usado uma vez.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <label htmlFor="backup-code" className="text-sm font-medium">
                  Código de backup
                </label>
                <Input
                  id="backup-code"
                  placeholder="XXXX-XXXX-XX"
                  value={backupCode}
                  onChange={(e) => setBackupCode(e.target.value.toUpperCase())}
                  disabled={isVerifying}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Sucesso</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel} disabled={isVerifying}>
          Cancelar
        </Button>
        <Button onClick={verifyTOTP} disabled={isVerifying}>
          {isVerifying ? "Verificando..." : "Verificar"}
        </Button>
      </CardFooter>
    </Card>
  )
}
