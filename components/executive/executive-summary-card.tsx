"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react"

interface ExecutiveSummaryProps {
  title: string
  description: string
  metrics: {
    primary: {
      value: string | number
      label: string
      trend?: "up" | "down" | "stable"
      trendValue?: string
    }
    secondary?: {
      value: string | number
      label: string
      status?: "good" | "warning" | "critical"
    }[]
  }
  status: "excellent" | "good" | "warning" | "critical"
  recommendation?: string
}

export function ExecutiveSummaryCard({ title, description, metrics, status, recommendation }: ExecutiveSummaryProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "border-green-200 bg-green-50"
      case "good":
        return "border-blue-200 bg-blue-50"
      case "warning":
        return "border-amber-200 bg-amber-50"
      case "critical":
        return "border-red-200 bg-red-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "excellent":
        return <Badge className="bg-green-500">Excelente</Badge>
      case "good":
        return <Badge className="bg-blue-500">Bom</Badge>
      case "warning":
        return <Badge className="bg-amber-500">Atenção</Badge>
      case "critical":
        return <Badge className="bg-red-500">Crítico</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getSecondaryStatusIcon = (status?: string) => {
    switch (status) {
      case "good":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <Card className={`${getStatusColor(status)} border-2`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
          {getStatusBadge(status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Métrica Principal */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-3xl font-bold text-gray-900">{metrics.primary.value}</span>
              {getTrendIcon(metrics.primary.trend)}
            </div>
            <p className="text-sm font-medium text-gray-600">{metrics.primary.label}</p>
            {metrics.primary.trendValue && <p className="text-xs text-gray-500 mt-1">{metrics.primary.trendValue}</p>}
          </div>

          {/* Métricas Secundárias */}
          {metrics.secondary && metrics.secondary.length > 0 && (
            <div className="space-y-2">
              {metrics.secondary.map((metric, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{metric.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{metric.value}</span>
                    {getSecondaryStatusIcon(metric.status)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recomendação */}
          {recommendation && (
            <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
              <p className="text-xs font-medium text-gray-700 mb-1">Recomendação:</p>
              <p className="text-xs text-gray-600">{recommendation}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
