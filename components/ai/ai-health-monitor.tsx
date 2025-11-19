"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import {
  Activity,
  Brain,
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Zap,
  Clock,
  Target,
  RefreshCw,
} from "lucide-react"

interface HealthMetric {
  timestamp: Date
  responseTime: number
  successRate: number
  confidence: number
  memoryUsage: number
  cpuUsage: number
  activeConnections: number
}

export function AIHealthMonitor() {
  const [healthData, setHealthData] = useState<HealthMetric[]>([])
  const [currentStatus, setCurrentStatus] = useState({
    overall: "healthy",
    responseTime: 2.1,
    successRate: 95.3,
    confidence: 87.2,
    memoryUsage: 67,
    cpuUsage: 34,
    activeConnections: 23,
    lastUpdate: new Date(),
  })

  const [isMonitoring, setIsMonitoring] = useState(true)

  // Simular dados de saúde em tempo real
  useEffect(() => {
    const generateHealthData = () => {
      const now = new Date()
      const newMetric: HealthMetric = {
        timestamp: now,
        responseTime: Math.random() * 2 + 1.5,
        successRate: Math.random() * 10 + 90,
        confidence: Math.random() * 20 + 75,
        memoryUsage: Math.random() * 30 + 50,
        cpuUsage: Math.random() * 40 + 20,
        activeConnections: Math.floor(Math.random() * 50) + 10,
      }

      setHealthData((prev) => [...prev.slice(-19), newMetric])

      setCurrentStatus({
        overall: newMetric.successRate > 90 && newMetric.responseTime < 3 ? "healthy" : "warning",
        responseTime: newMetric.responseTime,
        successRate: newMetric.successRate,
        confidence: newMetric.confidence,
        memoryUsage: newMetric.memoryUsage,
        cpuUsage: newMetric.cpuUsage,
        activeConnections: newMetric.activeConnections,
        lastUpdate: now,
      })
    }

    // Gerar dados iniciais
    const initialData: HealthMetric[] = []
    for (let i = 19; i >= 0; i--) {
      const timestamp = new Date(Date.now() - i * 30000) // 30 segundos atrás
      initialData.push({
        timestamp,
        responseTime: Math.random() * 2 + 1.5,
        successRate: Math.random() * 10 + 90,
        confidence: Math.random() * 20 + 75,
        memoryUsage: Math.random() * 30 + 50,
        cpuUsage: Math.random() * 40 + 20,
        activeConnections: Math.floor(Math.random() * 50) + 10,
      })
    }
    setHealthData(initialData)

    const interval = setInterval(() => {
      if (isMonitoring) {
        generateHealthData()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [isMonitoring])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "critical":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Activity className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-50 border-green-200"
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "critical":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="h-6 w-6 text-blue-600" />
            Monitor de Saúde da IA
          </h2>
          <p className="text-gray-600">Monitoramento em tempo real do sistema de inteligência artificial</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={`${getStatusColor(currentStatus.overall)} border`}>
            {getStatusIcon(currentStatus.overall)}
            <span className="ml-2 capitalize">{currentStatus.overall}</span>
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={isMonitoring ? "border-green-200 text-green-600" : "border-gray-200"}
          >
            {isMonitoring ? (
              <>
                <Activity className="h-4 w-4 mr-2 animate-pulse" />
                Monitorando
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Pausado
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo de Resposta</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStatus.responseTime.toFixed(1)}s</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {currentStatus.responseTime < 2.5 ? (
                <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingUp className="h-3 w-3 text-red-500 mr-1" />
              )}
              Meta: &lt; 2.5s
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStatus.successRate.toFixed(1)}%</div>
            <Progress value={currentStatus.successRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confiança Média</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStatus.confidence.toFixed(1)}%</div>
            <Progress value={currentStatus.confidence} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conexões Ativas</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStatus.activeConnections}</div>
            <div className="text-xs text-muted-foreground">Atualizado: {formatTime(currentStatus.lastUpdate)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos de monitoramento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tempo de Resposta</CardTitle>
            <CardDescription>Últimos 10 minutos</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={(value) => formatTime(new Date(value))} />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) => formatTime(new Date(value))}
                  formatter={(value: number) => [`${value.toFixed(2)}s`, "Tempo de Resposta"]}
                />
                <Line type="monotone" dataKey="responseTime" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taxa de Sucesso</CardTitle>
            <CardDescription>Percentual de requisições bem-sucedidas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={(value) => formatTime(new Date(value))} />
                <YAxis domain={[80, 100]} />
                <Tooltip
                  labelFormatter={(value) => formatTime(new Date(value))}
                  formatter={(value: number) => [`${value.toFixed(1)}%`, "Taxa de Sucesso"]}
                />
                <Area type="monotone" dataKey="successRate" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Uso de Recursos</CardTitle>
            <CardDescription>CPU e Memória</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={(value) => formatTime(new Date(value))} />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) => formatTime(new Date(value))}
                  formatter={(value: number, name: string) => [
                    `${value.toFixed(1)}%`,
                    name === "cpuUsage" ? "CPU" : "Memória",
                  ]}
                />
                <Line type="monotone" dataKey="cpuUsage" stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="memoryUsage" stroke="#ef4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Confiança das Respostas</CardTitle>
            <CardDescription>Nível de confiança da IA</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={(value) => formatTime(new Date(value))} />
                <YAxis domain={[60, 100]} />
                <Tooltip
                  labelFormatter={(value) => formatTime(new Date(value))}
                  formatter={(value: number) => [`${value.toFixed(1)}%`, "Confiança"]}
                />
                <Area type="monotone" dataKey="confidence" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
