"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, TrendingDown, Users, Clock, CheckCircle, Target, Zap, Download, BarChart3 } from "lucide-react"
import { AdvancedAnalyticsService } from "@/lib/analytics/advanced-analytics"
import type { AnalyticsReport } from "@/lib/analytics/advanced-analytics"

const COLORS = ["#dc2626", "#ea580c", "#0ea5e9", "#10b981", "#f59e0b", "#8b5cf6"]

export function AdvancedExecutiveDashboard() {
  const [periodo, setPeriodo] = useState("30d")
  const [relatorio, setRelatorio] = useState<AnalyticsReport | null>(null)
  const [metricsRealtime, setMetricsRealtime] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const analyticsService = AdvancedAnalyticsService.getInstance()

  useEffect(() => {
    carregarDados()
    const interval = setInterval(carregarMetricsRealtime, 30000) // Atualizar a cada 30s
    return () => clearInterval(interval)
  }, [periodo])

  const carregarDados = async () => {
    setLoading(true)

    const fim = new Date()
    const inicio = new Date()

    switch (periodo) {
      case "7d":
        inicio.setDate(fim.getDate() - 7)
        break
      case "30d":
        inicio.setDate(fim.getDate() - 30)
        break
      case "90d":
        inicio.setDate(fim.getDate() - 90)
        break
      case "1y":
        inicio.setFullYear(fim.getFullYear() - 1)
        break
    }

    const novoRelatorio = analyticsService.generateReport(inicio, fim)
    setRelatorio(novoRelatorio)

    carregarMetricsRealtime()
    setLoading(false)
  }

  const carregarMetricsRealtime = () => {
    const metrics = analyticsService.getRealtimeMetrics()
    setMetricsRealtime(metrics)
  }

  const exportarRelatorio = () => {
    if (!relatorio) return

    const dataStr = JSON.stringify(relatorio, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = `relatorio-executivo-${new Date().toISOString().split("T")[0]}.json`
    link.click()

    URL.revokeObjectURL(url)
  }

  if (loading || !relatorio) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando dashboard executivo...</p>
        </div>
      </div>
    )
  }

  const kpis = [
    {
      title: "Remanejamentos",
      value: relatorio.metricas.totalRemanejamentos,
      change: "+12%",
      trend: "up",
      icon: BarChart3,
      color: "text-blue-600",
    },
    {
      title: "Taxa de Aprovação",
      value: `${relatorio.metricas.taxaAprovacao.toFixed(1)}%`,
      change: "+5%",
      trend: "up",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Tempo Médio",
      value: `${Math.round(relatorio.metricas.tempoMedioAprovacao / (1000 * 60 * 60))}h`,
      change: "-8%",
      trend: "down",
      icon: Clock,
      color: "text-orange-600",
    },
    {
      title: "Usuários Ativos",
      value: relatorio.metricas.usuariosAtivos,
      change: "+15%",
      trend: "up",
      icon: Users,
      color: "text-purple-600",
    },
  ]

  const eficienciaData = Object.entries(relatorio.metricas.eficienciaAlgoritmos).map(([nome, valor]) => ({
    nome: nome.charAt(0).toUpperCase() + nome.slice(1),
    eficiencia: Math.round(valor),
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📊 Dashboard Executivo</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Visão estratégica e métricas avançadas do sistema</p>
        </div>
        <div className="flex gap-2">
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
              <SelectItem value="1y">1 ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportarRelatorio}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas em Tempo Real */}
      {metricsRealtime && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-green-900 dark:text-green-100">Sistema Online</span>
              </div>
              <div className="flex gap-6 text-sm">
                <span className="text-green-800 dark:text-green-200">
                  Eventos 24h: <strong>{metricsRealtime.eventosUltimas24h}</strong>
                </span>
                <span className="text-green-800 dark:text-green-200">
                  Usuários Ativos: <strong>{metricsRealtime.usuariosAtivos}</strong>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPIs Principais */}
      <div className="grid gap-4 md:grid-cols-4">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                  <p className="text-3xl font-bold">{kpi.value}</p>
                  <div className="flex items-center mt-2">
                    {kpi.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${kpi.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                      {kpi.change}
                    </span>
                  </div>
                </div>
                <kpi.icon className={`h-8 w-8 ${kpi.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Insights Automáticos */}
      {relatorio.insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Insights Automáticos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {relatorio.insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <Target className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="tendencias" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tendencias">📈 Tendências</TabsTrigger>
          <TabsTrigger value="eficiencia">⚡ Eficiência</TabsTrigger>
          <TabsTrigger value="conflitos">🔄 Conflitos</TabsTrigger>
          <TabsTrigger value="comparativo">📊 Comparativo</TabsTrigger>
        </TabsList>

        <TabsContent value="tendencias" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Remanejamentos por Dia</CardTitle>
                <CardDescription>Evolução diária dos remanejamentos</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={relatorio.tendencias.remanejamentosPorDia}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="data" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="quantidade" stroke="#dc2626" fill="#dc2626" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Aprovações por Hora</CardTitle>
                <CardDescription>Distribuição de aprovações ao longo do dia</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={relatorio.tendencias.aprovacoesPorHora}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hora" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantidade" fill="#0ea5e9" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="eficiencia" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Eficiência dos Algoritmos</CardTitle>
                <CardDescription>Performance de cada algoritmo de IA</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={eficienciaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nome" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, "Eficiência"]} />
                    <Bar dataKey="eficiencia" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métricas de Performance</CardTitle>
                <CardDescription>Indicadores de qualidade do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Tempo Médio de Resposta</span>
                    <Badge variant="outline">{relatorio.metricas.tempoMedioResposta.toFixed(0)}ms</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Conflitos Resolvidos</span>
                    <Badge variant="default">{relatorio.metricas.conflitosResolvidos}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Taxa de Sucesso</span>
                    <Badge variant="secondary">{relatorio.metricas.taxaAprovacao.toFixed(1)}%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conflitos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conflitos Mais Frequentes</CardTitle>
              <CardDescription>Análise dos tipos de conflitos recorrentes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={relatorio.tendencias.conflitosRecorrentes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ tipo, percent }) => `${tipo} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="frequencia"
                    >
                      {relatorio.tendencias.conflitosRecorrentes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-3">
                  {relatorio.tendencias.conflitosRecorrentes.map((conflito, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">{conflito.tipo}</span>
                      </div>
                      <Badge variant="outline">{conflito.frequencia}x</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparativo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise Comparativa</CardTitle>
              <CardDescription>Comparação de métricas ao longo do tempo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Análise Comparativa</h3>
                <p className="text-muted-foreground">
                  Funcionalidade em desenvolvimento. Em breve você poderá comparar períodos e métricas.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
