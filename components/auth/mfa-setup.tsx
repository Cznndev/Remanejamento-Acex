"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { MFAManager, MFAStorage } from "@/lib/auth/mfa"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Copy, AlertCircle, Smartphone } from "lucide-react"

interface MFASetupProps {
  userId: string
  username: string
  onComplete: (enabled: boolean) => void
}

export const MFASetup: React.FC<MFASetupProps> = ({ userId, username, onComplete }) => {
  const [secret, setSecret] = useState<string>("")
  const [qrCode, setQrCode] = useState<string>("")
  const [verificationCode, setVerificationCode] = useState<string>("")
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [step, setStep] = useState<number>(1)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const [isEnabled, setIsEnabled] = useState<boolean>(false)

  // Verificar se MFA já está habilitado
  useEffect(() => {
    const enabled = MFAStorage.isMFAEnabled(userId)
    setIsEnabled(enabled)

    if (!enabled) {
      // Gerar novo segredo
      const newSecret = MFAManager.generateSecret(username)
      setSecret(newSecret)

      // Gerar URL para QR Code
      const totpUrl = MFAManager.generateTOTPUrl(username, newSecret)

      // Gerar QR Code
      MFAManager.generateQRCode(totpUrl)
        .then((dataUrl) => setQrCode(dataUrl))
        .catch((err) => setError("Erro ao gerar QR Code"))
    }
  }, [userId, username])

  // Verificar código
  const verifyCode = () => {
    if (verificationCode.length !== 6) {
      setError("O código deve ter 6 dígitos")
      return
    }

    const isValid = MFAManager.verifyTOTP(secret, verificationCode)

    if (isValid) {
      // Gerar códigos de backup
      const codes = MFAManager.generateBackupCodes()
      setBackupCodes(codes)

      setSuccess("Código verificado com sucesso!")
      setError("")
      setStep(2)
    } else {
      setError("Código inválido. Tente novamente.")
    }
  }

  // Finalizar configuração
  const finishSetup = () => {
    // Salvar estado MFA
    MFAStorage.saveMFAState(userId, true, secret)

    // Salvar códigos de backup
    MFAStorage.saveBackupCodes(userId, backupCodes)

    setIsEnabled(true)
    setSuccess("Autenticação de dois fatores ativada com sucesso!")
    onComplete(true)
  }

  // Desativar MFA
  const disableMFA = () => {
    MFAStorage.clearMFAData(userId)
    setIsEnabled(false)
    setSuccess("Autenticação de dois fatores desativada com sucesso!")
    onComplete(false)
  }

  // Copiar códigos de backup
  const copyBackupCodes = () => {
    navigator.clipboard
      .writeText(backupCodes.join("\n"))
      .then(() => setSuccess("Códigos de backup copiados para a área de transferência!"))
      .catch(() => setError("Erro ao copiar códigos"))
  }

  if (isEnabled) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Autenticação de Dois Fatores</CardTitle>
          <CardDescription>A autenticação de dois fatores está ativada para sua conta.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 bg-green-50">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Ativado</AlertTitle>
            <AlertDescription>Sua conta está protegida com autenticação de dois fatores.</AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              const codes = MFAStorage.getBackupCodes(userId)
              setBackupCodes(codes)
              setStep(2)
            }}
          >
            Ver códigos de backup
          </Button>
          <Button variant="destructive" onClick={disableMFA}>
            Desativar
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Configurar Autenticação de Dois Fatores</CardTitle>
        <CardDescription>Proteja sua conta com uma camada adicional de segurança.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="app" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="app">Aplicativo</TabsTrigger>
            <TabsTrigger value="sms" disabled>
              SMS (Em breve)
            </TabsTrigger>
          </TabsList>
          <TabsContent value="app">
            {step === 1 && (
              <div className="space-y-4 mt-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-4">
                    Escaneie o QR code abaixo com um aplicativo autenticador como Google Authenticator, Authy ou
                    Microsoft Authenticator.
                  </p>

                  {qrCode && (
                    <div className="flex justify-center mb-4">
                      <img src={qrCode || "/placeholder.svg"} alt="QR Code" className="border p-2 rounded-md" />
                    </div>
                  )}

                  <div className="text-sm text-gray-500 mb-4">
                    <p className="mb-2">Ou insira este código manualmente no aplicativo:</p>
                    <div className="bg-gray-100 p-2 rounded-md font-mono text-center break-all">{secret}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="code" className="text-sm font-medium">
                    Código de verificação
                  </label>
                  <Input
                    id="code"
                    placeholder="Digite o código de 6 dígitos"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
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

                {success && (
                  <Alert className="bg-green-50">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Sucesso</AlertTitle>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 mt-4">
                <Alert className="mb-4">
                  <Smartphone className="h-4 w-4" />
                  <AlertTitle>Guarde seus códigos de backup</AlertTitle>
                  <AlertDescription>
                    Se você perder acesso ao seu aplicativo autenticador, você pode usar estes códigos para entrar.
                    Guarde-os em um local seguro.
                  </AlertDescription>
                </Alert>

                <div className="bg-gray-100 p-3 rounded-md">
                  <div className="grid grid-cols-2 gap-2">
                    {backupCodes.map((code, index) => (
                      <div key={index} className="font-mono text-sm">
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
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        {step === 1 ? (
          <>
            <Button variant="outline" onClick={() => onComplete(false)}>
              Cancelar
            </Button>
            <Button onClick={verifyCode}>Verificar</Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={() => setStep(1)}>
              Voltar
            </Button>
            <Button onClick={finishSetup}>Concluir</Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
