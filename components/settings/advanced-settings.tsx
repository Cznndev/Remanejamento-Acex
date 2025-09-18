"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  Palette,
  Bell,
  Shield,
  Zap,
  Download,
  Upload,
  Trash2,
  Save,
  RefreshCw,
  Smartphone,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AdvancedThemeService } from "@/lib/theme/advanced-theme-service"
import { PWAService } from "@/lib/pwa/pwa-service"
import { OfflineService } from "@/lib/offline/offline-service"
import { CacheService } from "@/lib/cache/cache-service"

export function AdvancedSettings() {
  const [configuracoes, setConfiguracoes] = useState({
    sistema: {
      autoSave: true,
      notificacoes: true,
      modoOffline: true,
      sincronizacaoAuto: true,
      tempoCache: 300, // 5 minutos
      maxTentativasSync: 3,
    },
    interface: {
      tema: "default",
      idioma: "pt-BR",
      densidade: "normal",
      animacoes: true,
      sons: false,
    },
    notificacoes: {
      email: true,
      push: true,
      desktop: false,
      aprovacoes: true,
      remanejamentos: true,
      conflitos: true,
    },
    seguranca: {
      sessaoTimeout: 30, // minutos
      logAuditoria: true,
      backupAuto: true,
      criptografia: true,
    },
    avancado: {
      debugMode: false,
      logLevel: "info",
      maxLogSize: 100, // MB
      experimentalFeatures: false,
    },
  })

  const [offlineStatus, setOfflineStatus] = useState<any>(null)
  const [cacheStats, setCacheStats] = useState<any>(null)
  const [temas, setTemas] = useState<any[]>([])

  const { toast } = useToast()
  const themeService = AdvancedThemeService.getInstance()
  const pwaService = PWAService.getInstance()
  const offlineService = OfflineService.getInstance()
  const cacheService = CacheService.getInstance()

  useEffect(() => {
    carregarConfiguracoes()
    carregarStatus()
    carregarTemas()
  }, [])

  const carregarConfiguracoes = () => {
    const stored = localStorage.getItem("advanced_settings")
    if (stored) {
      setConfiguracoes({ ...configuracoes, ...JSON.parse(stored) })
    }
  }

  const carregarStatus = () => {
    setOfflineStatus(offlineService.getOfflineStatus())
    setCacheStats(cacheService.getStats())
  }

  const carregarTemas = () => {
    setTemas(themeService.getAllThemes())
  }

  const salvarConfiguracoes = () => {
    localStorage.setItem("advanced_settings", JSON.stringify(configuracoes))
    toast({
      title: "✅ Configurações Salvas",
      description: "Suas configurações foram salvas com sucesso.",
    })
  }

  const resetarConfiguracoes = () => {
    localStorage.removeItem("advanced_settings")
    window.location.reload()
  }

  const exportarConfiguracoes = () => {
    const dataStr = JSON.stringify(configuracoes, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = `configuracoes-${new Date().toISOString().split("T")[0]}.json`
    link.click()

    URL.revokeObjectURL(url)
  }

  const importarConfiguracoes = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedConfig = JSON.parse(e.target?.result as string)
        setConfiguracoes({ ...configuracoes, ...importedConfig })
        toast({
          title: "✅ Configurações Importadas",
          description: "Configurações importadas com sucesso. Clique em Salvar para aplicar.",
        })
      } catch (error) {
        toast({
          title: "❌ Erro na Importação",
          description: "Arquivo de configuração inválido.",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  const limparCache = () => {
    cacheService.clear()
    carregarStatus()
    toast({
      title: "🗑️ Cache Limpo",
      description: "Cache do sistema foi limpo com sucesso.",
    })
  }

  const instalarPWA = async () => {
    const success = await pwaService.promptInstall()
    if (success) {
      toast({
        title: "📱 App Instalado",
        description: "O aplicativo foi instalado com sucesso!",
      })
    }
  }

  const updateConfig = (section: string, key: string, value: any) => {
    setConfiguracoes((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value,
      },
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">⚙️ Configurações Avançadas</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Personalize e configure o sistema conforme suas necessidades
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportarConfiguracoes}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline" onClick={() => document.getElementById("import-config")?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Importar
          </Button>
          <input id="import-config" type="file" accept=".json" className="hidden" onChange={importarConfiguracoes} />
          <Button onClick={salvarConfiguracoes}>
            <Save className="mr-2 h-4 w-4" />
            Salvar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="sistema" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="sistema">🔧 Sistema</TabsTrigger>
          <TabsTrigger value="interface">🎨 Interface</TabsTrigger>
          <TabsTrigger value="notificacoes">🔔 Notificações</TabsTrigger>
          <TabsTrigger value="seguranca">🔒 Segurança</TabsTrigger>
          <TabsTrigger value="pwa">📱 PWA</TabsTrigger>
          <TabsTrigger value="avancado">⚡ Avançado</TabsTrigger>
        </TabsList>

        <TabsContent value="sistema" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações do Sistema
              </CardTitle>
              <CardDescription>Configurações gerais de funcionamento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Auto-salvamento</Label>
                  <p className="text-sm text-muted-foreground">Salvar automaticamente as alterações</p>
                </div>
                <Switch
                  checked={configuracoes.sistema.autoSave}
                  onCheckedChange={(checked) => updateConfig("sistema", "autoSave", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Sincronização Automática</Label>
                  <p className="text-sm text-muted-foreground">Sincronizar dados automaticamente</p>
                </div>
                <Switch
                  checked={configuracoes.sistema.sincronizacaoAuto}
                  onCheckedChange={(checked) => updateConfig("sistema", "sincronizacaoAuto", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Tempo de Cache (segundos)</Label>
                <Input
                  type="number"
                  value={configuracoes.sistema.tempoCache}
                  onChange={(e) => updateConfig("sistema", "tempoCache", Number.parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label>Máximo de Tentativas de Sincronização</Label>
                <Input
                  type="number"
                  value={configuracoes.sistema.maxTentativasSync}
                  onChange={(e) => updateConfig("sistema", "maxTentativasSync", Number.parseInt(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Status do Sistema */}
          <Card>
            <CardHeader>
              <CardTitle>Status do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="font-medium">Cache</Label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Itens em cache:</span>
                    <Badge variant="outline">{cacheStats?.size || 0}</Badge>
                  </div>
                  <Button variant="outline" size="sm" onClick={limparCache}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Limpar Cache
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">Offline</Label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status:</span>
                    <Badge variant={offlineStatus?.isOnline ? "default" : "destructive"}>
                      {offlineStatus?.isOnline ? "Online" : "Offline"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Ações pendentes:</span>
                    <Badge variant="outline">{offlineStatus?.pendingActions || 0}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interface" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Personalização da Interface
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Tema</Label>
                <Select
                  value={configuracoes.interface.tema}
                  onValueChange={(value) => updateConfig("interface", "tema", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {temas.map((tema) => (
                      <SelectItem key={tema.id} value={tema.id}>
                        {tema.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Idioma</Label>
                <Select
                  value={configuracoes.interface.idioma}
                  onValueChange={(value) => updateConfig("interface", "idioma", value)}
                >
                  <SelectTrigger>
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
                <Label>Densidade da Interface</Label>
                <Select
                  value={configuracoes.interface.densidade}
                  onValueChange={(value) => updateConfig("interface", "densidade", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compacta">Compacta</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="confortavel">Confortável</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Animações</Label>
                  <p className="text-sm text-muted-foreground">Habilitar animações da interface</p>
                </div>
                <Switch
                  checked={configuracoes.interface.animacoes}
                  onCheckedChange={(checked) => updateConfig("interface", "animacoes", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Sons do Sistema</Label>
                  <p className="text-sm text-muted-foreground">Reproduzir sons para notificações</p>
                </div>
                <Switch
                  checked={configuracoes.interface.sons}
                  onCheckedChange={(checked) => updateConfig("interface", "sons", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificacoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Configurações de Notificações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Notificações por Email</Label>
                  <p className="text-sm text-muted-foreground">Receber notificações por email</p>
                </div>
                <Switch
                  checked={configuracoes.notificacoes.email}
                  onCheckedChange={(checked) => updateConfig("notificacoes", "email", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Notificações Push</Label>
                  <p className="text-sm text-muted-foreground">Receber notificações push no navegador</p>
                </div>
                <Switch
                  checked={configuracoes.notificacoes.push}
                  onCheckedChange={(checked) => updateConfig("notificacoes", "push", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Notificações Desktop</Label>
                  <p className="text-sm text-muted-foreground">Mostrar notificações na área de trabalho</p>
                </div>
                <Switch
                  checked={configuracoes.notificacoes.desktop}
                  onCheckedChange={(checked) => updateConfig("notificacoes", "desktop", checked)}
                />
              </div>

              <div className="space-y-4">
                <Label className="text-base font-medium">Tipos de Notificação</Label>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Aprovações</span>
                  <Switch
                    checked={configuracoes.notificacoes.aprovacoes}
                    onCheckedChange={(checked) => updateConfig("notificacoes", "aprovacoes", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Remanejamentos</span>
                  <Switch
                    checked={configuracoes.notificacoes.remanejamentos}
                    onCheckedChange={(checked) => updateConfig("notificacoes", "remanejamentos", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Conflitos</span>
                  <Switch
                    checked={configuracoes.notificacoes.conflitos}
                    onCheckedChange={(checked) => updateConfig("notificacoes", "conflitos", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguranca" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Configurações de Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Timeout da Sessão (minutos)</Label>
                <Input
                  type="number"
                  value={configuracoes.seguranca.sessaoTimeout}
                  onChange={(e) => updateConfig("seguranca", "sessaoTimeout", Number.parseInt(e.target.value))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Log de Auditoria</Label>
                  <p className="text-sm text-muted-foreground">Registrar todas as ações do sistema</p>
                </div>
                <Switch
                  checked={configuracoes.seguranca.logAuditoria}
                  onCheckedChange={(checked) => updateConfig("seguranca", "logAuditoria", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Backup Automático</Label>
                  <p className="text-sm text-muted-foreground">Fazer backup automático dos dados</p>
                </div>
                <Switch
                  checked={configuracoes.seguranca.backupAuto}
                  onCheckedChange={(checked) => updateConfig("seguranca", "backupAuto", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Criptografia</Label>
                  <p className="text-sm text-muted-foreground">Criptografar dados sensíveis</p>
                </div>
                <Switch
                  checked={configuracoes.seguranca.criptografia}
                  onCheckedChange={(checked) => updateConfig("seguranca", "criptografia", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pwa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Progressive Web App
              </CardTitle>
              <CardDescription>Configurações para uso como aplicativo móvel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-6">
                <Smartphone className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Instalar como App</h3>
                <p className="text-muted-foreground mb-4">
                  Instale o sistema como um aplicativo para acesso rápido e offline
                </p>
                {pwaService.isInstallable() ? (
                  <Button onClick={instalarPWA}>
                    <Download className="mr-2 h-4 w-4" />
                    Instalar App
                  </Button>
                ) : (
                  <Badge variant="outline">App já instalado ou não disponível</Badge>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">✨ Recursos PWA</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Funciona offline</li>
                    <li>• Notificações push</li>
                    <li>• Instalação nativa</li>
                    <li>• Sincronização automática</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">📱 Compatibilidade</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Chrome/Edge: ✅</li>
                    <li>• Firefox: ✅</li>
                    <li>• Safari: ⚠️ Limitado</li>
                    <li>• Mobile: ✅</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="avancado" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Configurações Avançadas
              </CardTitle>
              <CardDescription>Configurações para desenvolvedores e usuários avançados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Modo Debug</Label>
                  <p className="text-sm text-muted-foreground">Habilitar logs detalhados para depuração</p>
                </div>
                <Switch
                  checked={configuracoes.avancado.debugMode}
                  onCheckedChange={(checked) => updateConfig("avancado", "debugMode", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Nível de Log</Label>
                <Select
                  value={configuracoes.avancado.logLevel}
                  onValueChange={(value) => updateConfig("avancado", "logLevel", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="warn">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="debug">Debug</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tamanho Máximo do Log (MB)</Label>
                <Input
                  type="number"
                  value={configuracoes.avancado.maxLogSize}
                  onChange={(e) => updateConfig("avancado", "maxLogSize", Number.parseInt(e.target.value))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Recursos Experimentais</Label>
                  <p className="text-sm text-muted-foreground">Habilitar funcionalidades em desenvolvimento</p>
                </div>
                <Switch
                  checked={configuracoes.avancado.experimentalFeatures}
                  onCheckedChange={(checked) => updateConfig("avancado", "experimentalFeatures", checked)}
                />
              </div>

              <div className="pt-4 border-t">
                <div className="flex gap-2">
                  <Button variant="destructive" onClick={resetarConfiguracoes}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resetar Tudo
                  </Button>
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Recarregar Sistema
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
