"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, TrendingUp, AlertTriangle, Zap, Target, BarChart3, Lightbulb } from "lucide-react"

interface Prediction {
  id: string
  type: "hardware" | "software" | "network" | "database"
  device: string
  prediction: string
  confidence: number
  timeframe: string
  severity: "low" | "medium" | "high"
  recommendation: string
}

interface AIInsight {
  title: string
  description: string
  impact: "positive" | "negative" | "neutral"
  confidence: number
}

export function PredictiveAnalytics() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    // Simular análise de IA
    const mockPredictions: Prediction[] = [
      {
        id: "1",
        type: "hardware",
        device: "Servidor Dell PowerEdge R740",
        prediction: "Falha de disco rígido prevista",
        confidence: 87,
        timeframe: "15-20 dias",
        severity: "high",
        recommendation: "Substituir disco rígido preventivamente",
      },
      {
        id: "2",
        type: "software",
        device: "Microsoft Office 365",
        prediction: "Licença expirará em breve",
        confidence: 95,
        timeframe: "7 dias",
        severity: "medium",
        recommendation: "Renovar licença antes do vencimento",
      },
      {
        id: "3",
        type: "network",
        device: "Switch Principal Cisco",
        prediction: "Sobrecarga de tráfego esperada",
        confidence: 73,
        timeframe: "5-10 dias",
        severity: "medium",
        recommendation: "Considerar upgrade de capacidade",
      },
    ]

    const mockInsights: AIInsight[] = [
      {
        title: "Otimização de Recursos",
        description: "Detectamos 23% de recursos subutilizados que podem ser realocados",
        impact: "positive",
        confidence: 82,
      },
      {
        title: "Padrão de Falhas",
        description: "Identificado padrão de falhas em equipamentos após 3 anos de uso",
        impact: "negative",
        confidence: 91,
      },
      {
        title: "Economia de Custos",
        description: "Possível economia de R$ 15.000/mês com otimização de licenças",
        impact: "positive",
        confidence: 76,
      },
    ]

    setPredictions(mockPredictions)
    setInsights(mockInsights)
  }, [])

  const runAnalysis = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
    }, 3000)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200"
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "low":
        return "bg-green-50 text-green-700 border-green-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "positive":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "negative":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Target className="h-4 w-4 text-blue-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <CardTitle>Análise Preditiva com IA</CardTitle>
            </div>
            <Button onClick={runAnalysis} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <Zap className="mr-2 h-4 w-4 animate-spin" />
                  Analisando...
                </>
              ) : (
                <>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Executar Análise
                </>
              )}
            </Button>
          </div>
          <CardDescription>Sistema de IA que analisa padrões e prevê problemas antes que aconteçam</CardDescription>
        </CardHeader>
      </Card>

      {/* Predições */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Predições de Falhas</CardTitle>
          <CardDescription>Problemas previstos com base em análise de dados históricos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {predictions.map((prediction) => (
              <div key={prediction.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium">{prediction.device}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{prediction.prediction}</p>
                  </div>
                  <Badge variant="outline" className={getSeverityColor(prediction.severity)}>
                    {prediction.severity === "high"
                      ? "Alto Risco"
                      : prediction.severity === "medium"
                        ? "Médio Risco"
                        : "Baixo Risco"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Confiança</p>
                    <div className="flex items-center gap-2">
                      <Progress value={prediction.confidence} className="flex-1" />
                      <span className="text-sm font-medium">{prediction.confidence}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Prazo Estimado</p>
                    <p className="text-sm font-medium">{prediction.timeframe}</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Lightbulb className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Recomendação</span>
                  </div>
                  <p className="text-sm text-blue-800">{prediction.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights de IA */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Insights Inteligentes</CardTitle>
          <CardDescription>Descobertas automáticas baseadas em análise de padrões</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {insights.map((insight, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  {getImpactIcon(insight.impact)}
                  <h4 className="font-medium">{insight.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Confiança</span>
                  <span className="text-sm font-medium">{insight.confidence}%</span>
                </div>
                <Progress value={insight.confidence} className="mt-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Métricas de Performance da IA */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Precisão do Modelo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">Baseado em 1.247 predições</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Problemas Evitados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Nos últimos 30 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Economia Estimada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 45.2K</div>
            <p className="text-xs text-muted-foreground">Em custos de manutenção</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
