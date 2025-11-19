"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bot, Brain, Wrench, TrendingUp, Lightbulb } from "lucide-react"
import { Chatbot } from "./chatbot"

export function AutomationAIDashboard() {
  const [activeFeatures, setActiveFeatures] = useState({
    chatbot: true,
    anomalyDetection: true,
    predictiveMaintenance: false,
    resourceOptimization: true,
    upgradeSuggestions: true,
  })

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Chatbot Ativo</CardTitle>
            <Bot className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">24/7</div>
            <p className="text-xs text-blue-600">87 conversas hoje</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Anomalias Detectadas</CardTitle>
            <Brain className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">3</div>
            <p className="text-xs text-blue-600">Últimas 24h</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Otimizações</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">15%</div>
            <p className="text-xs text-blue-600">Melhoria de performance</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Sugestões IA</CardTitle>
            <Lightbulb className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">8</div>
            <p className="text-xs text-blue-600">Pendentes de análise</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principais */}
      <Tabs defaultValue="chatbot" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="chatbot" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Chatbot
          </TabsTrigger>
          <TabsTrigger value="anomaly" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Anomalias
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Manutenção
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Otimização
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Sugestões
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chatbot" className="space-y-4">
          <Chatbot />
        </TabsContent>

        <TabsContent value="anomaly" className="space-y-4">
          <AnomalyDetection />
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <PredictiveMaintenance />
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <ResourceOptimization />
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4">
          <UpgradeSuggestions />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Componente de Detecção de Anomalias
function AnomalyDetection() {
  const anomalies = [
    {
      id: 1,
      type: "CPU",
      severity: "high",
      description: "Uso anômalo de CPU no servidor DB-01",
      detected: "2 min atrás",
      confidence: 95,
      action: "Investigar processo consumindo recursos",
    },
    {
      id: 2,
      type: "Network",
      severity: "medium",
      description: "Tráfego de rede incomum detectado",
      detected: "15 min atrás",
      confidence: 78,
      action: "Monitorar conexões suspeitas",
    },
    {
      id: 3,
      type: "Disk",
      severity: "low",
      description: "Padrão de I/O diferente do habitual",
      detected: "1 hora atrás",
      confidence: 65,
      action: "Verificar aplicações de backup",
    },
  ]

  return (
    <div className="space-y-4">
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Detecção de Anomalias com IA</CardTitle>
          <CardDescription>
            Sistema de machine learning monitora padrões e detecta comportamentos anômalos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {anomalies.map((anomaly) => (
              <div
                key={anomaly.id}
                className="flex items-center justify-between p-4 rounded-lg border border-blue-100 bg-blue-50/30"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-600" />
                    <Badge
                      variant="outline"
                      className={
                        anomaly.severity === "high"
                          ? "border-red-200 text-red-700 bg-red-50"
                          : anomaly.severity === "medium"
                            ? "border-amber-200 text-amber-700 bg-amber-50"
                            : "border-blue-200 text-blue-700 bg-blue-50"
                      }
                    >
                      {anomaly.severity === "high" ? "Alto" : anomaly.severity === "medium" ? "Médio" : "Baixo"}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium text-blue-800">{anomaly.description}</p>
                    <p className="text-sm text-blue-600">
                      {anomaly.type} • {anomaly.detected} • Confiança: {anomaly.confidence}%
                    </p>
                    <p className="text-xs text-blue-500 mt-1">Ação sugerida: {anomaly.action}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-blue-200 text-blue-600">
                    Investigar
                  </Button>
                  <Button variant="outline" size="sm" className="border-blue-200 text-blue-600">
                    Ignorar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente de Manutenção Preditiva
function PredictiveMaintenance() {
  const predictions = [
    {
      id: 1,
      equipment: "Servidor Web-01",
      component: "Disco Rígido",
      probability: 85,
      timeframe: "7-14 dias",
      action: "Substituição preventiva recomendada",
      priority: "high",
    },
    {
      id: 2,
      equipment: "Switch Principal",
      component: "Fonte de Alimentação",
      probability: 65,
      timeframe: "30-45 dias",
      action: "Monitoramento intensivo",
      priority: "medium",
    },
    {
      id: 3,
      equipment: "Servidor Backup",
      component: "Ventilador",
      probability: 45,
      timeframe: "60-90 dias",
      action: "Limpeza e verificação",
      priority: "low",
    },
  ]

  return (
    <div className="space-y-4">
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Manutenção Preditiva</CardTitle>
          <CardDescription>IA analisa padrões de uso e prevê necessidades de manutenção</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {predictions.map((prediction) => (
              <div
                key={prediction.id}
                className="flex items-center justify-between p-4 rounded-lg border border-blue-100 bg-blue-50/30"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-blue-600" />
                    <Badge
                      variant="outline"
                      className={
                        prediction.priority === "high"
                          ? "border-red-200 text-red-700 bg-red-50"
                          : prediction.priority === "medium"
                            ? "border-amber-200 text-amber-700 bg-amber-50"
                            : "border-blue-200 text-blue-700 bg-blue-50"
                      }
                    >
                      {prediction.priority === "high" ? "Alta" : prediction.priority === "medium" ? "Média" : "Baixa"}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium text-blue-800">
                      {prediction.equipment} - {prediction.component}
                    </p>
                    <p className="text-sm text-blue-600">
                      Probabilidade de falha: {prediction.probability}% em {prediction.timeframe}
                    </p>
                    <p className="text-xs text-blue-500 mt-1">{prediction.action}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-blue-200 text-blue-600">
                    Agendar
                  </Button>
                  <Button variant="outline" size="sm" className="border-blue-200 text-blue-600">
                    Detalhes
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente de Otimização de Recursos
function ResourceOptimization() {
  const optimizations = [
    {
      id: 1,
      type: "CPU",
      current: "75%",
      optimized: "45%",
      savings: "30%",
      action: "Redistribuir cargas de trabalho",
      impact: "Alto",
    },
    {
      id: 2,
      type: "Memória",
      current: "85%",
      optimized: "65%",
      savings: "20%",
      action: "Otimizar cache de aplicações",
      impact: "Médio",
    },
    {
      id: 3,
      type: "Rede",
      current: "60%",
      optimized: "40%",
      savings: "20%",
      action: "Balanceamento de tráfego",
      impact: "Médio",
    },
  ]

  return (
    <div className="space-y-4">
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Otimização de Recursos</CardTitle>
          <CardDescription>IA identifica oportunidades de otimização e melhoria de performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {optimizations.map((opt) => (
              <div
                key={opt.id}
                className="flex items-center justify-between p-4 rounded-lg border border-blue-100 bg-blue-50/30"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                      {opt.type}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium text-blue-800">
                      {opt.current} → {opt.optimized} (Economia: {opt.savings})
                    </p>
                    <p className="text-sm text-blue-600">Ação: {opt.action}</p>
                    <p className="text-xs text-blue-500 mt-1">Impacto: {opt.impact}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-blue-200 text-blue-600">
                    Aplicar
                  </Button>
                  <Button variant="outline" size="sm" className="border-blue-200 text-blue-600">
                    Simular
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente de Sugestões de Upgrade
function UpgradeSuggestions() {
  const suggestions = [
    {
      id: 1,
      category: "Hardware",
      item: "Servidor Web-01",
      suggestion: "Upgrade de RAM: 16GB → 32GB",
      benefit: "Melhoria de 40% na performance",
      cost: "R$ 2.500",
      priority: "high",
      roi: "6 meses",
    },
    {
      id: 2,
      category: "Software",
      item: "Sistema Operacional",
      suggestion: "Atualização para versão mais recente",
      benefit: "Melhor segurança e performance",
      cost: "R$ 800",
      priority: "medium",
      roi: "3 meses",
    },
    {
      id: 3,
      category: "Rede",
      item: "Switch Principal",
      suggestion: "Upgrade para Gigabit Ethernet",
      benefit: "10x mais velocidade de rede",
      cost: "R$ 5.000",
      priority: "medium",
      roi: "12 meses",
    },
  ]

  return (
    <div className="space-y-4">
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Sugestões de Upgrade</CardTitle>
          <CardDescription>IA analisa performance e sugere melhorias baseadas em dados históricos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="flex items-center justify-between p-4 rounded-lg border border-blue-100 bg-blue-50/30"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-blue-600" />
                    <Badge
                      variant="outline"
                      className={
                        suggestion.priority === "high"
                          ? "border-red-200 text-red-700 bg-red-50"
                          : "border-amber-200 text-amber-700 bg-amber-50"
                      }
                    >
                      {suggestion.priority === "high" ? "Alta" : "Média"}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium text-blue-800">
                      {suggestion.item} - {suggestion.suggestion}
                    </p>
                    <p className="text-sm text-blue-600">
                      {suggestion.benefit} • Custo: {suggestion.cost} • ROI: {suggestion.roi}
                    </p>
                    <p className="text-xs text-blue-500 mt-1">Categoria: {suggestion.category}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-blue-200 text-blue-600">
                    Aprovar
                  </Button>
                  <Button variant="outline" size="sm" className="border-blue-200 text-blue-600">
                    Analisar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
