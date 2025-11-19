"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Settings,
  Shield,
  Bell,
  Database,
  Mail,
  Globe,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Building2,
  Monitor,
  HardDrive,
  Network,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface SystemConfig {
  general: {
    companyName: string
    systemName: string
    timezone: string
    language: string
    dateFormat: string
    currency: string
    logo: string
  }
  security: {
    passwordPolicy: {
      minLength: number
      requireUppercase: boolean
      requireLowercase: boolean
      requireNumbers: boolean
      requireSpecialChars: boolean
      expirationDays: number
    }
    sessionTimeout: number
    maxLoginAttempts: number
    twoFactorAuth: boolean
    ipWhitelist: string[]
  }
  notifications: {
    email: {
      enabled: boolean
      smtpServer: string
      smtpPort: number
      username: string
      password: string
      fromAddress: string
      ssl: boolean
    }
    push: {
      enabled: boolean
      apiKey: string
    }
    sms: {
      enabled: boolean
      provider: string
      apiKey: string
    }
    alertLevels: {
      critical: boolean
      high: boolean
      medium: boolean
      low: boolean
    }
  }
  backup: {
    enabled: boolean
    frequency: string
    retention: number
    location: string
    encryption: boolean
    compression: boolean
  }
  monitoring: {
    dataRetention: number
    alertThresholds: {
      cpu: number
      memory: number
      disk: number
      network: number
    }
    checkInterval: number
  }
  integrations: {
    activeDirectory: {
      enabled: boolean
      server: string
      domain: string
      baseDN: string
    }
    slack: {
      enabled: boolean
      webhookUrl: string
      channel: string
    }
    teams: {
      enabled: boolean
      webhookUrl: string
    }
  }
}

export function SystemSettings() {
  const [config, setConfig] = useState<SystemConfig>({
    general: {
      companyName: "ET & WICCA",
      systemName: "Sistema de Gestão de TI",
      timezone: "America/Sao_Paulo",
      language: "pt-BR",
      dateFormat: "DD/MM/YYYY",
      currency: "BRL",
      logo: "",
    },
    security: {
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        expirationDays: 90,
      },
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      twoFactorAuth: false,
      ipWhitelist: [],
    },
    notifications: {
      email: {
        enabled: true,
        smtpServer: "smtp.gmail.com",
        smtpPort: 587,
        username: "",
        password: "",
        fromAddress: "noreply@etwicca.com",
        ssl: true,
      },
      push: {
        enabled: false,
        apiKey: "",
      },
      sms: {
        enabled: false,
        provider: "twilio",
        apiKey: "",
      },
      alertLevels: {
        critical: true,
        high: true,
        medium: true,
        low: false,
      },
    },
    backup: {
      enabled: true,
      frequency: "daily",
      retention: 30,
      location: "/backup",
      encryption: true,
      compression: true,
    },
    monitoring: {
      dataRetention: 90,
      alertThresholds: {
        cpu: 85,
        memory: 90,
        disk: 85,
        network: 80,
      },
      checkInterval: 5,
    },
    integrations: {
      activeDirectory: {
        enabled: false,
        server: "",
        domain: "",
        baseDN: "",
      },
      slack: {
        enabled: false,
        webhookUrl: "",
        channel: "#ti-alerts",
      },
      teams: {
        enabled: false,
        webhookUrl: "",
      },
    },
  })

  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  useEffect(() => {
    // Carregar configurações salvas
    const savedConfig = localStorage.getItem("et-wicca-system-config")
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig))
    }

    const lastSavedTime = localStorage.getItem("et-wicca-config-last-saved")
    if (lastSavedTime) {
      setLastSaved(new Date(lastSavedTime))
    }
  }, [])

  const saveConfig = async () => {
    setIsSaving(true)

    // Simular delay de salvamento
    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      localStorage.setItem("et-wicca-system-config", JSON.stringify(config))
      localStorage.setItem("et-wicca-config-last-saved", new Date().toISOString())
      setLastSaved(new Date())

      toast({
        title: "Configurações Salvas",
        description: "Todas as configurações foram salvas com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao Salvar",
        description: "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const resetToDefaults = () => {
    if (confirm("Tem certeza que deseja restaurar as configurações padrão? Esta ação não pode ser desfeita.")) {
      // Reset para configurações padrão
      setConfig({
        general: {
          companyName: "ET & WICCA",
          systemName: "Sistema de Gestão de TI",
          timezone: "America/Sao_Paulo",
          language: "pt-BR",
          dateFormat: "DD/MM/YYYY",
          currency: "BRL",
          logo: "",
        },
        security: {
          passwordPolicy: {
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: true,
            expirationDays: 90,
          },
          sessionTimeout: 30,
          maxLoginAttempts: 5,
          twoFactorAuth: false,
          ipWhitelist: [],
        },
        notifications: {
          email: {
            enabled: true,
            smtpServer: "smtp.gmail.com",
            smtpPort: 587,
            username: "",
            password: "",
            fromAddress: "noreply@etwicca.com",
            ssl: true,
          },
          push: {
            enabled: false,
            apiKey: "",
          },
          sms: {
            enabled: false,
            provider: "twilio",
            apiKey: "",
          },
          alertLevels: {
            critical: true,
            high: true,
            medium: true,
            low: false,
          },
        },
        backup: {
          enabled: true,
          frequency: "daily",
          retention: 30,
          location: "/backup",
          encryption: true,
          compression: true,
        },
        monitoring: {
          dataRetention: 90,
          alertThresholds: {
            cpu: 85,
            memory: 90,
            disk: 85,
            network: 80,
          },
          checkInterval: 5,
        },
        integrations: {
          activeDirectory: {
            enabled: false,
            server: "",
            domain: "",
            baseDN: "",
          },
          slack: {
            enabled: false,
            webhookUrl: "",
            channel: "#ti-alerts",
          },
          teams: {
            enabled: false,
            webhookUrl: "",
          },
        },
      })

      toast({
        title: "Configurações Restauradas",
        description: "As configurações padrão foram restauradas.",
      })
    }
  }

  const testEmailConfig = async () => {
    toast({
      title: "Testando Configuração",
      description: "Enviando email de teste...",
    })

    // Simular teste de email
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Teste Concluído",
      description: "Email de teste enviado com sucesso!",
    })
  }

  const testBackup = async () => {
    toast({
      title: "Iniciando Backup de Teste",
      description: "Executando backup manual...",
    })

    // Simular backup
    await new Promise((resolve) => setTimeout(resolve, 3000))

    toast({
      title: "Backup Concluído",
      description: "Backup de teste executado com sucesso!",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-blue-800">Configurações do Sistema - ET & WICCA</CardTitle>
                <CardDescription>
                  Configure parâmetros gerais, segurança, notificações e integrações do sistema
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetToDefaults} className="border-blue-200 text-blue-600">
                <RefreshCw className="h-4 w-4 mr-2" />
                Restaurar Padrão
              </Button>
              <Button onClick={saveConfig} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
                {isSaving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Salvar Configurações
              </Button>
            </div>
          </div>
          {lastSaved && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <CheckCircle className="h-4 w-4" />
              Última atualização: {lastSaved.toLocaleString()}
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Configurações */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Backup
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Monitoramento
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Integrações
          </TabsTrigger>
        </TabsList>

        {/* Configurações Gerais */}
        <TabsContent value="general">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Configurações Gerais</CardTitle>
              <CardDescription>Configurações básicas da empresa e sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nome da Empresa</Label>
                  <Input
                    id="companyName"
                    value={config.general.companyName}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        general: { ...prev.general, companyName: e.target.value },
                      }))
                    }
                    className="border-blue-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="systemName">Nome do Sistema</Label>
                  <Input
                    id="systemName"
                    value={config.general.systemName}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        general: { ...prev.general, systemName: e.target.value },
                      }))
                    }
                    className="border-blue-200"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select
                    value={config.general.timezone}
                    onValueChange={(value) =>
                      setConfig((prev) => ({
                        ...prev,
                        general: { ...prev.general, timezone: value },
                      }))
                    }
                  >
                    <SelectTrigger className="border-blue-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">São Paulo (UTC-3)</SelectItem>
                      <SelectItem value="America/New_York">Nova York (UTC-5)</SelectItem>
                      <SelectItem value="Europe/London">Londres (UTC+0)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tóquio (UTC+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select
                    value={config.general.language}
                    onValueChange={(value) =>
                      setConfig((prev) => ({
                        ...prev,
                        general: { ...prev.general, language: value },
                      }))
                    }
                  >
                    <SelectTrigger className="border-blue-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Moeda</Label>
                  <Select
                    value={config.general.currency}
                    onValueChange={(value) =>
                      setConfig((prev) => ({
                        ...prev,
                        general: { ...prev.general, currency: value },
                      }))
                    }
                  >
                    <SelectTrigger className="border-blue-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">Real (R$)</SelectItem>
                      <SelectItem value="USD">Dólar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFormat">Formato de Data</Label>
                <Select
                  value={config.general.dateFormat}
                  onValueChange={(value) =>
                    setConfig((prev) => ({
                      ...prev,
                      general: { ...prev.general, dateFormat: value },
                    }))
                  }
                >
                  <SelectTrigger className="border-blue-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">DD/MM/AAAA</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/AAAA</SelectItem>
                    <SelectItem value="YYYY-MM-DD">AAAA-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Segurança */}
        <TabsContent value="security">
          <div className="space-y-6">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Política de Senhas</CardTitle>
                <CardDescription>Configure os requisitos de segurança para senhas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="minLength">Comprimento Mínimo</Label>
                    <Input
                      id="minLength"
                      type="number"
                      min="6"
                      max="20"
                      value={config.security.passwordPolicy.minLength}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          security: {
                            ...prev.security,
                            passwordPolicy: {
                              ...prev.security.passwordPolicy,
                              minLength: Number.parseInt(e.target.value),
                            },
                          },
                        }))
                      }
                      className="border-blue-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expirationDays">Expiração (dias)</Label>
                    <Input
                      id="expirationDays"
                      type="number"
                      min="30"
                      max="365"
                      value={config.security.passwordPolicy.expirationDays}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          security: {
                            ...prev.security,
                            passwordPolicy: {
                              ...prev.security.passwordPolicy,
                              expirationDays: Number.parseInt(e.target.value),
                            },
                          },
                        }))
                      }
                      className="border-blue-200"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireUppercase">Exigir Maiúsculas</Label>
                    <Switch
                      id="requireUppercase"
                      checked={config.security.passwordPolicy.requireUppercase}
                      onCheckedChange={(checked) =>
                        setConfig((prev) => ({
                          ...prev,
                          security: {
                            ...prev.security,
                            passwordPolicy: {
                              ...prev.security.passwordPolicy,
                              requireUppercase: checked,
                            },
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireNumbers">Exigir Números</Label>
                    <Switch
                      id="requireNumbers"
                      checked={config.security.passwordPolicy.requireNumbers}
                      onCheckedChange={(checked) =>
                        setConfig((prev) => ({
                          ...prev,
                          security: {
                            ...prev.security,
                            passwordPolicy: {
                              ...prev.security.passwordPolicy,
                              requireNumbers: checked,
                            },
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireSpecialChars">Exigir Caracteres Especiais</Label>
                    <Switch
                      id="requireSpecialChars"
                      checked={config.security.passwordPolicy.requireSpecialChars}
                      onCheckedChange={(checked) =>
                        setConfig((prev) => ({
                          ...prev,
                          security: {
                            ...prev.security,
                            passwordPolicy: {
                              ...prev.security.passwordPolicy,
                              requireSpecialChars: checked,
                            },
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Configurações de Acesso</CardTitle>
                <CardDescription>Configure timeout de sessão e tentativas de login</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Timeout de Sessão (minutos)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      min="5"
                      max="480"
                      value={config.security.sessionTimeout}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          security: { ...prev.security, sessionTimeout: Number.parseInt(e.target.value) },
                        }))
                      }
                      className="border-blue-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts">Máximo de Tentativas de Login</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      min="3"
                      max="10"
                      value={config.security.maxLoginAttempts}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          security: { ...prev.security, maxLoginAttempts: Number.parseInt(e.target.value) },
                        }))
                      }
                      className="border-blue-200"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactorAuth">Autenticação de Dois Fatores</Label>
                    <p className="text-sm text-gray-600">Exigir 2FA para todos os usuários</p>
                  </div>
                  <Switch
                    id="twoFactorAuth"
                    checked={config.security.twoFactorAuth}
                    onCheckedChange={(checked) =>
                      setConfig((prev) => ({
                        ...prev,
                        security: { ...prev.security, twoFactorAuth: checked },
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Configurações de Notificações */}
        <TabsContent value="notifications">
          <div className="space-y-6">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Configurações de Email</CardTitle>
                <CardDescription>Configure o servidor SMTP para envio de emails</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Label htmlFor="emailEnabled">Habilitar Notificações por Email</Label>
                    <p className="text-sm text-gray-600">Ativar envio de alertas por email</p>
                  </div>
                  <Switch
                    id="emailEnabled"
                    checked={config.notifications.email.enabled}
                    onCheckedChange={(checked) =>
                      setConfig((prev) => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          email: { ...prev.notifications.email, enabled: checked },
                        },
                      }))
                    }
                  />
                </div>

                {config.notifications.email.enabled && (
                  <>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="smtpServer">Servidor SMTP</Label>
                        <Input
                          id="smtpServer"
                          value={config.notifications.email.smtpServer}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                email: { ...prev.notifications.email, smtpServer: e.target.value },
                              },
                            }))
                          }
                          className="border-blue-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtpPort">Porta SMTP</Label>
                        <Input
                          id="smtpPort"
                          type="number"
                          value={config.notifications.email.smtpPort}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                email: { ...prev.notifications.email, smtpPort: Number.parseInt(e.target.value) },
                              },
                            }))
                          }
                          className="border-blue-200"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="emailUsername">Usuário</Label>
                        <Input
                          id="emailUsername"
                          value={config.notifications.email.username}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                email: { ...prev.notifications.email, username: e.target.value },
                              },
                            }))
                          }
                          className="border-blue-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emailPassword">Senha</Label>
                        <Input
                          id="emailPassword"
                          type="password"
                          value={config.notifications.email.password}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                email: { ...prev.notifications.email, password: e.target.value },
                              },
                            }))
                          }
                          className="border-blue-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fromAddress">Endereço de Envio</Label>
                      <Input
                        id="fromAddress"
                        type="email"
                        value={config.notifications.email.fromAddress}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            notifications: {
                              ...prev.notifications,
                              email: { ...prev.notifications.email, fromAddress: e.target.value },
                            },
                          }))
                        }
                        className="border-blue-200"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="emailSSL">Usar SSL/TLS</Label>
                      <Switch
                        id="emailSSL"
                        checked={config.notifications.email.ssl}
                        onCheckedChange={(checked) =>
                          setConfig((prev) => ({
                            ...prev,
                            notifications: {
                              ...prev.notifications,
                              email: { ...prev.notifications.email, ssl: checked },
                            },
                          }))
                        }
                      />
                    </div>

                    <Button onClick={testEmailConfig} variant="outline" className="border-blue-200 text-blue-600">
                      <Mail className="h-4 w-4 mr-2" />
                      Testar Configuração
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Níveis de Alerta</CardTitle>
                <CardDescription>Configure quais tipos de alertas devem gerar notificações</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <Label>Crítico</Label>
                    </div>
                    <Switch
                      checked={config.notifications.alertLevels.critical}
                      onCheckedChange={(checked) =>
                        setConfig((prev) => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            alertLevels: { ...prev.notifications.alertLevels, critical: checked },
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <Label>Alto</Label>
                    </div>
                    <Switch
                      checked={config.notifications.alertLevels.high}
                      onCheckedChange={(checked) =>
                        setConfig((prev) => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            alertLevels: { ...prev.notifications.alertLevels, high: checked },
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <Label>Médio</Label>
                    </div>
                    <Switch
                      checked={config.notifications.alertLevels.medium}
                      onCheckedChange={(checked) =>
                        setConfig((prev) => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            alertLevels: { ...prev.notifications.alertLevels, medium: checked },
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-blue-500" />
                      <Label>Baixo</Label>
                    </div>
                    <Switch
                      checked={config.notifications.alertLevels.low}
                      onCheckedChange={(checked) =>
                        setConfig((prev) => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            alertLevels: { ...prev.notifications.alertLevels, low: checked },
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Configurações de Backup */}
        <TabsContent value="backup">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Configurações de Backup</CardTitle>
              <CardDescription>Configure backup automático e retenção de dados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="backupEnabled">Habilitar Backup Automático</Label>
                  <p className="text-sm text-gray-600">Executar backups automaticamente</p>
                </div>
                <Switch
                  id="backupEnabled"
                  checked={config.backup.enabled}
                  onCheckedChange={(checked) =>
                    setConfig((prev) => ({
                      ...prev,
                      backup: { ...prev.backup, enabled: checked },
                    }))
                  }
                />
              </div>

              {config.backup.enabled && (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="backupFrequency">Frequência</Label>
                      <Select
                        value={config.backup.frequency}
                        onValueChange={(value) =>
                          setConfig((prev) => ({
                            ...prev,
                            backup: { ...prev.backup, frequency: value },
                          }))
                        }
                      >
                        <SelectTrigger className="border-blue-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">A cada hora</SelectItem>
                          <SelectItem value="daily">Diário</SelectItem>
                          <SelectItem value="weekly">Semanal</SelectItem>
                          <SelectItem value="monthly">Mensal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="retention">Retenção (dias)</Label>
                      <Input
                        id="retention"
                        type="number"
                        min="7"
                        max="365"
                        value={config.backup.retention}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            backup: { ...prev.backup, retention: Number.parseInt(e.target.value) },
                          }))
                        }
                        className="border-blue-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backupLocation">Local de Armazenamento</Label>
                    <Input
                      id="backupLocation"
                      value={config.backup.location}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          backup: { ...prev.backup, location: e.target.value },
                        }))
                      }
                      className="border-blue-200"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="backupEncryption">Criptografia</Label>
                      <Switch
                        id="backupEncryption"
                        checked={config.backup.encryption}
                        onCheckedChange={(checked) =>
                          setConfig((prev) => ({
                            ...prev,
                            backup: { ...prev.backup, encryption: checked },
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="backupCompression">Compressão</Label>
                      <Switch
                        id="backupCompression"
                        checked={config.backup.compression}
                        onCheckedChange={(checked) =>
                          setConfig((prev) => ({
                            ...prev,
                            backup: { ...prev.backup, compression: checked },
                          }))
                        }
                      />
                    </div>
                  </div>

                  <Button onClick={testBackup} variant="outline" className="border-blue-200 text-blue-600">
                    <Database className="h-4 w-4 mr-2" />
                    Executar Backup de Teste
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Monitoramento */}
        <TabsContent value="monitoring">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Configurações de Monitoramento</CardTitle>
              <CardDescription>Configure thresholds de alerta e retenção de dados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dataRetention">Retenção de Dados (dias)</Label>
                  <Input
                    id="dataRetention"
                    type="number"
                    min="30"
                    max="365"
                    value={config.monitoring.dataRetention}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        monitoring: { ...prev.monitoring, dataRetention: Number.parseInt(e.target.value) },
                      }))
                    }
                    className="border-blue-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkInterval">Intervalo de Verificação (minutos)</Label>
                  <Input
                    id="checkInterval"
                    type="number"
                    min="1"
                    max="60"
                    value={config.monitoring.checkInterval}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        monitoring: { ...prev.monitoring, checkInterval: Number.parseInt(e.target.value) },
                      }))
                    }
                    className="border-blue-200"
                  />
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-lg font-medium text-blue-800 mb-4">Thresholds de Alerta (%)</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="cpuThreshold" className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4" />
                      CPU
                    </Label>
                    <Input
                      id="cpuThreshold"
                      type="number"
                      min="50"
                      max="95"
                      value={config.monitoring.alertThresholds.cpu}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          monitoring: {
                            ...prev.monitoring,
                            alertThresholds: {
                              ...prev.monitoring.alertThresholds,
                              cpu: Number.parseInt(e.target.value),
                            },
                          },
                        }))
                      }
                      className="border-blue-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="memoryThreshold" className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4" />
                      Memória
                    </Label>
                    <Input
                      id="memoryThreshold"
                      type="number"
                      min="50"
                      max="95"
                      value={config.monitoring.alertThresholds.memory}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          monitoring: {
                            ...prev.monitoring,
                            alertThresholds: {
                              ...prev.monitoring.alertThresholds,
                              memory: Number.parseInt(e.target.value),
                            },
                          },
                        }))
                      }
                      className="border-blue-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="diskThreshold" className="flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      Disco
                    </Label>
                    <Input
                      id="diskThreshold"
                      type="number"
                      min="50"
                      max="95"
                      value={config.monitoring.alertThresholds.disk}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          monitoring: {
                            ...prev.monitoring,
                            alertThresholds: {
                              ...prev.monitoring.alertThresholds,
                              disk: Number.parseInt(e.target.value),
                            },
                          },
                        }))
                      }
                      className="border-blue-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="networkThreshold" className="flex items-center gap-2">
                      <Network className="h-4 w-4" />
                      Rede
                    </Label>
                    <Input
                      id="networkThreshold"
                      type="number"
                      min="50"
                      max="95"
                      value={config.monitoring.alertThresholds.network}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          monitoring: {
                            ...prev.monitoring,
                            alertThresholds: {
                              ...prev.monitoring.alertThresholds,
                              network: Number.parseInt(e.target.value),
                            },
                          },
                        }))
                      }
                      className="border-blue-200"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Integrações */}
        <TabsContent value="integrations">
          <div className="space-y-6">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Active Directory</CardTitle>
                <CardDescription>Integração com Active Directory para autenticação</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="adEnabled">Habilitar Integração AD</Label>
                    <p className="text-sm text-gray-600">Usar Active Directory para autenticação</p>
                  </div>
                  <Switch
                    id="adEnabled"
                    checked={config.integrations.activeDirectory.enabled}
                    onCheckedChange={(checked) =>
                      setConfig((prev) => ({
                        ...prev,
                        integrations: {
                          ...prev.integrations,
                          activeDirectory: { ...prev.integrations.activeDirectory, enabled: checked },
                        },
                      }))
                    }
                  />
                </div>

                {config.integrations.activeDirectory.enabled && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="adServer">Servidor AD</Label>
                      <Input
                        id="adServer"
                        value={config.integrations.activeDirectory.server}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            integrations: {
                              ...prev.integrations,
                              activeDirectory: { ...prev.integrations.activeDirectory, server: e.target.value },
                            },
                          }))
                        }
                        className="border-blue-200"
                        placeholder="ldap://servidor.empresa.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adDomain">Domínio</Label>
                      <Input
                        id="adDomain"
                        value={config.integrations.activeDirectory.domain}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            integrations: {
                              ...prev.integrations,
                              activeDirectory: { ...prev.integrations.activeDirectory, domain: e.target.value },
                            },
                          }))
                        }
                        className="border-blue-200"
                        placeholder="empresa.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adBaseDN">Base DN</Label>
                      <Input
                        id="adBaseDN"
                        value={config.integrations.activeDirectory.baseDN}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            integrations: {
                              ...prev.integrations,
                              activeDirectory: { ...prev.integrations.activeDirectory, baseDN: e.target.value },
                            },
                          }))
                        }
                        className="border-blue-200"
                        placeholder="DC=empresa,DC=com"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Slack</CardTitle>
                <CardDescription>Enviar notificações para o Slack</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="slackEnabled">Habilitar Slack</Label>
                    <p className="text-sm text-gray-600">Enviar alertas para o Slack</p>
                  </div>
                  <Switch
                    id="slackEnabled"
                    checked={config.integrations.slack.enabled}
                    onCheckedChange={(checked) =>
                      setConfig((prev) => ({
                        ...prev,
                        integrations: {
                          ...prev.integrations,
                          slack: { ...prev.integrations.slack, enabled: checked },
                        },
                      }))
                    }
                  />
                </div>

                {config.integrations.slack.enabled && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="slackWebhook">Webhook URL</Label>
                      <Input
                        id="slackWebhook"
                        value={config.integrations.slack.webhookUrl}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            integrations: {
                              ...prev.integrations,
                              slack: { ...prev.integrations.slack, webhookUrl: e.target.value },
                            },
                          }))
                        }
                        className="border-blue-200"
                        placeholder="https://hooks.slack.com/services/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slackChannel">Canal</Label>
                      <Input
                        id="slackChannel"
                        value={config.integrations.slack.channel}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            integrations: {
                              ...prev.integrations,
                              slack: { ...prev.integrations.slack, channel: e.target.value },
                            },
                          }))
                        }
                        className="border-blue-200"
                        placeholder="#ti-alerts"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Microsoft Teams</CardTitle>
                <CardDescription>Enviar notificações para o Microsoft Teams</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="teamsEnabled">Habilitar Teams</Label>
                    <p className="text-sm text-gray-600">Enviar alertas para o Teams</p>
                  </div>
                  <Switch
                    id="teamsEnabled"
                    checked={config.integrations.teams.enabled}
                    onCheckedChange={(checked) =>
                      setConfig((prev) => ({
                        ...prev,
                        integrations: {
                          ...prev.integrations,
                          teams: { ...prev.integrations.teams, enabled: checked },
                        },
                      }))
                    }
                  />
                </div>

                {config.integrations.teams.enabled && (
                  <div className="space-y-2">
                    <Label htmlFor="teamsWebhook">Webhook URL</Label>
                    <Input
                      id="teamsWebhook"
                      value={config.integrations.teams.webhookUrl}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          integrations: {
                            ...prev.integrations,
                            teams: { ...prev.integrations.teams, webhookUrl: e.target.value },
                          },
                        }))
                      }
                      className="border-blue-200"
                      placeholder="https://outlook.office.com/webhook/..."
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Status das Configurações */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Status das Configurações</CardTitle>
          <CardDescription>Resumo do estado atual das configurações do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <p className="font-medium text-blue-800">Segurança</p>
                <p className="text-sm text-blue-600">{config.security.twoFactorAuth ? "2FA Ativo" : "2FA Inativo"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <Bell className="h-8 w-8 text-blue-600" />
              <div>
                <p className="font-medium text-blue-800">Notificações</p>
                <p className="text-sm text-blue-600">
                  {config.notifications.email.enabled ? "Email Ativo" : "Email Inativo"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <Database className="h-8 w-8 text-blue-600" />
              <div>
                <p className="font-medium text-blue-800">Backup</p>
                <p className="text-sm text-blue-600">
                  {config.backup.enabled ? config.backup.frequency : "Desabilitado"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <Globe className="h-8 w-8 text-blue-600" />
              <div>
                <p className="font-medium text-blue-800">Integrações</p>
                <p className="text-sm text-blue-600">
                  {Object.values(config.integrations).filter((integration) => integration.enabled).length} Ativas
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
