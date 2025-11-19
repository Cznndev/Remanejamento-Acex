"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertTriangle, Plus, Edit, Trash2, Activity, HardDrive, Network, Database } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface AlertRule {
  id: string
  name: string
  description: string
  category: "hardware" | "software" | "network" | "database" | "system"
  metric: string
  condition: "greater_than" | "less_than" | "equals" | "not_equals"
  threshold: number
  unit: string
  severity: "low" | "medium" | "high" | "critical"
  enabled: boolean
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  cooldown: number // minutos
  lastTriggered?: Date
  triggerCount: number
}

export function AlertSystem() {
  const [alertRules, setAlertRules] = useState<AlertRule[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null)
  const [formData, setFormData] = useState<Partial<AlertRule>>({
    name: "",
    description: "",
    category: "hardware",
    metric: "cpu_usage",
    condition: "greater_than",
    threshold: 0,
    unit: "%",
    severity: "medium",
    enabled: true,
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    cooldown: 15,
  })

  useEffect(() => {
    // Regras de alerta pré-configuradas
    const defaultRules: AlertRule[] = [
      {
        id: "1",
        name: "CPU Alto",
        description: "Alerta quando o uso de CPU excede 85%",
        category: "hardware",
        metric: "cpu_usage",
        condition: "greater_than",
        threshold: 85,
        unit: "%",
        severity: "high",
        enabled: true,
        notifications: { email: true, push: true, sms: false },
        cooldown: 15,
        triggerCount: 12,
        lastTriggered: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: "2",
        name: "Memória Baixa",
        description: "Alerta quando a memória disponível é menor que 10%",
        category: "hardware",
        metric: "memory_available",
        condition: "less_than",
        threshold: 10,
        unit: "%",
        severity: "critical",
        enabled: true,
        notifications: { email: true, push: true, sms: true },
        cooldown: 5,
        triggerCount: 3,
        lastTriggered: new Date(Date.now() - 6 * 60 * 60 * 1000),
      },
      {
        id: "3",
        name: "Disco Cheio",
        description: "Alerta quando o uso do disco excede 90%",
        category: "hardware",
        metric: "disk_usage",
        condition: "greater_than",
        threshold: 90,
        unit: "%",
        severity: "high",
        enabled: true,
        notifications: { email: true, push: true, sms: false },
        cooldown: 30,
        triggerCount: 1,
        lastTriggered: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        id: "4",
        name: "Rede Lenta",
        description: "Alerta quando a latência da rede excede 100ms",
        category: "network",
        metric: "network_latency",
        condition: "greater_than",
        threshold: 100,
        unit: "ms",
        severity: "medium",
        enabled: true,
        notifications: { email: true, push: false, sms: false },
        cooldown: 20,
        triggerCount: 8,
        lastTriggered: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
      {
        id: "5",
        name: "Backup Falhou",
        description: "Alerta quando o backup falha",
        category: "system",
        metric: "backup_status",
        condition: "equals",
        threshold: 0,
        unit: "",
        severity: "critical",
        enabled: true,
        notifications: { email: true, push: true, sms: true },
        cooldown: 60,
        triggerCount: 0,
      },
    ]

    setAlertRules(defaultRules)
  }, [])

  const getCategoryIcon = (category: AlertRule["category"]) => {
    switch (category) {
      case "hardware":
        return <HardDrive className="h-4 w-4" />
      case "network":
        return <Network className="h-4 w-4" />
      case "database":
        return <Database className="h-4 w-4" />
      case "system":
        return <Activity className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: AlertRule["severity"]) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const handleSave = () => {
    if (!formData.name || !formData.metric || formData.threshold === undefined) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    if (editingRule) {
      // Editar regra existente
      setAlertRules((prev) =>
        prev.map((rule) =>
          rule.id === editingRule.id ? { ...rule, ...formData, triggerCount: rule.triggerCount } : rule,
        ),
      )
      toast({
        title: "Regra atualizada",
        description: "A regra de alerta foi atualizada com sucesso.",
      })
    } else {
      // Criar nova regra
      const newRule: AlertRule = {
        id: Date.now().toString(),
        ...(formData as AlertRule),
        triggerCount: 0,
      }
      setAlertRules((prev) => [...prev, newRule])
      toast({
        title: "Regra criada",
        description: "Nova regra de alerta foi criada com sucesso.",
      })
    }

    resetForm()
    setIsDialogOpen(false)
  }

  const handleEdit = (rule: AlertRule) => {
    setEditingRule(rule)
    setFormData(rule)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setAlertRules((prev) => prev.filter((rule) => rule.id !== id))
    toast({
      title: "Regra removida",
      description: "A regra de alerta foi removida com sucesso.",
    })
  }

  const toggleRule = (id: string) => {
    setAlertRules((prev) => prev.map((rule) => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule)))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "hardware",
      metric: "cpu_usage",
      condition: "greater_than",
      threshold: 0,
      unit: "%",
      severity: "medium",
      enabled: true,
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
      cooldown: 15,
    })
    setEditingRule(null)
  }

  const formatLastTriggered = (date?: Date) => {
    if (!date) return "Nunca"
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (hours < 1) return "Há poucos minutos"
    if (hours < 24) return `${hours}h atrás`
    return `${days}d atrás`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-blue-800">Sistema de Alertas - ET & WICCA</CardTitle>
              <CardDescription>
                Configure regras personalizadas para monitoramento e alertas automáticos
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Regra
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{editingRule ? "Editar Regra de Alerta" : "Nova Regra de Alerta"}</DialogTitle>
                  <DialogDescription>Configure os parâmetros para a regra de alerta</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome da Regra *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Ex: CPU Alto"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Categoria</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, category: value as AlertRule["category"] }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hardware">Hardware</SelectItem>
                          <SelectItem value="software">Software</SelectItem>
                          <SelectItem value="network">Rede</SelectItem>
                          <SelectItem value="database">Banco de Dados</SelectItem>
                          <SelectItem value="system">Sistema</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Descrição da regra de alerta"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="metric">Métrica *</Label>
                      <Select
                        value={formData.metric}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, metric: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cpu_usage">Uso de CPU</SelectItem>
                          <SelectItem value="memory_usage">Uso de Memória</SelectItem>
                          <SelectItem value="memory_available">Memória Disponível</SelectItem>
                          <SelectItem value="disk_usage">Uso de Disco</SelectItem>
                          <SelectItem value="network_latency">Latência de Rede</SelectItem>
                          <SelectItem value="network_bandwidth">Largura de Banda</SelectItem>
                          <SelectItem value="temperature">Temperatura</SelectItem>
                          <SelectItem value="backup_status">Status do Backup</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="condition">Condição</Label>
                      <Select
                        value={formData.condition}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, condition: value as AlertRule["condition"] }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="greater_than">Maior que</SelectItem>
                          <SelectItem value="less_than">Menor que</SelectItem>
                          <SelectItem value="equals">Igual a</SelectItem>
                          <SelectItem value="not_equals">Diferente de</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="threshold">Valor *</Label>
                      <div className="flex gap-2">
                        <Input
                          id="threshold"
                          type="number"
                          value={formData.threshold}
                          onChange={(e) => setFormData((prev) => ({ ...prev, threshold: Number(e.target.value) }))}
                          placeholder="0"
                        />
                        <Select
                          value={formData.unit}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, unit: value }))}
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="%">%</SelectItem>
                            <SelectItem value="GB">GB</SelectItem>
                            <SelectItem value="MB">MB</SelectItem>
                            <SelectItem value="ms">ms</SelectItem>
                            <SelectItem value="°C">°C</SelectItem>
                            <SelectItem value="none">-</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="severity">Severidade</Label>
                      <Select
                        value={formData.severity}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, severity: value as AlertRule["severity"] }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Baixa</SelectItem>
                          <SelectItem value="medium">Média</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                          <SelectItem value="critical">Crítica</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="cooldown">Cooldown (minutos)</Label>
                      <Input
                        id="cooldown"
                        type="number"
                        value={formData.cooldown}
                        onChange={(e) => setFormData((prev) => ({ ...prev, cooldown: Number(e.target.value) }))}
                        placeholder="15"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Notificações</Label>
                    <div className="flex gap-6 mt-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={formData.notifications?.email}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({
                              ...prev,
                              notifications: { ...prev.notifications!, email: checked },
                            }))
                          }
                        />
                        <Label>Email</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={formData.notifications?.push}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({
                              ...prev,
                              notifications: { ...prev.notifications!, push: checked },
                            }))
                          }
                        />
                        <Label>Push</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={formData.notifications?.sms}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({
                              ...prev,
                              notifications: { ...prev.notifications!, sms: checked },
                            }))
                          }
                        />
                        <Label>SMS</Label>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                    {editingRule ? "Atualizar" : "Criar"} Regra
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Regra</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Condição</TableHead>
                  <TableHead>Severidade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Disparos</TableHead>
                  <TableHead>Último Disparo</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alertRules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{rule.name}</div>
                        <div className="text-sm text-muted-foreground">{rule.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(rule.category)}
                        <span className="capitalize">{rule.category}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {rule.metric.replace(/_/g, " ")} {rule.condition.replace(/_/g, " ")} {rule.threshold}
                        {rule.unit}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getSeverityColor(rule.severity)}>
                        {rule.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                        <span className="text-sm">{rule.enabled ? "Ativo" : "Inativo"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {rule.triggerCount}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{formatLastTriggered(rule.lastTriggered)}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(rule)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(rule.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas dos Alertas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Total de Regras</p>
                <p className="text-2xl font-bold text-blue-600">{alertRules.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Regras Ativas</p>
                <p className="text-2xl font-bold text-green-600">{alertRules.filter((rule) => rule.enabled).length}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Disparos Hoje</p>
                <p className="text-2xl font-bold text-amber-600">
                  {alertRules.reduce((sum, rule) => sum + rule.triggerCount, 0)}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Alertas Críticos</p>
                <p className="text-2xl font-bold text-red-600">
                  {alertRules.filter((rule) => rule.severity === "critical" && rule.enabled).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
