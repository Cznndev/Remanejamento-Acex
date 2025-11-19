"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Save, RefreshCw, Key, FileText, Lock, Copy } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function SSOIntegration() {
  const [isLoading, setIsLoading] = useState(false)

  const [azureConfig, setAzureConfig] = useState({
    enabled: true,
    tenantId: "12345678-1234-1234-1234-123456789012",
    clientId: "87654321-4321-4321-4321-210987654321",
    clientSecret: "••••••••••••••••••••••••••••••••",
    redirectUri: "https://etwicca.com/auth/azure/callback",
    allowedDomains: "etwicca.com",
    autoProvision: true,
    defaultRole: "usuario",
  })

  const [googleConfig, setGoogleConfig] = useState({
    enabled: false,
    clientId: "",
    clientSecret: "",
    redirectUri: "https://etwicca.com/auth/google/callback",
    allowedDomains: "",
    autoProvision: false,
    defaultRole: "usuario",
  })

  const [samlConfig, setSamlConfig] = useState({
    enabled: false,
    entityId: "https://etwicca.com/saml/metadata",
    assertionUrl: "https://etwicca.com/saml/acs",
    certificate: "",
    allowedIdps: "",
    autoProvision: true,
    attributeMapping: {
      email: "email",
      firstName: "givenName",
      lastName: "surname",
      role: "role",
    },
  })

  const saveConfig = async (provider) => {
    setIsLoading(true)

    // Simular delay de salvamento
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Em produção, isso seria uma chamada de API para salvar no servidor
    toast({
      title: "Configuração Salva",
      description: `Integração SSO com ${provider} atualizada com sucesso.`,
    })

    setIsLoading(false)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copiado!",
      description: "Valor copiado para a área de transferência.",
    })
  }

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
            <Key className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-blue-800">Integração SSO Empresarial</CardTitle>
            <CardDescription>Configure provedores de identidade para autenticação única</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            O Single Sign-On (SSO) permite que os usuários acessem múltiplos sistemas com uma única autenticação,
            melhorando a segurança e a experiência do usuário.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="azure">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="azure" className="flex items-center gap-1">
              <MicrosoftIcon className="h-4 w-4" />
              <span>Microsoft Entra ID</span>
            </TabsTrigger>
            <TabsTrigger value="google" className="flex items-center gap-1">
              <GoogleIcon className="h-4 w-4" />
              <span>Google Workspace</span>
            </TabsTrigger>
            <TabsTrigger value="saml" className="flex items-center gap-1">
              <Lock className="h-4 w-4" />
              <span>SAML Genérico</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="azure" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="azure-enabled" className="font-medium">
                  Habilitar SSO com Microsoft Entra ID
                </Label>
                <p className="text-sm text-gray-500">Permitir login com contas Microsoft</p>
              </div>
              <Switch
                id="azure-enabled"
                checked={azureConfig.enabled}
                onCheckedChange={(checked) => setAzureConfig((prev) => ({ ...prev, enabled: checked }))}
              />
            </div>

            {azureConfig.enabled && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="azure-tenant-id">ID do Tenant</Label>
                    <div className="relative">
                      <Input
                        id="azure-tenant-id"
                        value={azureConfig.tenantId}
                        onChange={(e) => setAzureConfig((prev) => ({ ...prev, tenantId: e.target.value }))}
                        className="pr-10 border-blue-200"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => copyToClipboard(azureConfig.tenantId)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="azure-client-id">ID do Cliente</Label>
                    <div className="relative">
                      <Input
                        id="azure-client-id"
                        value={azureConfig.clientId}
                        onChange={(e) => setAzureConfig((prev) => ({ ...prev, clientId: e.target.value }))}
                        className="pr-10 border-blue-200"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => copyToClipboard(azureConfig.clientId)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="azure-client-secret">Segredo do Cliente</Label>
                  <div className="relative">
                    <Input
                      id="azure-client-secret"
                      type="password"
                      value={azureConfig.clientSecret}
                      onChange={(e) => setAzureConfig((prev) => ({ ...prev, clientSecret: e.target.value }))}
                      className="pr-10 border-blue-200"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => copyToClipboard(azureConfig.clientSecret)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="azure-redirect-uri">URI de Redirecionamento</Label>
                  <div className="relative">
                    <Input
                      id="azure-redirect-uri"
                      value={azureConfig.redirectUri}
                      onChange={(e) => setAzureConfig((prev) => ({ ...prev, redirectUri: e.target.value }))}
                      className="pr-10 border-blue-200"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => copyToClipboard(azureConfig.redirectUri)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Adicione este URI à configuração do seu aplicativo no Azure Portal
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="azure-allowed-domains">Domínios Permitidos</Label>
                  <Input
                    i
                    d="azure-allowed-domains"
                    value={azureConfig.allowedDomains}
                    onChange={(e) => setAzureConfig((prev) => ({ ...prev, allowedDomains: e.target.value }))}
                    placeholder="exemplo.com, outro.com"
                    className="border-blue-200"
                  />
                  <p className="text-xs text-gray-500">
                    Separe múltiplos domínios com vírgulas. Deixe em branco para permitir qualquer domínio.
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200 space-y-4">
                  <h3 className="text-sm font-medium">Configurações Avançadas</h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="azure-auto-provision" className="font-medium">
                        Provisionamento Automático
                      </Label>
                      <p className="text-sm text-gray-500">Criar usuários automaticamente no primeiro login</p>
                    </div>
                    <Switch
                      id="azure-auto-provision"
                      checked={azureConfig.autoProvision}
                      onCheckedChange={(checked) => setAzureConfig((prev) => ({ ...prev, autoProvision: checked }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="azure-default-role">Função Padrão</Label>
                    <select
                      id="azure-default-role"
                      className="w-full rounded-md border border-gray-300 p-2"
                      value={azureConfig.defaultRole}
                      onChange={(e) => setAzureConfig((prev) => ({ ...prev, defaultRole: e.target.value }))}
                    >
                      <option value="usuario">Usuário</option>
                      <option value="gestor">Gestor</option>
                      <option value="administrador">Administrador</option>
                    </select>
                    <p className="text-xs text-gray-500">Função atribuída aos usuários criados automaticamente</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-gray-200">
              <Button
                onClick={() => saveConfig("Microsoft Entra ID")}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    <span>Salvar Configuração</span>
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="google" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="google-enabled" className="font-medium">
                  Habilitar SSO com Google Workspace
                </Label>
                <p className="text-sm text-gray-500">Permitir login com contas Google</p>
              </div>
              <Switch
                id="google-enabled"
                checked={googleConfig.enabled}
                onCheckedChange={(checked) => setGoogleConfig((prev) => ({ ...prev, enabled: checked }))}
              />
            </div>

            {googleConfig.enabled && (
              <div className="space-y-4 pt-2">
                <Alert className="bg-amber-50 border-amber-200">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-700">
                    Configure um projeto no Google Cloud Console e obtenha as credenciais OAuth 2.0 para continuar.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="google-client-id">ID do Cliente</Label>
                    <Input
                      id="google-client-id"
                      value={googleConfig.clientId}
                      onChange={(e) => setGoogleConfig((prev) => ({ ...prev, clientId: e.target.value }))}
                      placeholder="Seu ID do Cliente Google"
                      className="border-blue-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="google-client-secret">Segredo do Cliente</Label>
                    <Input
                      id="google-client-secret"
                      type="password"
                      value={googleConfig.clientSecret}
                      onChange={(e) => setGoogleConfig((prev) => ({ ...prev, clientSecret: e.target.value }))}
                      placeholder="Seu Segredo do Cliente Google"
                      className="border-blue-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="google-redirect-uri">URI de Redirecionamento</Label>
                  <div className="relative">
                    <Input
                      id="google-redirect-uri"
                      value={googleConfig.redirectUri}
                      onChange={(e) => setGoogleConfig((prev) => ({ ...prev, redirectUri: e.target.value }))}
                      className="pr-10 border-blue-200"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => copyToClipboard(googleConfig.redirectUri)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Adicione este URI à configuração do seu projeto no Google Cloud Console
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="google-allowed-domains">Domínios Permitidos</Label>
                  <Input
                    id="google-allowed-domains"
                    value={googleConfig.allowedDomains}
                    onChange={(e) => setGoogleConfig((prev) => ({ ...prev, allowedDomains: e.target.value }))}
                    placeholder="exemplo.com, outro.com"
                    className="border-blue-200"
                  />
                  <p className="text-xs text-gray-500">
                    Separe múltiplos domínios com vírgulas. Deixe em branco para permitir qualquer domínio.
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200 space-y-4">
                  <h3 className="text-sm font-medium">Configurações Avançadas</h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="google-auto-provision" className="font-medium">
                        Provisionamento Automático
                      </Label>
                      <p className="text-sm text-gray-500">Criar usuários automaticamente no primeiro login</p>
                    </div>
                    <Switch
                      id="google-auto-provision"
                      checked={googleConfig.autoProvision}
                      onCheckedChange={(checked) => setGoogleConfig((prev) => ({ ...prev, autoProvision: checked }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="google-default-role">Função Padrão</Label>
                    <select
                      id="google-default-role"
                      className="w-full rounded-md border border-gray-300 p-2"
                      value={googleConfig.defaultRole}
                      onChange={(e) => setGoogleConfig((prev) => ({ ...prev, defaultRole: e.target.value }))}
                    >
                      <option value="usuario">Usuário</option>
                      <option value="gestor">Gestor</option>
                      <option value="administrador">Administrador</option>
                    </select>
                    <p className="text-xs text-gray-500">Função atribuída aos usuários criados automaticamente</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-gray-200">
              <Button
                onClick={() => saveConfig("Google Workspace")}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    <span>Salvar Configuração</span>
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="saml" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="saml-enabled" className="font-medium">
                  Habilitar SSO com SAML 2.0
                </Label>
                <p className="text-sm text-gray-500">Permitir login com qualquer provedor SAML 2.0</p>
              </div>
              <Switch
                id="saml-enabled"
                checked={samlConfig.enabled}
                onCheckedChange={(checked) => setSamlConfig((prev) => ({ ...prev, enabled: checked }))}
              />
            </div>

            {samlConfig.enabled && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="saml-entity-id">ID da Entidade (SP)</Label>
                    <div className="relative">
                      <Input
                        id="saml-entity-id"
                        value={samlConfig.entityId}
                        onChange={(e) => setSamlConfig((prev) => ({ ...prev, entityId: e.target.value }))}
                        className="pr-10 border-blue-200"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => copyToClipboard(samlConfig.entityId)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">Identificador único para este serviço no IdP</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="saml-assertion-url">URL de Asserção (ACS)</Label>
                    <div className="relative">
                      <Input
                        id="saml-assertion-url"
                        value={samlConfig.assertionUrl}
                        onChange={(e) => setSamlConfig((prev) => ({ ...prev, assertionUrl: e.target.value }))}
                        className="pr-10 border-blue-200"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => copyToClipboard(samlConfig.assertionUrl)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">URL para receber as respostas SAML</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="saml-certificate">Certificado do IdP</Label>
                  <textarea
                    id="saml-certificate"
                    value={samlConfig.certificate}
                    onChange={(e) => setSamlConfig((prev) => ({ ...prev, certificate: e.target.value }))}
                    placeholder="Cole o certificado X.509 do seu IdP aqui"
                    className="w-full min-h-[150px] rounded-md border border-blue-200 p-2"
                  />
                  <p className="text-xs text-gray-500">
                    Certificado X.509 em formato PEM do seu provedor de identidade
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="saml-allowed-idps">Provedores de Identidade Permitidos</Label>
                  <Input
                    id="saml-allowed-idps"
                    value={samlConfig.allowedIdps}
                    onChange={(e) => setSamlConfig((prev) => ({ ...prev, allowedIdps: e.target.value }))}
                    placeholder="https://idp.exemplo.com/metadata"
                    className="border-blue-200"
                  />
                  <p className="text-xs text-gray-500">
                    Separe múltiplos IdPs com vírgulas. Deixe em branco para permitir qualquer IdP.
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200 space-y-4">
                  <h3 className="text-sm font-medium">Mapeamento de Atributos</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="saml-attr-email">Email</Label>
                      <Input
                        id="saml-attr-email"
                        value={samlConfig.attributeMapping.email}
                        onChange={(e) =>
                          setSamlConfig((prev) => ({
                            ...prev,
                            attributeMapping: { ...prev.attributeMapping, email: e.target.value },
                          }))
                        }
                        className="border-blue-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="saml-attr-firstname">Nome</Label>
                      <Input
                        id="saml-attr-firstname"
                        value={samlConfig.attributeMapping.firstName}
                        onChange={(e) =>
                          setSamlConfig((prev) => ({
                            ...prev,
                            attributeMapping: { ...prev.attributeMapping, firstName: e.target.value },
                          }))
                        }
                        className="border-blue-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="saml-attr-lastname">Sobrenome</Label>
                      <Input
                        id="saml-attr-lastname"
                        value={samlConfig.attributeMapping.lastName}
                        onChange={(e) =>
                          setSamlConfig((prev) => ({
                            ...prev,
                            attributeMapping: { ...prev.attributeMapping, lastName: e.target.value },
                          }))
                        }
                        className="border-blue-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="saml-attr-role">Função</Label>
                      <Input
                        id="saml-attr-role"
                        value={samlConfig.attributeMapping.role}
                        onChange={(e) =>
                          setSamlConfig((prev) => ({
                            ...prev,
                            attributeMapping: { ...prev.attributeMapping, role: e.target.value },
                          }))
                        }
                        className="border-blue-200"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="saml-auto-provision" className="font-medium">
                        Provisionamento Automático
                      </Label>
                      <p className="text-sm text-gray-500">Criar usuários automaticamente no primeiro login</p>
                    </div>
                    <Switch
                      id="saml-auto-provision"
                      checked={samlConfig.autoProvision}
                      onCheckedChange={(checked) => setSamlConfig((prev) => ({ ...prev, autoProvision: checked }))}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <Button variant="outline" className="w-full border-blue-200 text-blue-600">
                    <FileText className="h-4 w-4 mr-2" />
                    <span>Baixar Metadados SAML</span>
                  </Button>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-gray-200">
              <Button
                onClick={() => saveConfig("SAML 2.0")}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    <span>Salvar Configuração</span>
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function MicrosoftIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <rect x="3" y="3" width="8" height="8" rx="1" />
      <rect x="13" y="3" width="8" height="8" rx="1" />
      <rect x="3" y="13" width="8" height="8" rx="1" />
      <rect x="13" y="13" width="8" height="8" rx="1" />
    </svg>
  )
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  )
}
