"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  HardDrive,
  Network,
  Server,
  TrendingUp,
} from "lucide-react"

interface SystemMetrics {
  cpu: number
  memory: number
  disk: number
  network: number
  uptime: string
  activeConnections: number
  alerts: number
  lastUpdate: string
}

export function RealTimeDashboard() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0,
    uptime: "0d 0h 0m",
    activeConnections: 0,
    alerts: 0,
    lastUpdate: new Date().toLocaleTimeString(),
  })

  const [isConnected, setIsConnected] = useState(false)

  // Simular WebSocket connection
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        cpu: Math.floor(Math.random() * 100),
        memory: Math.floor(Math.random() * 100),
        disk: Math.floor(Math.random() * 100),
        network: Math.floor(Math.random() * 1000),
        uptime: "15d 8h 32m",
        activeConnections: Math.floor(Math.random() * 500),
        alerts: Math.floor(Math.random() * 5),
        lastUpdate: new Date().toLocaleTimeString(),
      })
      setIsConnected(true)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (value: number) => {
    if (value < 50) return "text-green-600"
    if (value < 80) return "text-yellow-600"
    return "text-red-600"
  }

  const getProgressColor = (value: number) => {
    if (value < 50) return "bg-green-500"
    if (value < 80) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-6">
      {/* Status de Conexão */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Sistema em Tempo Real</CardTitle>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-sm text-muted-foreground">{isConnected ? "Conectado" : "Desconectado"}</span>
            </div>
          </div>
          <CardDescription>
            Monitoramento em tempo real dos sistemas • Última atualização: {metrics.lastUpdate}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Métricas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.cpu}%</div>
            <Progress value={metrics.cpu} className="mt-2" />
            <p className={`text-xs mt-1 ${getStatusColor(metrics.cpu)}`}>
              {metrics.cpu < 50 ? "Normal" : metrics.cpu < 80 ? "Moderado" : "Alto"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memória</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.memory}%</div>
            <Progress value={metrics.memory} className="mt-2" />
            <p className={`text-xs mt-1 ${getStatusColor(metrics.memory)}`}>
              {metrics.memory < 50 ? "Normal" : metrics.memory < 80 ? "Moderado" : "Alto"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disco</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.disk}%</div>
            <Progress value={metrics.disk} className="mt-2" />
            <p className={`text-xs mt-1 ${getStatusColor(metrics.disk)}`}>
              {metrics.disk < 50 ? "Normal" : metrics.disk < 80 ? "Moderado" : "Alto"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rede</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.network} Mbps</div>
            <p className="text-xs text-muted-foreground mt-1">Tráfego atual</p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas e Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Alertas Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.alerts > 0 ? (
                Array.from({ length: metrics.alerts }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 bg-red-50 rounded-lg border border-red-200">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Servidor DB-01 - CPU Alto</p>
                      <p className="text-xs text-muted-foreground">Há 5 minutos</p>
                    </div>
                    <Badge variant="destructive">Crítico</Badge>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <p className="text-sm">Todos os sistemas funcionando normalmente</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informações do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Uptime</span>
                </div>
                <span className="text-sm font-medium">{metrics.uptime}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Conexões Ativas</span>
                </div>
                <span className="text-sm font-medium">{metrics.activeConnections}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Performance</span>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Excelente
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
