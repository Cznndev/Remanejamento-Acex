"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, FileCheck, AlertTriangle, CheckCircle, Clock, Download, Eye } from "lucide-react"

interface ComplianceRule {
  id: string
  name: string
  framework: string
  status: "compliant" | "non-compliant" | "partial"
  lastCheck: string
  nextCheck: string
  severity: "low" | "medium" | "high" | "critical"
}

interface AuditEvent {
  id: string
  timestamp: string
  user: string
  action: string
  resource: string
  result: "success" | "failure" | "warning"
  ip: string
}

export function AdvancedCompliance() {
  const [complianceRules] = useState<ComplianceRule[]>([
    {
      id: "1",
      name: "Criptografia de Dados em Repouso",
      framework: "LGPD",
      status: "compliant",
      lastCheck: "2024-01-15 09:00",
      nextCheck: "2024-01-22 09:00",
      severity: "high",
    },
    {
      id: "2",
      name: "Controle de Acesso Baseado em Função",
      framework: "ISO 27001",
      status: "partial",
      lastCheck: "2024-01-15 10:30",
      nextCheck: "2024-01-16 10:30",
      severity: "medium",
    },
    {
      id: "3",
      name: "Backup e Recuperação de Dados",
      framework: "SOX",
      status: "compliant",
      lastCheck: "2024-01-15 08:00",
      nextCheck: "2024-01-16 08:00",
      severity: "critical",
    },
    {
      id: "4",
      name: "Monitoramento de Atividades Suspeitas",
      framework: "PCI DSS",
      status: "non-compliant",
      lastCheck: "2024-01-14 16:00",
      nextCheck: "2024-01-15 16:00",
      severity: "high",
    },
  ])

  const [auditEvents] = useState<AuditEvent[]>([
    {
      id: "1",
      timestamp: "2024-01-15 14:30:25",
      user: "admin@etwicca.com",
      action: "LOGIN_SUCCESS",
      resource: "Dashboard",
      result: "success",
      ip: "192.168.1.100",
    },
    {
      id: "2",
      timestamp: "2024-01-15 14:25:10",
      user: "user@etwicca.com",
      action: "DATA_ACCESS",
      resource: "Customer Database",
      result: "success",
      ip: "192.168.1.105",
    },
    {
      id: "3",
      timestamp: "2024-01-15 14:20:45",
      user: "unknown",
      action: "LOGIN_FAILED",
      resource: "Admin Panel",
      result: "failure",
      ip: "203.0.113.1",
    },
    {
      id: "4",
      timestamp: "2024-01-15 14:15:30",
      user: "tech@etwicca.com",
      action: "CONFIG_CHANGE",
      resource: "Firewall Rules",
      result: "warning",
      ip: "192.168.1.110",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "bg-green-50 text-green-700 border-green-200"
      case "partial":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "non-compliant":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getResultIcon = (result: string) => {
    switch (result) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "failure":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const complianceScore = Math.round(
    (complianceRules.filter((r) => r.status === "compliant").length / complianceRules.length) * 100,
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Compliance e Auditoria Avançada</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Relatório
              </Button>
              <Button>
                <FileCheck className="mr-2 h-4 w-4" />
                Nova Auditoria
              </Button>
            </div>
          </div>
          <CardDescription>Monitoramento contínuo de compliance e auditoria de segurança</CardDescription>
        </CardHeader>
      </Card>

      {/* Score de Compliance */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Score de Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceScore}%</div>
            <Progress value={complianceScore} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {complianceRules.filter((r) => r.status === "compliant").length} de {complianceRules.length} regras
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Eventos de Auditoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">Últimas 24 horas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Violações Detectadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Próxima Auditoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7d</div>
            <p className="text-xs text-muted-foreground">Auditoria trimestral</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="compliance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="compliance">Regras de Compliance</TabsTrigger>
          <TabsTrigger value="audit">Logs de Auditoria</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Regras de Compliance</CardTitle>
              <CardDescription>Status atual das regras de conformidade por framework</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceRules.map((rule) => (
                  <div key={rule.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{rule.name}</h4>
                        <p className="text-sm text-muted-foreground">Framework: {rule.framework}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getSeverityColor(rule.severity)}>
                          {rule.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(rule.status)}>
                          {rule.status === "compliant"
                            ? "Conforme"
                            : rule.status === "partial"
                              ? "Parcial"
                              : "Não Conforme"}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Última Verificação</p>
                        <p className="font-medium">{rule.lastCheck}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Próxima Verificação</p>
                        <p className="font-medium">{rule.nextCheck}</p>
                      </div>
                    </div>

                    <div className="flex justify-end mt-3 pt-3 border-t">
                      <Button variant="ghost" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Detalhes
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Logs de Auditoria</CardTitle>
              <CardDescription>Registro detalhado de todas as atividades do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    {getResultIcon(event.result)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{event.timestamp}</span>
                        <Badge variant="outline">{event.action}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {event.user} acessou {event.resource} de {event.ip}
                      </p>
                    </div>
                    <Badge
                      variant={
                        event.result === "success"
                          ? "default"
                          : event.result === "failure"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {event.result === "success" ? "Sucesso" : event.result === "failure" ? "Falha" : "Aviso"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Relatórios Disponíveis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Relatório LGPD", date: "2024-01-15", size: "2.3 MB" },
                    { name: "Auditoria ISO 27001", date: "2024-01-10", size: "1.8 MB" },
                    { name: "Compliance SOX", date: "2024-01-05", size: "3.1 MB" },
                    { name: "Relatório PCI DSS", date: "2024-01-01", size: "2.7 MB" },
                  ].map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium">{report.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {report.date} • {report.size}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Próximas Auditorias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { framework: "LGPD", date: "2024-01-22", type: "Mensal" },
                    { framework: "ISO 27001", date: "2024-02-01", type: "Trimestral" },
                    { framework: "SOX", date: "2024-02-15", type: "Semestral" },
                    { framework: "PCI DSS", date: "2024-03-01", type: "Anual" },
                  ].map((audit, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium">{audit.framework}</p>
                        <p className="text-sm text-muted-foreground">{audit.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{audit.date}</p>
                        <p className="text-sm text-muted-foreground">Agendada</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
