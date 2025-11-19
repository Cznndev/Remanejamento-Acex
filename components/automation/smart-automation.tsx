"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Bot, Play, Pause, Settings, CheckCircle, Clock, RefreshCw, Shield, HardDrive, Network } from "lucide-react"

interface AutomationRule {
  id: string
  name: string
  description: string
  trigger: string
  action: string
  isActive: boolean
  lastRun: string
  executions: number
  category: "maintenance" | "security" | "backup" | "monitoring"
}

export function SmartAutomation() {
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: "1",
      name: "Backup Automático",
      description: "Executa backup completo dos bancos de dados críticos",
      trigger: "Diariamente às 02:00",
      action: "Backup completo + verificação de integridade",
      isActive: true,
      lastRun: "2024-01-15 02:00",
      executions: 45,
      category: "backup",
    },
    {
      id: "2",
      name: "Limpeza de Logs",
      description: "Remove logs antigos para liberar espaço em disco",
      trigger: "Semanalmente aos domingos",
      action: "Arquivar logs > 30 dias",
      isActive: true,
      lastRun: "2024-01-14 03:00",
      executions: 12,
      category: "maintenance",
    },
    {
      id: "3",
      name: "Monitoramento de Segurança",
      description: "Verifica tentativas de acesso suspeitas",
      trigger: "Continuamente",
      action: "Bloquear IPs suspeitos + alertar admin",
      isActive: true,
      lastRun: "2024-01-15 14:30",
      executions: 156,
      category: "security",
    },
    {
      id: "4",
      name: "Otimização de Performance",
      description: "Otimiza bancos de dados e limpa cache",
      trigger: "CPU > 80% por 10 min",
      action: "Otimizar queries + limpar cache",
      isActive: false,
      lastRun: "2024-01-10 16:45",
      executions: 8,
      category: "monitoring",
    },
  ])

  const toggleRule = (id: string) => {
    setRules(rules.map((rule) => (rule.id === id ? { ...rule, isActive: !rule.isActive } : rule)))
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "backup":
        return <HardDrive className="h-4 w-4" />
      case "maintenance":
        return <Settings className="h-4 w-4" />
      case "security":
        return <Shield className="h-4 w-4" />
      case "monitoring":
        return <Network className="h-4 w-4" />
      default:
        return <Bot className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "backup":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "maintenance":
        return "bg-green-50 text-green-700 border-green-200"
      case "security":
        return "bg-red-50 text-red-700 border-red-200"
      case "monitoring":
        return "bg-purple-50 text-purple-700 border-purple-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <CardTitle>Automação Inteligente</CardTitle>
            </div>
            <Button>
              <Play className="mr-2 h-4 w-4" />
              Nova Regra
            </Button>
          </div>
          <CardDescription>Configure regras de automação para manutenção preventiva e otimização</CardDescription>
        </CardHeader>
      </Card>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Regras Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rules.filter((r) => r.isActive).length}</div>
            <p className="text-xs text-muted-foreground">de {rules.length} regras totais</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Execuções Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">+12% vs ontem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Taxa de Sucesso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Tempo Economizado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24h</div>
            <p className="text-xs text-muted-foreground">Esta semana</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Regras */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Regras de Automação</CardTitle>
          <CardDescription>Gerencie e monitore suas regras de automação ativas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      {getCategoryIcon(rule.category)}
                    </div>
                    <div>
                      <h4 className="font-medium">{rule.name}</h4>
                      <p className="text-sm text-muted-foreground">{rule.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getCategoryColor(rule.category)}>
                      {rule.category}
                    </Badge>
                    <Switch checked={rule.isActive} onCheckedChange={() => toggleRule(rule.id)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Trigger</p>
                    <p className="font-medium">{rule.trigger}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Ação</p>
                    <p className="font-medium">{rule.action}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Última Execução</p>
                    <p className="font-medium">{rule.lastRun}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Execuções</p>
                    <p className="font-medium">{rule.executions}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <div className="flex items-center gap-2">
                    {rule.isActive ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">Ativa</span>
                      </>
                    ) : (
                      <>
                        <Pause className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-600">Pausada</span>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Logs de Execução */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Logs de Execução Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { time: "14:30", rule: "Monitoramento de Segurança", status: "success", message: "3 IPs bloqueados" },
              {
                time: "02:00",
                rule: "Backup Automático",
                status: "success",
                message: "Backup completo realizado (2.3GB)",
              },
              { time: "01:45", rule: "Limpeza de Cache", status: "success", message: "450MB de cache removido" },
              {
                time: "00:30",
                rule: "Verificação de Integridade",
                status: "warning",
                message: "1 arquivo corrompido detectado",
              },
            ].map((log, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-muted rounded">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-mono">{log.time}</span>
                  <span className="text-sm font-medium">{log.rule}</span>
                </div>
                <span className="text-sm text-muted-foreground">{log.message}</span>
                <Badge variant={log.status === "success" ? "default" : "secondary"}>
                  {log.status === "success" ? "Sucesso" : "Aviso"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
