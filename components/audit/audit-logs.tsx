"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  FileText,
  Search,
  Download,
  Filter,
  Eye,
  Shield,
  AlertTriangle,
  User,
  Settings,
  Database,
  HardDrive,
  Network,
  Calendar,
  Clock,
  MapPin,
  Monitor,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface AuditLog {
  id: string
  timestamp: string
  userId: string
  userName: string
  userRole: string
  action: string
  module: string
  resource: string
  resourceId?: string
  details: string
  ipAddress: string
  userAgent: string
  location?: string
  severity: "low" | "medium" | "high" | "critical"
  status: "success" | "failed" | "warning"
  sessionId: string
  duration?: number
  oldValues?: Record<string, any>
  newValues?: Record<string, any>
}

interface AuditStats {
  totalActions: number
  todayActions: number
  failedActions: number
  criticalActions: number
  topUsers: { name: string; count: number }[]
  topModules: { name: string; count: number }[]
  recentSessions: number
}

export function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([])
  const [stats, setStats] = useState<AuditStats>({
    totalActions: 0,
    todayActions: 0,
    failedActions: 0,
    criticalActions: 0,
    topUsers: [],
    topModules: [],
    recentSessions: 0,
  })
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  // Filtros
  const [searchTerm, setSearchTerm] = useState("")
  const [filterUser, setFilterUser] = useState("all")
  const [filterModule, setFilterModule] = useState("all")
  const [filterAction, setFilterAction] = useState("all")
  const [filterSeverity, setFilterSeverity] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [dateRange, setDateRange] = useState("today")

  // Dados de exemplo
  useEffect(() => {
    const sampleLogs: AuditLog[] = [
      {
        id: "1",
        timestamp: new Date().toISOString(),
        userId: "1",
        userName: "Caio Higino",
        userRole: "admin",
        action: "CREATE",
        module: "users",
        resource: "user",
        resourceId: "user_123",
        details: "Criou novo usuário: João Silva",
        ipAddress: "192.168.1.100",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        location: "São Paulo, SP",
        severity: "medium",
        status: "success",
        sessionId: "sess_abc123",
        duration: 1200,
        newValues: { name: "João Silva", email: "joao@etwicca.com", role: "usuario" },
      },
      {
        id: "2",
        timestamp: new Date(Date.now() - 300000).toISOString(),
        userId: "2",
        userName: "Guilherme Cardoso",
        userRole: "ti",
        action: "UPDATE",
        module: "hardware",
        resource: "equipment",
        resourceId: "hw_456",
        details: "Atualizou configurações do servidor DB-01",
        ipAddress: "192.168.1.101",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        location: "São Paulo, SP",
        severity: "high",
        status: "success",
        sessionId: "sess_def456",
        duration: 2400,
        oldValues: { status: "maintenance", cpu: "Intel Xeon E5" },
        newValues: { status: "active", cpu: "Intel Xeon Silver" },
      },
      {
        id: "3",
        timestamp: new Date(Date.now() - 600000).toISOString(),
        userId: "3",
        userName: "Danilo Peres",
        userRole: "gestor",
        action: "VIEW",
        module: "reports",
        resource: "financial_report",
        resourceId: "rpt_789",
        details: "Visualizou relatório financeiro de TI",
        ipAddress: "192.168.1.102",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        location: "São Paulo, SP",
        severity: "low",
        status: "success",
        sessionId: "sess_ghi789",
        duration: 180,
      },
      {
        id: "4",
        timestamp: new Date(Date.now() - 900000).toISOString(),
        userId: "4",
        userName: "Higor Nascimento",
        userRole: "usuario",
        action: "LOGIN_FAILED",
        module: "auth",
        resource: "session",
        details: "Tentativa de login falhada - senha incorreta",
        ipAddress: "192.168.1.103",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        location: "São Paulo, SP",
        severity: "medium",
        status: "failed",
        sessionId: "sess_jkl012",
      },
      {
        id: "5",
        timestamp: new Date(Date.now() - 1200000).toISOString(),
        userId: "1",
        userName: "Caio Higino",
        userRole: "admin",
        action: "DELETE",
        module: "hardware",
        resource: "equipment",
        resourceId: "hw_old",
        details: "Removeu equipamento obsoleto do inventário",
        ipAddress: "192.168.1.100",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        location: "São Paulo, SP",
        severity: "critical",
        status: "success",
        sessionId: "sess_mno345",
        duration: 800,
        oldValues: { name: "Servidor Antigo", status: "inactive", location: "Datacenter A" },
      },
      {
        id: "6",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        userId: "2",
        userName: "Guilherme Cardoso",
        userRole: "ti",
        action: "BACKUP",
        module: "system",
        resource: "database",
        details: "Executou backup manual do banco de dados",
        ipAddress: "192.168.1.101",
        userAgent: "Mozilla/5.0 (Linux; Ubuntu) AppleWebKit/537.36",
        location: "São Paulo, SP",
        severity: "high",
        status: "success",
        sessionId: "sess_pqr678",
        duration: 45000,
      },
      {
        id: "7",
        timestamp: new Date(Date.now() - 2400000).toISOString(),
        userId: "5",
        userName: "Giovani Santos",
        userRole: "ti",
        action: "CONFIG_CHANGE",
        module: "network",
        resource: "firewall",
        resourceId: "fw_001",
        details: "Alterou regras do firewall - bloqueio de porta 22",
        ipAddress: "192.168.1.104",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        location: "São Paulo, SP",
        severity: "critical",
        status: "success",
        sessionId: "sess_stu901",
        duration: 1800,
        oldValues: { port22: "open", ssh_access: "enabled" },
        newValues: { port22: "blocked", ssh_access: "restricted" },
      },
      {
        id: "8",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        userId: "3",
        userName: "Danilo Peres",
        userRole: "gestor",
        action: "EXPORT",
        module: "reports",
        resource: "user_report",
        details: "Exportou relatório de usuários em CSV",
        ipAddress: "192.168.1.102",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        location: "São Paulo, SP",
        severity: "medium",
        status: "success",
        sessionId: "sess_vwx234",
        duration: 300,
      },
    ]

    setLogs(sampleLogs)
    setFilteredLogs(sampleLogs)

    // Calcular estatísticas
    const today = new Date().toDateString()
    const todayLogs = sampleLogs.filter((log) => new Date(log.timestamp).toDateString() === today)

    const userCounts = sampleLogs.reduce(
      (acc, log) => {
        acc[log.userName] = (acc[log.userName] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const moduleCounts = sampleLogs.reduce(
      (acc, log) => {
        acc[log.module] = (acc[log.module] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    setStats({
      totalActions: sampleLogs.length,
      todayActions: todayLogs.length,
      failedActions: sampleLogs.filter((log) => log.status === "failed").length,
      criticalActions: sampleLogs.filter((log) => log.severity === "critical").length,
      topUsers: Object.entries(userCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
      topModules: Object.entries(moduleCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
      recentSessions: new Set(sampleLogs.map((log) => log.sessionId)).size,
    })
  }, [])

  // Aplicar filtros
  useEffect(() => {
    let filtered = logs

    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.resource.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterUser !== "all") {
      filtered = filtered.filter((log) => log.userId === filterUser)
    }

    if (filterModule !== "all") {
      filtered = filtered.filter((log) => log.module === filterModule)
    }

    if (filterAction !== "all") {
      filtered = filtered.filter((log) => log.action === filterAction)
    }

    if (filterSeverity !== "all") {
      filtered = filtered.filter((log) => log.severity === filterSeverity)
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((log) => log.status === filterStatus)
    }

    // Filtro de data
    const now = new Date()
    if (dateRange === "today") {
      filtered = filtered.filter((log) => new Date(log.timestamp).toDateString() === now.toDateString())
    } else if (dateRange === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      filtered = filtered.filter((log) => new Date(log.timestamp) >= weekAgo)
    } else if (dateRange === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      filtered = filtered.filter((log) => new Date(log.timestamp) >= monthAgo)
    }

    setFilteredLogs(filtered)
  }, [logs, searchTerm, filterUser, filterModule, filterAction, filterSeverity, filterStatus, dateRange])

  const getSeverityBadge = (severity: AuditLog["severity"]) => {
    switch (severity) {
      case "critical":
        return <Badge className="bg-red-500 hover:bg-red-600">Crítico</Badge>
      case "high":
        return <Badge className="bg-orange-500 hover:bg-orange-600">Alto</Badge>
      case "medium":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Médio</Badge>
      case "low":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Baixo</Badge>
    }
  }

  const getStatusBadge = (status: AuditLog["status"]) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-500 hover:bg-green-600">Sucesso</Badge>
      case "failed":
        return <Badge variant="destructive">Falha</Badge>
      case "warning":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Aviso</Badge>
    }
  }

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case "create":
        return <User className="h-4 w-4 text-green-500" />
      case "update":
        return <Settings className="h-4 w-4 text-blue-500" />
      case "delete":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "view":
        return <Eye className="h-4 w-4 text-gray-500" />
      case "login_failed":
        return <Shield className="h-4 w-4 text-red-500" />
      case "backup":
        return <Database className="h-4 w-4 text-purple-500" />
      case "config_change":
        return <Settings className="h-4 w-4 text-orange-500" />
      case "export":
        return <Download className="h-4 w-4 text-blue-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const getModuleIcon = (module: string) => {
    switch (module.toLowerCase()) {
      case "users":
        return <User className="h-4 w-4" />
      case "hardware":
        return <HardDrive className="h-4 w-4" />
      case "network":
        return <Network className="h-4 w-4" />
      case "database":
        return <Database className="h-4 w-4" />
      case "system":
        return <Monitor className="h-4 w-4" />
      case "reports":
        return <FileText className="h-4 w-4" />
      case "auth":
        return <Shield className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  const exportLogs = () => {
    const csvContent = [
      [
        "Data/Hora",
        "Usuário",
        "Ação",
        "Módulo",
        "Recurso",
        "Detalhes",
        "IP",
        "Severidade",
        "Status",
        "Duração (ms)",
      ].join(","),
      ...filteredLogs.map((log) =>
        [
          new Date(log.timestamp).toLocaleString(),
          log.userName,
          log.action,
          log.module,
          log.resource,
          `"${log.details}"`,
          log.ipAddress,
          log.severity,
          log.status,
          log.duration || "",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Logs Exportados",
      description: "Arquivo CSV baixado com sucesso.",
    })
  }

  const clearFilters = () => {
    setSearchTerm("")
    setFilterUser("all")
    setFilterModule("all")
    setFilterAction("all")
    setFilterSeverity("all")
    setFilterStatus("all")
    setDateRange("today")
  }

  const uniqueUsers = Array.from(new Set(logs.map((log) => ({ id: log.userId, name: log.userName }))))
  const uniqueModules = Array.from(new Set(logs.map((log) => log.module)))
  const uniqueActions = Array.from(new Set(logs.map((log) => log.action)))

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-blue-800">Logs de Auditoria - ET & WICCA</CardTitle>
                <CardDescription>Rastreamento completo de todas as ações realizadas no sistema</CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={clearFilters} className="border-blue-200 text-blue-600">
                <Filter className="h-4 w-4 mr-2" />
                Limpar Filtros
              </Button>
              <Button onClick={exportLogs} className="bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Exportar Logs
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Total de Ações</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalActions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Ações Hoje</p>
                <p className="text-2xl font-bold text-green-600">{stats.todayActions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Ações Críticas</p>
                <p className="text-2xl font-bold text-red-600">{stats.criticalActions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                <Shield className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Falhas</p>
                <p className="text-2xl font-bold text-amber-600">{stats.failedActions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Filtros</CardTitle>
          <CardDescription>Refine sua busca nos logs de auditoria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Buscar logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-blue-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-filter">Usuário</Label>
              <Select value={filterUser} onValueChange={setFilterUser}>
                <SelectTrigger className="border-blue-200">
                  <SelectValue placeholder="Todos os usuários" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os usuários</SelectItem>
                  {uniqueUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="module-filter">Módulo</Label>
              <Select value={filterModule} onValueChange={setFilterModule}>
                <SelectTrigger className="border-blue-200">
                  <SelectValue placeholder="Todos os módulos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os módulos</SelectItem>
                  {uniqueModules.map((module) => (
                    <SelectItem key={module} value={module}>
                      {module}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="action-filter">Ação</Label>
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger className="border-blue-200">
                  <SelectValue placeholder="Todas as ações" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as ações</SelectItem>
                  {uniqueActions.map((action) => (
                    <SelectItem key={action} value={action}>
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="severity-filter">Severidade</Label>
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger className="border-blue-200">
                  <SelectValue placeholder="Todas as severidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as severidades</SelectItem>
                  <SelectItem value="critical">Crítico</SelectItem>
                  <SelectItem value="high">Alto</SelectItem>
                  <SelectItem value="medium">Médio</SelectItem>
                  <SelectItem value="low">Baixo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status-filter">Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="border-blue-200">
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="success">Sucesso</SelectItem>
                  <SelectItem value="failed">Falha</SelectItem>
                  <SelectItem value="warning">Aviso</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-filter">Período</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="border-blue-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Última semana</SelectItem>
                  <SelectItem value="month">Último mês</SelectItem>
                  <SelectItem value="all">Todos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="logs">Logs de Auditoria</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="sessions">Sessões</TabsTrigger>
        </TabsList>

        {/* Tabela de Logs */}
        <TabsContent value="logs">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Logs de Auditoria</CardTitle>
              <CardDescription>{filteredLogs.length} registro(s) encontrado(s)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Ação</TableHead>
                      <TableHead>Módulo</TableHead>
                      <TableHead>Detalhes</TableHead>
                      <TableHead>IP</TableHead>
                      <TableHead>Severidade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium">{new Date(log.timestamp).toLocaleDateString()}</p>
                              <p className="text-xs text-gray-600">{new Date(log.timestamp).toLocaleTimeString()}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                              <span className="text-xs font-medium text-blue-600">
                                {log.userName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-blue-800">{log.userName}</p>
                              <p className="text-xs text-gray-600">{log.userRole}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getActionIcon(log.action)}
                            <span className="font-medium">{log.action}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getModuleIcon(log.module)}
                            <span className="capitalize">{log.module}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="max-w-xs truncate" title={log.details}>
                            {log.details}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">{log.ipAddress}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getSeverityBadge(log.severity)}</TableCell>
                        <TableCell>{getStatusBadge(log.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedLog(log)
                              setIsDetailDialogOpen(true)
                            }}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Usuários Mais Ativos</CardTitle>
                <CardDescription>Ranking de usuários por número de ações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.topUsers.map((user, index) => (
                    <div key={user.name} className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-medium">
                          {index + 1}
                        </div>
                        <span className="font-medium text-blue-800">{user.name}</span>
                      </div>
                      <Badge className="bg-blue-500 hover:bg-blue-600">{user.count} ações</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Módulos Mais Utilizados</CardTitle>
                <CardDescription>Ranking de módulos por número de acessos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.topModules.map((module, index) => (
                    <div key={module.name} className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex items-center gap-2">
                          {getModuleIcon(module.name)}
                          <span className="font-medium text-blue-800 capitalize">{module.name}</span>
                        </div>
                      </div>
                      <Badge className="bg-blue-500 hover:bg-blue-600">{module.count} acessos</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sessões */}
        <TabsContent value="sessions">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Sessões Ativas</CardTitle>
              <CardDescription>Informações sobre sessões de usuários</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-2xl font-bold text-blue-600">{stats.recentSessions}</p>
                  <p className="text-sm text-blue-700">Sessões Recentes</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
                  <p className="text-2xl font-bold text-green-600">
                    {logs.filter((log) => log.action.includes("LOGIN") && log.status === "success").length}
                  </p>
                  <p className="text-sm text-green-700">Logins Bem-sucedidos</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-2xl font-bold text-red-600">
                    {logs.filter((log) => log.action.includes("LOGIN") && log.status === "failed").length}
                  </p>
                  <p className="text-sm text-red-700">Tentativas Falhadas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de Detalhes */}
      {selectedLog && (
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-blue-800">Detalhes do Log de Auditoria</DialogTitle>
              <DialogDescription>Informações completas sobre a ação realizada</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Informações Básicas */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Informações da Ação</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Data/Hora:</span>
                      <span className="text-sm">{new Date(selectedLog.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Ação:</span>
                      <div className="flex items-center gap-2">
                        {getActionIcon(selectedLog.action)}
                        <span className="text-sm">{selectedLog.action}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Módulo:</span>
                      <div className="flex items-center gap-2">
                        {getModuleIcon(selectedLog.module)}
                        <span className="text-sm capitalize">{selectedLog.module}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Recurso:</span>
                      <span className="text-sm">{selectedLog.resource}</span>
                    </div>
                    {selectedLog.resourceId && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">ID do Recurso:</span>
                        <span className="text-sm font-mono">{selectedLog.resourceId}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Severidade:</span>
                      {getSeverityBadge(selectedLog.severity)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Status:</span>
                      {getStatusBadge(selectedLog.status)}
                    </div>
                    {selectedLog.duration && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Duração:</span>
                        <span className="text-sm">{selectedLog.duration}ms</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Informações do Usuário</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Nome:</span>
                      <span className="text-sm">{selectedLog.userName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Cargo:</span>
                      <span className="text-sm capitalize">{selectedLog.userRole}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">IP:</span>
                      <span className="text-sm font-mono">{selectedLog.ipAddress}</span>
                    </div>
                    {selectedLog.location && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Localização:</span>
                        <span className="text-sm">{selectedLog.location}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Sessão:</span>
                      <span className="text-sm font-mono">{selectedLog.sessionId}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detalhes da Ação */}
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Detalhes da Ação</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{selectedLog.details}</p>
                </CardContent>
              </Card>

              {/* Valores Alterados */}
              {(selectedLog.oldValues || selectedLog.newValues) && (
                <div className="grid gap-4 md:grid-cols-2">
                  {selectedLog.oldValues && (
                    <Card className="border-red-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base text-red-800">Valores Anteriores</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="text-xs bg-red-50 p-3 rounded border overflow-x-auto">
                          {JSON.stringify(selectedLog.oldValues, null, 2)}
                        </pre>
                      </CardContent>
                    </Card>
                  )}

                  {selectedLog.newValues && (
                    <Card className="border-green-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base text-green-800">Valores Novos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="text-xs bg-green-50 p-3 rounded border overflow-x-auto">
                          {JSON.stringify(selectedLog.newValues, null, 2)}
                        </pre>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* User Agent */}
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Informações Técnicas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">User Agent:</span>
                      <p className="text-xs text-gray-600 mt-1 break-all">{selectedLog.userAgent}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
