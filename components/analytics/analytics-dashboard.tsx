"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, TrendingDown, Users, Eye, MousePointer, Clock, AlertTriangle, CheckCircle } from "lucide-react"
import { useAnalytics } from "./analytics-provider"

// Dados de exemplo para visualização
const sampleData = {
  pageViews: [
    { date: "2024-01-01", views: 120, uniqueUsers: 85 },
    { date: "2024-01-02", views: 150, uniqueUsers: 102 },
    { date: "2024-01-03", views: 180, uniqueUsers: 125 },
    { date: "2024-01-04", views: 220, uniqueUsers: 145 },
    { date: "2024-01-05", views: 250, uniqueUsers: 165 },
    { date: "2024-01-06", views: 280, uniqueUsers: 185 },
    { date: "2024-01-07", views: 300, uniqueUsers: 200 },
  ],
  userActions: [
    { action: "Cliques em Hardware", count: 450, percentage: 35 },
    { action: "Visualizações de Software", count: 320, percentage: 25 },
    { action: "Acessos a Relatórios", count: 180, percentage: 14 },
    { action: "Pesquisas", count: 210, percentage: 16 },
    { action: "Filtros Aplicados", count: 130, percentage: 10 },
  ],
  performance: [
    { metric: "LCP (Largest Contentful Paint)", value: 2.1, target: 2.5, unit: "s", status: "good" },
    { metric: "FID (First Input Delay)", value: 85, target: 100, unit: "ms", status: "good" },
    { metric: "CLS (Cumulative Layout Shift)", value: 0.08, target: 0.1, unit: "", status: "good" },
    { metric: "TTFB (Time to First Byte)", value: 180, target: 200, unit: "ms", status: "good" },
  ],
  topPages: [
    { page: "/dashboard", views: 1250, bounceRate: 15, avgTime: "4:32" },
    { page: "/hardware", views: 980, bounceRate: 22, avgTime: "3:45" },
    { page: "/software", views: 750, bounceRate: 18, avgTime: "3:12" },
    { page: "/reports", views: 650, bounceRate: 25, avgTime: "5:20" },
    { page: "/settings", views: 420, bounceRate: 35, avgTime: "2:15" },
  ],
  errors: [
    { type: "JavaScript Error", count: 12, trend: "down" },
    { type: "Network Error", count: 8, trend: "up" },
    { type: "Validation Error", count: 25, trend: "stable" },
    { type: "Permission Error", count: 5, trend: "down" },
  ],
  realTimeUsers: 47,
  totalSessions: 1250,
  avgSessionDuration: "6:45",
  conversionRate: 12.5,
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export const AnalyticsDashboard: React.FC = () => {
  const { trackEvent, isEnabled } = useAnalytics()
  const [timeRange, setTimeRange] = useState("7d")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    trackEvent("analytics_dashboard_viewed", { timeRange })
  }, [timeRange, trackEvent])

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range)
    trackEvent("analytics_time_range_changed", { range })
  }

  const getPerformanceColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-600"
      case "needs-improvement":
        return "text-yellow-600"
      case "poor":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-red-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-green-500" />
      default:
        return <div className="h-4 w-4" />
    }
  }

  if (!isEnabled) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Analytics Desabilitado</CardTitle>
          <CardDescription>
            O sistema de analytics está desabilitado. Habilite-o nas configurações para ver os dados.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header com controles */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-500">Análise detalhada do uso do sistema</p>
        </div>
        <div className="flex gap-2">
          {["24h", "7d", "30d", "90d"].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => handleTimeRangeChange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Online</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sampleData.realTimeUsers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> vs ontem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Sessões</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sampleData.totalSessions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8%</span> vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duração Média</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sampleData.avgSessionDuration}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15%</span> vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sampleData.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">-2%</span> vs período anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principais */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="behavior">Comportamento</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="errors">Erros</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Gráfico de visualizações de página */}
            <Card>
              <CardHeader>
                <CardTitle>Visualizações de Página</CardTitle>
                <CardDescription>Tendência de visualizações ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={sampleData.pageViews}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="views" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="uniqueUsers" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top páginas */}
            <Card>
              <CardHeader>
                <CardTitle>Páginas Mais Visitadas</CardTitle>
                <CardDescription>Ranking de páginas por visualizações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleData.topPages.map((page, index) => (
                    <div key={page.page} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{index + 1}</Badge>
                        <span className="font-medium">{page.page}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{page.views}</div>
                        <div className="text-xs text-gray-500">{page.avgTime}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Ações do usuário */}
            <Card>
              <CardHeader>
                <CardTitle>Ações dos Usuários</CardTitle>
                <CardDescription>Distribuição das principais ações</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sampleData.userActions}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {sampleData.userActions.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de barras das ações */}
            <Card>
              <CardHeader>
                <CardTitle>Volume de Ações</CardTitle>
                <CardDescription>Quantidade de cada tipo de ação</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sampleData.userActions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="action" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Métricas de performance */}
            <Card>
              <CardHeader>
                <CardTitle>Core Web Vitals</CardTitle>
                <CardDescription>Métricas essenciais de performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleData.performance.map((metric) => (
                    <div key={metric.metric} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{metric.metric}</span>
                        <div className="flex items-center space-x-2">
                          <span className={`font-bold ${getPerformanceColor(metric.status)}`}>
                            {metric.value}
                            {metric.unit}
                          </span>
                          {metric.status === "good" ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          )}
                        </div>
                      </div>
                      <Progress value={(metric.value / metric.target) * 100} className="h-2" />
                      <div className="text-xs text-gray-500">
                        Meta: {metric.target}
                        {metric.unit}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Gráfico de performance ao longo do tempo */}
            <Card>
              <CardHeader>
                <CardTitle>Tendência de Performance</CardTitle>
                <CardDescription>Evolução das métricas ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={sampleData.pageViews}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="views" stroke="#8884d8" name="Page Views" />
                    <Line type="monotone" dataKey="uniqueUsers" stroke="#82ca9d" name="Unique Users" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatório de Erros</CardTitle>
              <CardDescription>Monitoramento de erros e problemas do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sampleData.errors.map((error) => (
                  <div key={error.type} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <div>
                        <div className="font-medium">{error.type}</div>
                        <div className="text-sm text-gray-500">{error.count} ocorrências</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(error.trend)}
                      <Badge variant={error.count > 20 ? "destructive" : error.count > 10 ? "default" : "secondary"}>
                        {error.count}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
