"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  FileText,
  Download,
  Calendar,
  BarChart3,
  TrendingUp,
  Clock,
  Mail,
  Settings,
  Play,
  Pause,
  Eye,
  Plus,
  Edit,
  Trash2,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Report {
  id: string
  name: string
  description: string
  category: "inventory" | "performance" | "financial" | "security" | "compliance"
  type: "table" | "chart" | "dashboard"
  schedule?: {
    enabled: boolean
    frequency: "daily" | "weekly" | "monthly"
    time: string
    recipients: string[]
  }
  lastGenerated?: Date
  status: "active" | "inactive" | "generating"
  parameters: Record<string, any>
}

interface ReportData {
  headers: string[]
  rows: any[][]
  summary?: {
    totalItems: number
    totalValue?: number
    averageValue?: number
    trends?: {
      label: string
      value: number
      change: number
    }[]
  }
  charts?: {
    type: "bar" | "pie" | "line"
    data: any[]
    title: string
  }[]
}

export function AdvancedReports() {
  const [reports, setReports] = useState<Report[]>([])
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingReport, setEditingReport] = useState<Report | null>(null)
  const [activeTab, setActiveTab] = useState("reports")

  useEffect(() => {
    // Relatórios pré-configurados
    const defaultReports: Report[] = [
      {
        id: "1",
        name: "Inventário Completo de Hardware",
        description: "Relatório detalhado de todos os equipamentos da empresa",
        category: "inventory",
        type: "table",
        status: "active",
        lastGenerated: new Date(Date.now() - 2 * 60 * 60 * 1000),
        parameters: {
          includeInactive: false,
          groupBy: "department",
          sortBy: "acquisitionDate",
        },
        schedule: {
          enabled: true,
          frequency: "weekly",
          time: "08:00",
          recipients: ["admin@etwicca.com", "ti@etwicca.com"],
        },
      },
      {
        id: "2",
        name: "Análise de Performance de Sistemas",
        description: "Métricas de performance e disponibilidade dos sistemas",
        category: "performance",
        type: "dashboard",
        status: "active",
        lastGenerated: new Date(Date.now() - 30 * 60 * 1000),
        parameters: {
          period: "30days",
          includeMetrics: ["cpu", "memory", "disk", "network"],
        },
        schedule: {
          enabled: true,
          frequency: "daily",
          time: "09:00",
          recipients: ["ti@etwicca.com"],
        },
      },
      {
        id: "3",
        name: "Relatório de Custos de TI",
        description: "Análise financeira dos investimentos em tecnologia",
        category: "financial",
        type: "chart",
        status: "active",
        lastGenerated: new Date(Date.now() - 24 * 60 * 60 * 1000),
        parameters: {
          period: "12months",
          includeCategories: ["hardware", "software", "services"],
          currency: "BRL",
        },
        schedule: {
          enabled: true,
          frequency: "monthly",
          time: "10:00",
          recipients: ["admin@etwicca.com", "gestor@etwicca.com"],
        },
      },
      {
        id: "4",
        name: "Licenças de Software a Vencer",
        description: "Lista de licenças que expiram nos próximos 90 dias",
        category: "compliance",
        type: "table",
        status: "active",
        lastGenerated: new Date(Date.now() - 6 * 60 * 60 * 1000),
        parameters: {
          daysAhead: 90,
          includeRenewed: false,
          sortBy: "expirationDate",
        },
        schedule: {
          enabled: true,
          frequency: "weekly",
          time: "07:30",
          recipients: ["admin@etwicca.com", "ti@etwicca.com"],
        },
      },
      {
        id: "5",
        name: "Auditoria de Segurança",
        description: "Relatório de eventos de segurança e vulnerabilidades",
        category: "security",
        type: "dashboard",
        status: "active",
        lastGenerated: new Date(Date.now() - 12 * 60 * 60 * 1000),
        parameters: {
          period: "7days",
          severityLevel: "medium",
          includeResolved: false,
        },
        schedule: {
          enabled: false,
          frequency: "daily",
          time: "06:00",
          recipients: ["admin@etwicca.com"],
        },
      },
    ]

    setReports(defaultReports)
  }, [])

  const generateReport = async (report: Report) => {
    setIsGenerating(true)
    setSelectedReport(report)

    // Simular geração de relatório
    setTimeout(() => {
      const mockData = generateMockData(report)
      setReportData(mockData)
      setIsGenerating(false)

      // Atualizar último gerado
      setReports((prev) => prev.map((r) => (r.id === report.id ? { ...r, lastGenerated: new Date() } : r)))

      toast({
        title: "Relatório gerado",
        description: `${report.name} foi gerado com sucesso.`,
      })
    }, 2000)
  }

  const generateMockData = (report: Report): ReportData => {
    switch (report.category) {
      case "inventory":
        return {
          headers: ["Equipamento", "Tipo", "Departamento", "Status", "Data Aquisição", "Valor"],
          rows: [
            ["Dell XPS 15", "Laptop", "TI", "Ativo", "15/03/2023", "R$ 8.500"],
            ["HP EliteDesk 800", "Desktop", "Financeiro", "Ativo", "10/01/2023", "R$ 3.200"],
            ["MacBook Pro 16", "Laptop", "Design", "Ativo", "22/05/2023", "R$ 12.000"],
            ["Dell PowerEdge R740", "Servidor", "TI", "Manutenção", "05/11/2022", "R$ 25.000"],
            ["iPhone 14 Pro", "Smartphone", "Diretoria", "Ativo", "12/04/2023", "R$ 6.500"],
          ],
          summary: {
            totalItems: 127,
            totalValue: 485000,
            averageValue: 3819,
            trends: [
              { label: "Ativos", value: 108, change: 5 },
              { label: "Manutenção", value: 12, change: -2 },
              { label: "Inativos", value: 7, change: -3 },
            ],
          },
          charts: [
            {
              type: "pie",
              title: "Distribuição por Tipo",
              data: [
                { name: "Laptops", value: 45, color: "#3b82f6" },
                { name: "Desktops", value: 32, color: "#10b981" },
                { name: "Servidores", value: 12, color: "#f59e0b" },
                { name: "Dispositivos Móveis", value: 28, color: "#ef4444" },
                { name: "Outros", value: 10, color: "#8b5cf6" },
              ],
            },
          ],
        }

      case "performance":
        return {
          headers: ["Sistema", "CPU Média", "Memória Média", "Uptime", "Incidentes", "SLA"],
          rows: [
            ["Servidor Web", "45%", "67%", "99.9%", "2", "99.5%"],
            ["Servidor BD", "72%", "84%", "99.2%", "5", "98.8%"],
            ["Servidor Email", "23%", "45%", "98.5%", "8", "97.2%"],
            ["Firewall", "15%", "32%", "99.8%", "1", "99.7%"],
            ["Switch Principal", "8%", "28%", "99.9%", "0", "100%"],
          ],
          summary: {
            totalItems: 15,
            averageValue: 98.6,
            trends: [
              { label: "Disponibilidade Média", value: 99.3, change: 0.2 },
              { label: "Incidentes Totais", value: 16, change: -4 },
              { label: "Tempo Médio Resolução", value: 45, change: -12 },
            ],
          },
          charts: [
            {
              type: "line",
              title: "Tendência de Performance (30 dias)",
              data: Array.from({ length: 30 }, (_, i) => ({
                day: i + 1,
                cpu: Math.random() * 40 + 30,
                memory: Math.random() * 30 + 50,
                network: Math.random() * 20 + 10,
              })),
            },
          ],
        }

      case "financial":
        return {
          headers: ["Categoria", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Total"],
          rows: [
            ["Hardware", "R$ 15.000", "R$ 8.500", "R$ 22.000", "R$ 12.000", "R$ 18.500", "R$ 9.200", "R$ 85.200"],
            ["Software", "R$ 12.500", "R$ 11.200", "R$ 13.800", "R$ 11.900", "R$ 12.100", "R$ 14.200", "R$ 75.700"],
            ["Serviços", "R$ 8.200", "R$ 7.800", "R$ 9.500", "R$ 8.900", "R$ 8.100", "R$ 9.800", "R$ 52.300"],
            ["Manutenção", "R$ 3.500", "R$ 4.200", "R$ 2.800", "R$ 5.100", "R$ 3.900", "R$ 4.500", "R$ 24.000"],
          ],
          summary: {
            totalItems: 4,
            totalValue: 237200,
            averageValue: 39533,
            trends: [
              { label: "Crescimento Mensal", value: 2.5, change: 0.8 },
              { label: "Economia vs Orçado", value: 8.2, change: 3.1 },
              { label: "ROI Anual", value: 15.7, change: 2.3 },
            ],
          },
          charts: [
            {
              type: "bar",
              title: "Investimentos por Categoria (6 meses)",
              data: [
                { category: "Hardware", value: 85200, color: "#3b82f6" },
                { category: "Software", value: 75700, color: "#10b981" },
                { category: "Serviços", value: 52300, color: "#f59e0b" },
                { category: "Manutenção", value: 24000, color: "#ef4444" },
              ],
            },
          ],
        }

      default:
        return {
          headers: ["Item", "Valor", "Status"],
          rows: [["Exemplo", "100", "Ativo"]],
          summary: { totalItems: 1 },
        }
    }
  }

  const exportReport = (format: "pdf" | "excel" | "csv") => {
    if (!reportData || !selectedReport) return

    // Simular exportação
    toast({
      title: "Exportando relatório",
      description: `Gerando arquivo ${format.toUpperCase()}...`,
    })

    setTimeout(() => {
      toast({
        title: "Relatório exportado",
        description: `${selectedReport.name}.${format} foi baixado com sucesso.`,
      })
    }, 1500)
  }

  const scheduleReport = (report: Report) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === report.id
          ? {
              ...r,
              schedule: {
                ...r.schedule!,
                enabled: !r.schedule?.enabled,
              },
            }
          : r,
      ),
    )

    toast({
      title: report.schedule?.enabled ? "Agendamento desativado" : "Agendamento ativado",
      description: `${report.name} ${report.schedule?.enabled ? "não será mais" : "será"} gerado automaticamente.`,
    })
  }

  const getCategoryColor = (category: Report["category"]) => {
    switch (category) {
      case "inventory":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "performance":
        return "bg-green-100 text-green-800 border-green-200"
      case "financial":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "security":
        return "bg-red-100 text-red-800 border-red-200"
      case "compliance":
        return "bg-purple-100 text-purple-800 border-purple-200"
    }
  }

  const formatLastGenerated = (date?: Date) => {
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
              <CardTitle className="text-blue-800">Relatórios Avançados - ET & WICCA</CardTitle>
              <CardDescription>
                Gere, agende e exporte relatórios detalhados sobre todos os aspectos da infraestrutura de TI
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Relatório
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Criar Novo Relatório</DialogTitle>
                  <DialogDescription>Configure um novo relatório personalizado</DialogDescription>
                </DialogHeader>
                <ReportForm onSave={() => setIsDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
          <TabsTrigger value="scheduled">Agendamentos</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reports.map((report) => (
              <Card key={report.id} className="border-blue-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base text-blue-800">{report.name}</CardTitle>
                      <CardDescription className="text-sm mt-1">{report.description}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => generateReport(report)}>
                          <Play className="h-4 w-4 mr-2" />
                          Gerar Agora
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => scheduleReport(report)}>
                          {report.schedule?.enabled ? (
                            <>
                              <Pause className="h-4 w-4 mr-2" />
                              Desativar Agendamento
                            </>
                          ) : (
                            <>
                              <Calendar className="h-4 w-4 mr-2" />
                              Ativar Agendamento
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getCategoryColor(report.category)}>
                        {report.category}
                      </Badge>
                      <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                        {report.type}
                      </Badge>
                    </div>

                    <div className="text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Último: {formatLastGenerated(report.lastGenerated)}</span>
                      </div>
                      {report.schedule?.enabled && (
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {report.schedule.frequency} às {report.schedule.time}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => generateReport(report)}
                        disabled={isGenerating}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        {isGenerating && selectedReport?.id === report.id ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2" />
                            Gerando...
                          </>
                        ) : (
                          <>
                            <Eye className="h-3 w-3 mr-2" />
                            Visualizar
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-800">Relatórios Agendados</CardTitle>
              <CardDescription>Gerencie a automação de relatórios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Relatório</TableHead>
                      <TableHead>Frequência</TableHead>
                      <TableHead>Horário</TableHead>
                      <TableHead>Destinatários</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Próxima Execução</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports
                      .filter((report) => report.schedule?.enabled)
                      .map((report) => (
                        <TableRow key={report.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{report.name}</div>
                              <div className="text-sm text-muted-foreground">{report.category}</div>
                            </div>
                          </TableCell>
                          <TableCell className="capitalize">{report.schedule?.frequency}</TableCell>
                          <TableCell>{report.schedule?.time}</TableCell>
                          <TableCell>
                            <div className="text-sm">{report.schedule?.recipients.length} destinatário(s)</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Ativo
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">Amanhã, {report.schedule?.time}</div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => scheduleReport(report)}>
                                <Pause className="h-4 w-4" />
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
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-800">Total de Relatórios</p>
                    <p className="text-2xl font-bold text-blue-600">{reports.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-800">Agendamentos Ativos</p>
                    <p className="text-2xl font-bold text-green-600">
                      {reports.filter((r) => r.schedule?.enabled).length}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-800">Gerados Hoje</p>
                    <p className="text-2xl font-bold text-amber-600">12</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-amber-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-800">Exportações</p>
                    <p className="text-2xl font-bold text-purple-600">47</p>
                  </div>
                  <Download className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-blue-800">Uso de Relatórios (Últimos 30 dias)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <div className="flex h-full items-end justify-between gap-2">
                  {Array.from({ length: 30 }).map((_, i) => {
                    const height = Math.max(10, Math.random() * 100)
                    return (
                      <div
                        key={i}
                        className="bg-blue-500 rounded-t w-full min-h-[10px] transition-all duration-300 hover:bg-blue-600"
                        style={{ height: `${height}%` }}
                        title={`Dia ${i + 1}: ${Math.floor(height / 10)} relatórios`}
                      />
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Visualização do Relatório */}
      {selectedReport && reportData && (
        <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-blue-800">{selectedReport.name}</DialogTitle>
                  <DialogDescription>{selectedReport.description}</DialogDescription>
                </div>
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => exportReport("pdf")}>
                        <FileText className="h-4 w-4 mr-2" />
                        PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => exportReport("excel")}>
                        <FileText className="h-4 w-4 mr-2" />
                        Excel
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => exportReport("csv")}>
                        <FileText className="h-4 w-4 mr-2" />
                        CSV
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Enviar por Email
                  </Button>
                </div>
              </div>
            </DialogHeader>

            <ReportViewer data={reportData} report={selectedReport} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Componente para visualizar relatórios
function ReportViewer({ data, report }: { data: ReportData; report: Report }) {
  return (
    <div className="space-y-6">
      {/* Resumo */}
      {data.summary && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{data.summary.totalItems}</p>
              <p className="text-sm text-gray-600">Total de Itens</p>
            </CardContent>
          </Card>
          {data.summary.totalValue && (
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(data.summary.totalValue)}
                </p>
                <p className="text-sm text-gray-600">Valor Total</p>
              </CardContent>
            </Card>
          )}
          {data.summary.averageValue && (
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-amber-600">
                  {report.category === "financial"
                    ? new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(data.summary.averageValue)
                    : `${data.summary.averageValue.toFixed(1)}${report.category === "performance" ? "%" : ""}`}
                </p>
                <p className="text-sm text-gray-600">Média</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Tendências */}
      {data.summary?.trends && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tendências</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {data.summary.trends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
                  <div>
                    <p className="font-medium text-blue-800">{trend.label}</p>
                    <p className="text-2xl font-bold text-blue-600">{trend.value}</p>
                  </div>
                  <div className={`flex items-center ${trend.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                    <TrendingUp className={`h-4 w-4 mr-1 ${trend.change < 0 ? "rotate-180" : ""}`} />
                    <span className="text-sm font-medium">{Math.abs(trend.change)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gráficos */}
      {data.charts && data.charts.length > 0 && (
        <div className="space-y-4">
          {data.charts.map((chart, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-base">{chart.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartRenderer chart={chart} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tabela de Dados */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dados Detalhados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {data.headers.map((header, index) => (
                    <TableHead key={index}>{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.rows.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente para renderizar gráficos
function ChartRenderer({ chart }: { chart: any }) {
  if (chart.type === "pie") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative w-48 h-48">
          {/* Simulação de gráfico de pizza com CSS */}
          <div className="w-full h-full rounded-full bg-gradient-conic from-blue-500 via-green-500 via-amber-500 via-red-500 to-purple-500"></div>
          <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{chart.data.length}</p>
              <p className="text-sm text-gray-600">Categorias</p>
            </div>
          </div>
        </div>
        <div className="ml-8 space-y-2">
          {chart.data.map((item: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-sm">
                {item.name}: {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (chart.type === "bar") {
    return (
      <div className="h-64 flex items-end justify-between gap-4 p-4">
        {chart.data.map((item: any, index: number) => (
          <div key={index} className="flex flex-col items-center gap-2 flex-1">
            <div
              className="w-full rounded-t transition-all duration-300 hover:opacity-80"
              style={{
                height: `${(item.value / Math.max(...chart.data.map((d: any) => d.value))) * 200}px`,
                backgroundColor: item.color,
                minHeight: "20px",
              }}
            />
            <span className="text-xs text-center">{item.category}</span>
            <span className="text-xs font-medium">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(item.value)}
            </span>
          </div>
        ))}
      </div>
    )
  }

  if (chart.type === "line") {
    return (
      <div className="h-64 w-full">
        <div className="flex h-full items-end justify-between gap-1">
          {chart.data.map((item: any, index: number) => (
            <div key={index} className="flex flex-col items-center gap-1 flex-1">
              <div
                className="bg-blue-500 w-full rounded-sm transition-all duration-300 hover:bg-blue-600"
                style={{
                  height: `${(item.cpu / 100) * 200}px`,
                  minHeight: "5px",
                }}
              />
              <span className="text-xs">{item.day}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return <div className="h-64 flex items-center justify-center text-gray-500">Gráfico não suportado</div>
}

// Componente de formulário para criar relatórios
function ReportForm({ onSave }: { onSave: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "inventory" as Report["category"],
    type: "table" as Report["type"],
    schedule: {
      enabled: false,
      frequency: "weekly" as "daily" | "weekly" | "monthly",
      time: "08:00",
      recipients: [""],
    },
  })

  const handleSave = () => {
    if (!formData.name || !formData.description) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Relatório criado",
      description: "Novo relatório foi criado com sucesso.",
    })
    onSave()
  }

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nome do Relatório *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Ex: Inventário de Hardware"
          />
        </div>
        <div>
          <Label htmlFor="category">Categoria</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value as Report["category"] }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inventory">Inventário</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="financial">Financeiro</SelectItem>
              <SelectItem value="security">Segurança</SelectItem>
              <SelectItem value="compliance">Compliance</SelectItem>
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
          placeholder="Descrição do relatório"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Tipo de Visualização</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value as Report["type"] }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="table">Tabela</SelectItem>
              <SelectItem value="chart">Gráfico</SelectItem>
              <SelectItem value="dashboard">Dashboard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="frequency">Frequência</Label>
          <Select
            value={formData.schedule.frequency}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                schedule: { ...prev.schedule, frequency: value as "daily" | "weekly" | "monthly" },
              }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Diário</SelectItem>
              <SelectItem value="weekly">Semanal</SelectItem>
              <SelectItem value="monthly">Mensal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline">Cancelar</Button>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          Criar Relatório
        </Button>
      </div>
    </div>
  )
}
