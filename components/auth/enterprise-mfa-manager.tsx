"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Smartphone, Key, Mail, AlertCircle, Save, RefreshCw, UserCheck, Building2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function EnterpriseMFAManager() {
  const [settings, setSettings] = useState({
    enforceMFA: true,
    allowedMethods: {
      app: true,
      email: true,
      sms: false,
      hardwareKey: true,
    },
    exemptGroups: [],
    gracePolicy: "14days",
    rememberDevice: 30,
    requireMFAForVPN: true,
    requireMFAForSensitiveOperations: true,
    requireMFAForExternalAccess: true,
    requireMFAForAdminAccess: true,
    requireMFAForPasswordReset: true,
  })

  const [isSaving, setIsSaving] = useState(false)

  const saveSettings = async () => {
    setIsSaving(true)

    // Simular delay de salvamento
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Em produção, isso seria uma chamada de API para salvar no servidor
    localStorage.setItem("et-wicca-mfa-policy", JSON.stringify(settings))

    toast({
      title: "Configurações de MFA Atualizadas",
      description: "As novas políticas de autenticação multifator foram aplicadas com sucesso.",
    })

    setIsSaving(false)
  }

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-blue-800">Autenticação Multifator Empresarial</CardTitle>
            <CardDescription>Configure políticas avançadas de MFA para sua organização</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            A autenticação multifator é recomendada pelo NIST e exigida por várias regulamentações como PCI DSS, HIPAA e
            GDPR.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general" className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              <span>Geral</span>
            </TabsTrigger>
            <TabsTrigger value="methods" className="flex items-center gap-1">
              <Smartphone className="h-4 w-4" />
              <span>Métodos</span>
            </TabsTrigger>
            <TabsTrigger value="access" className="flex items-center gap-1">
              <Key className="h-4 w-4" />
              <span>Acesso</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 pt-4">
            <div className="flex items-center justify-between space-x-2">
              <div>
                <Label htmlFor="enforceMFA" className="font-medium">
                  Exigir MFA para Todos os Usuários
                </Label>
                <p className="text-sm text-gray-500">Todos os usuários serão obrigados a configurar MFA</p>
              </div>
              <Switch
                id="enforceMFA"
                checked={settings.enforceMFA}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, enforceMFA: checked }))}
              />
            </div>

            <div className="space-y-3 pt-4">
              <Label className="font-medium">Política de Implementação</Label>
              <RadioGroup
                value={settings.gracePolicy}
                onValueChange={(value) => setSettings((prev) => ({ ...prev, gracePolicy: value }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="immediate" id="immediate" />
                  <Label htmlFor="immediate">Imediata (Exigir na próxima autenticação)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="14days" id="14days" />
                  <Label htmlFor="14days">Período de Adaptação (14 dias)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nextpassword" id="nextpassword" />
                  <Label htmlFor="nextpassword">Na próxima alteração de senha</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="rememberDevice" className="font-medium">
                    Lembrar Dispositivos Confiáveis
                  </Label>
                  <p className="text-sm text-gray-500">Por quantos dias o dispositivo será lembrado</p>
                </div>
                <div className="w-24">
                  <select
                    id="rememberDevice"
                    className="w-full rounded-md border border-gray-300 p-2"
                    value={settings.rememberDevice}
                    onChange={(e) => setSettings((prev) => ({ ...prev, rememberDevice: Number(e.target.value) }))}
                  >
                    <option value="0">Nunca</option>
                    <option value="1">1 dia</option>
                    <option value="7">7 dias</option>
                    <option value="30">30 dias</option>
                    <option value="90">90 dias</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <Label className="font-medium">Grupos Isentos</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="contractors" className="rounded" />
                  <Label htmlFor="contractors">Prestadores de Serviço</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="readonly" className="rounded" />
                  <Label htmlFor="readonly">Usuários Somente Leitura</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="legacy" className="rounded" />
                  <Label htmlFor="legacy">Sistemas Legados</Label>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="methods" className="space-y-4 pt-4">
            <div className="space-y-4">
              <Label className="font-medium">Métodos de MFA Permitidos</Label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Aplicativo Autenticador</p>
                      <p className="text-sm text-gray-500">Google Authenticator, Microsoft Authenticator, etc.</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.allowedMethods.app}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        allowedMethods: { ...prev.allowedMethods, app: checked },
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-gray-500">Código enviado para email secundário</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.allowedMethods.email}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        allowedMethods: { ...prev.allowedMethods, email: checked },
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">SMS</p>
                      <p className="text-sm text-gray-500">Código enviado por mensagem de texto</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.allowedMethods.sms}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        allowedMethods: { ...prev.allowedMethods, sms: checked },
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Chave de Segurança</p>
                      <p className="text-sm text-gray-500">YubiKey, Google Titan, etc.</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.allowedMethods.hardwareKey}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        allowedMethods: { ...prev.allowedMethods, hardwareKey: checked },
                      }))
                    }
                  />
                </div>
              </div>

              <Alert className="bg-amber-50 border-amber-200 mt-4">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-700">
                  O NIST não recomenda mais SMS como método de MFA devido a vulnerabilidades conhecidas.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>

          <TabsContent value="access" className="space-y-4 pt-4">
            <div className="space-y-4">
              <Label className="font-medium">Requisitos de MFA para Acesso Específico</Label>

              <div className="space-y-3">
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-600" />
                    <Label>Acesso VPN</Label>
                  </div>
                  <Switch
                    checked={settings.requireMFAForVPN}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, requireMFAForVPN: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <Label>Operações Sensíveis</Label>
                  </div>
                  <Switch
                    checked={settings.requireMFAForSensitiveOperations}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({ ...prev, requireMFAForSensitiveOperations: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-blue-600" />
                    <Label>Acesso Externo</Label>
                  </div>
                  <Switch
                    checked={settings.requireMFAForExternalAccess}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({ ...prev, requireMFAForExternalAccess: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-blue-600" />
                    <Label>Acesso Administrativo</Label>
                  </div>
                  <Switch
                    checked={settings.requireMFAForAdminAccess}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({ ...prev, requireMFAForAdminAccess: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-blue-600" />
                    <Label>Redefinição de Senha</Label>
                  </div>
                  <Switch
                    checked={settings.requireMFAForPasswordReset}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({ ...prev, requireMFAForPasswordReset: checked }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <Label className="font-medium">Grupos com MFA Obrigatório</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="admins" className="rounded" checked disabled />
                  <Label htmlFor="admins">Administradores</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="finance" className="rounded" checked />
                  <Label htmlFor="finance">Financeiro</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="hr" className="rounded" checked />
                  <Label htmlFor="hr">Recursos Humanos</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="it" className="rounded" checked />
                  <Label htmlFor="it">TI</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="sales" className="rounded" />
                  <Label htmlFor="sales">Vendas</Label>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button onClick={saveSettings} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                <span>Salvar Configurações</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function Globe(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}
