"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Save, RefreshCw, Shield } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface PasswordPolicy {
  minLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumbers: boolean
  requireSpecialChars: boolean
  preventCommonPasswords: boolean
  preventPasswordReuse: number
  passwordExpiryDays: number
  lockoutThreshold: number
  lockoutDuration: number
}

export function PasswordPolicyManager() {
  const [policy, setPolicy] = useState<PasswordPolicy>({
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    preventCommonPasswords: true,
    preventPasswordReuse: 5,
    passwordExpiryDays: 90,
    lockoutThreshold: 5,
    lockoutDuration: 30,
  })

  const [isSaving, setIsSaving] = useState(false)

  const calculatePasswordStrength = () => {
    let strength = 0

    // Base strength from length
    if (policy.minLength >= 16) strength += 3
    else if (policy.minLength >= 12) strength += 2
    else if (policy.minLength >= 8) strength += 1

    // Additional requirements
    if (policy.requireUppercase) strength += 1
    if (policy.requireLowercase) strength += 1
    if (policy.requireNumbers) strength += 1
    if (policy.requireSpecialChars) strength += 1
    if (policy.preventCommonPasswords) strength += 2

    // Password history
    if (policy.preventPasswordReuse >= 10) strength += 2
    else if (policy.preventPasswordReuse >= 5) strength += 1

    // Password expiry
    if (policy.passwordExpiryDays <= 60) strength += 2
    else if (policy.passwordExpiryDays <= 90) strength += 1

    // Account lockout
    if (policy.lockoutThreshold <= 3) strength += 2
    else if (policy.lockoutThreshold <= 5) strength += 1

    // Map to categories
    if (strength >= 12) return { level: "Excelente", color: "bg-green-500" }
    if (strength >= 9) return { level: "Forte", color: "bg-blue-500" }
    if (strength >= 6) return { level: "Moderada", color: "bg-amber-500" }
    return { level: "Básica", color: "bg-red-500" }
  }

  const strengthInfo = calculatePasswordStrength()

  const savePolicy = async () => {
    setIsSaving(true)

    // Simular delay de salvamento
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Em produção, isso seria uma chamada de API para salvar no servidor
    localStorage.setItem("et-wicca-password-policy", JSON.stringify(policy))

    toast({
      title: "Política de Senhas Atualizada",
      description: "As novas configurações de segurança foram aplicadas com sucesso.",
    })

    setIsSaving(false)
  }

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-blue-800">Política de Senhas Empresarial</CardTitle>
              <CardDescription>Configure requisitos avançados de segurança para senhas</CardDescription>
            </div>
          </div>
          <Badge className={`${strengthInfo.color} hover:${strengthInfo.color}`}>{strengthInfo.level}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            Políticas de senha robustas são essenciais para conformidade com ISO 27001, NIST 800-63B e outras
            regulamentações.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="minLength">Comprimento Mínimo: {policy.minLength} caracteres</Label>
            </div>
            <Slider
              id="minLength"
              min={8}
              max={20}
              step={1}
              value={[policy.minLength]}
              onValueChange={(value) => setPolicy((prev) => ({ ...prev, minLength: value[0] }))}
              className="py-4"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="requireUppercase">Exigir Letras Maiúsculas</Label>
              <Switch
                id="requireUppercase"
                checked={policy.requireUppercase}
                onCheckedChange={(checked) => setPolicy((prev) => ({ ...prev, requireUppercase: checked }))}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="requireLowercase">Exigir Letras Minúsculas</Label>
              <Switch
                id="requireLowercase"
                checked={policy.requireLowercase}
                onCheckedChange={(checked) => setPolicy((prev) => ({ ...prev, requireLowercase: checked }))}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="requireNumbers">Exigir Números</Label>
              <Switch
                id="requireNumbers"
                checked={policy.requireNumbers}
                onCheckedChange={(checked) => setPolicy((prev) => ({ ...prev, requireNumbers: checked }))}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="requireSpecialChars">Exigir Caracteres Especiais</Label>
              <Switch
                id="requireSpecialChars"
                checked={policy.requireSpecialChars}
                onCheckedChange={(checked) => setPolicy((prev) => ({ ...prev, requireSpecialChars: checked }))}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="preventCommonPasswords">Bloquear Senhas Comuns</Label>
              <Switch
                id="preventCommonPasswords"
                checked={policy.preventCommonPasswords}
                onCheckedChange={(checked) => setPolicy((prev) => ({ ...prev, preventCommonPasswords: checked }))}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium mb-3">Histórico e Expiração</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preventPasswordReuse">
                  Histórico de Senhas: {policy.preventPasswordReuse} senhas anteriores
                </Label>
                <Slider
                  id="preventPasswordReuse"
                  min={0}
                  max={24}
                  step={1}
                  value={[policy.preventPasswordReuse]}
                  onValueChange={(value) => setPolicy((prev) => ({ ...prev, preventPasswordReuse: value[0] }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passwordExpiryDays">Expiração de Senha: {policy.passwordExpiryDays} dias</Label>
                <Slider
                  id="passwordExpiryDays"
                  min={30}
                  max={365}
                  step={30}
                  value={[policy.passwordExpiryDays]}
                  onValueChange={(value) => setPolicy((prev) => ({ ...prev, passwordExpiryDays: value[0] }))}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium mb-3">Proteção contra Força Bruta</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lockoutThreshold">Bloqueio após {policy.lockoutThreshold} tentativas falhas</Label>
                <Slider
                  id="lockoutThreshold"
                  min={3}
                  max={10}
                  step={1}
                  value={[policy.lockoutThreshold]}
                  onValueChange={(value) => setPolicy((prev) => ({ ...prev, lockoutThreshold: value[0] }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lockoutDuration">Duração do Bloqueio: {policy.lockoutDuration} minutos</Label>
                <Slider
                  id="lockoutDuration"
                  min={5}
                  max={60}
                  step={5}
                  value={[policy.lockoutDuration]}
                  onValueChange={(value) => setPolicy((prev) => ({ ...prev, lockoutDuration: value[0] }))}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={savePolicy} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                <span>Salvar Política</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
