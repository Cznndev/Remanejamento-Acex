"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Brain,
  Activity,
  Wifi,
  RefreshCw,
  Play,
  BarChart3,
  Timer,
  Target,
  Cpu,
  MemoryStick,
} from "lucide-react"

interface DiagnosticTest {
  id: string
  name: string
  description: string
  status: "pending" | "running" | "success" | "warning" | "error"
  duration?: number
  result?: any
  error?: string
  lastRun?: Date
}

interface AIMetrics {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  averageResponseTime: number
  averageConfidence: number
  tokensUsed: number
  modelsUsed: Record<string, number>
  categoriesDetected: Record<string, number>
  sentimentAnalysis: Record<string, number>
  escalationRate: number
  userSatisfaction: number
}

export function AIDiagnostics() {
  const [tests, setTests] = useState<DiagnosticTest[]>([
    {
      id: "api-connectivity",
      name: "Conectividade API",
      description: "Verifica conexão com provedores de IA",
      status: "pending",
    },
    {
      id: "model-availability",
      name: "Disponibilidade de Modelos",
      description: "Testa acesso aos modelos LLM",
      status: "pending",
    },
    {
      id: "context-memory",
      name: "Memória Contextual",
      description: "Verifica funcionamento da memória de contexto",
      status: "pending",
    },
    {
      id: "sentiment-analysis",
      name: "Análise de Sentimento",
      description: "Testa capacidade de análise emocional",
      status: "pending",
    },
    {
      id: "auto-escalation",
      name: "Auto-Escalação",
      description: "Verifica sistema de escalação automática",
      status: "pending",
    },
    {
      id: "knowledge-base",
      name: "Base de Conhecimento",
      description: "Testa acesso à base de conhecimento técnico",
      status: "pending",
    },
    {
      id: "response-quality",
      name: "Qualidade das Respostas",
      description: "Avalia precisão e relevância das respostas",
      status: "pending",
    },
    {
      id: "performance",
      name: "Performance Geral",
      description: "Mede tempo de resposta e uso de recursos",
      status: "pending",
    },
  ])

  const [isRunningTests, setIsRunningTests] = useState(false)
  const [metrics, setMetrics] = useState<AIMetrics>({
    totalRequests: 1247,
    successfulRequests: 1189,
    failedRequests: 58,
    averageResponseTime: 2.3,
    averageConfidence: 0.87,
    tokensUsed: 45230,
    modelsUsed: {
      "gpt-4": 456,
      "gpt-3.5-turbo": 623,
      "claude-3": 168,
    },
    categoriesDetected: {
      authentication: 234,
      hardware: 189,
      software: 298,
      network: 156,
      database: 87,
      other: 283,
    },
    sentimentAnalysis: {
      positive: 423,
      neutral: 567,
      negative: 257,
    },
    escalationRate: 12.5,
    userSatisfaction: 4.2,
  })

  const [realTimeStatus, setRealTimeStatus] = useState({
    aiOnline: true,
    activeConnections: 23,
    queuedRequests: 3,
    processingTime: 1.8,
    memoryUsage: 67,
    cpuUsage: 34,
    lastHealthCheck: new Date(),
  })

  // Simular testes de diagnóstico
  const runDiagnosticTest = async (testId: string): Promise<void> => {
    setTests((prev) =>
      prev.map((test) => (test.id === testId ? { ...test, status: "running", lastRun: new Date() } : test)),
    )

    const startTime = Date.now()

    // Simular diferentes cenários de teste
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 3000))

    const duration = Date.now() - startTime
    const success = Math.random() > 0.1 // 90% de sucesso

    let result: any = {}
    let status: DiagnosticTest["status"] = "success"
    let error: string | undefined

    switch (testId) {
      case "api-connectivity":
        if (success) {
          result = {
            openai: { status: "connected", latency: 120 },
            anthropic: { status: "connected", latency: 95 },
            groq: { status: "connected", latency: 78 },
          }
        } else {
          status = "error"
          error = "Falha na conexão com OpenAI API"
        }
        break

      case "model-availability":
        if (success) {
          result = {
            "gpt-4": { available: true, version: "gpt-4-0613" },
            "gpt-3.5-turbo": { available: true, version: "gpt-3.5-turbo-0613" },
            "claude-3": { available: true, version: "claude-3-sonnet" },
          }
        } else {
          status = "warning"
          error = "Modelo Claude-3 temporariamente indisponível"
        }
        break

      case "context-memory":
        result = {
          memoryRetention: success ? 95 : 67,
          contextAccuracy: success ? 92 : 71,
          conversationTracking: success ? "functional" : "degraded",
        }
        if (!success) {
          status = "warning"
          error = "Performance da memória contextual abaixo do esperado"
        }
        break

      case "sentiment-analysis":
        result = {
          accuracy: success ? 89 : 72,
          processingTime: success ? 0.3 : 0.8,
          supportedLanguages: ["pt-BR", "en-US"],
        }
        if (!success) {
          status = "warning"
          error = "Precisão da análise de sentimento reduzida"
        }
        break

      case "auto-escalation":
        result = {
          triggerAccuracy: success ? 94 : 78,
          escalationTime: success ? 1.2 : 3.5,
          falsePositives: success ? 3 : 12,
        }
        if (!success) {
          status = "warning"
          error = "Taxa de falsos positivos elevada"
        }
        break

      case "knowledge-base":
        result = {
          coverage: success ? 87 : 65,
          accuracy: success ? 91 : 74,
          updateFrequency: "daily",
        }
        if (!success) {
          status = "warning"
          error = "Base de conhecimento precisa de atualização"
        }
        break

      case "response-quality":
        result = {
          relevanceScore: success ? 88 : 71,
          completenessScore: success ? 85 : 68,
          clarityScore: success ? 92 : 76,
        }
        if (!success) {
          status = "warning"
          error = "Qualidade das respostas abaixo do padrão"
        }
        break

      case "performance":
        result = {
          averageResponseTime: success ? 2.1 : 4.8,
          throughput: success ? 45 : 23,
          errorRate: success ? 2.3 : 8.7,
        }
        if (!success) {
          status = "error"
          error = "Performance crítica - tempo de resposta elevado"
        }
        break
    }

    setTests((prev) =>
      prev.map((test) =>
        test.id === testId
          ? {
              ...test,
              status,
              duration,
              result,
              error,
            }
          : test,
      ),
    )
  }

  const runAllTests = async () => {
    setIsRunningTests(true)

    // Reset todos os testes
    setTests((prev) => prev.map((test) => ({ ...test, status: "pending", result: undefined, error: undefined })))

    // Executar testes em sequência
    for (const test of tests) {
      await runDiagnosticTest(test.id)
    }

    setIsRunningTests(false)
  }

  const getStatusIcon = (status: DiagnosticTest["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "running":
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: DiagnosticTest["status"]) => {
    switch (status) {
      case "success":
        return "border-green-200 bg-green-50"
      case "warning":
        return "border-yellow-200 bg-yellow-50"
      case "error":
        return "border-red-200 bg-red-50"
      case "running":
        return "border-blue-200 bg-blue-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  // Simular atualizações em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeStatus((prev) => ({
        ...prev,
        activeConnections: Math.floor(Math.random() * 50) + 10,
        queuedRequests: Math.floor(Math.random() * 10),
        processingTime: Math.random() * 3 + 0.5,
        memoryUsage: Math.floor(Math.random() * 30) + 50,
        cpuUsage: Math.floor(Math.random() * 40) + 20,
        lastHealthCheck: new Date(),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const overallHealth = () => {
    const completedTests = tests.filter((t) => t.status !== "pending" && t.status !== "running")
    if (completedTests.length === 0) return { status: "unknown", percentage: 0 }

    const successfulTests = completedTests.filter((t) => t.status === "success").length
    const warningTests = completedTests.filter((t) => t.status === "warning").length
    const errorTests = completedTests.filter((t) => t.status === "error").length

    const percentage = Math.round((successfulTests / completedTests.length) * 100)

    if (errorTests > 0) return { status: "error", percentage }
    if (warningTests > 0) return { status: "warning", percentage }
    return { status: "success", percentage }
  }

  const health = overallHealth()

  return (
    <div className="space-y-6">
      {/* Header com status geral */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Brain className="h-8 w-8 text-blue-600" />
            Diagnóstico da IA
          </h1>
          <p className="text-gray-600">Monitoramento e verificação do sistema de inteligência artificial</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">Status Geral</div>
            <div className="flex items-center gap-2">
              {health.status === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
              {health.status === "warning" && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
              {health.status === "error" && <XCircle className="h-5 w-5 text-red-500" />}
              {health.status === "unknown" && <Clock className="h-5 w-5 text-gray-400" />}
              <span className="font-medium">
                {health.status === "success"
                  ? "Funcionando"
                  : health.status === "warning"
                    ? "Atenção"
                    : health.status === "error"
                      ? "Problemas"
                      : "Não testado"}
              </span>
            </div>
          </div>
          <Button onClick={runAllTests} disabled={isRunningTests} className="bg-blue-600 hover:bg-blue-700">
            {isRunningTests ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Testando...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Executar Testes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Status em tempo real */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className={realTimeStatus.aiOnline ? "border-green-200" : "border-red-200"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status da IA</CardTitle>
            <Activity className={`h-4 w-4 ${realTimeStatus.aiOnline ? "text-green-600" : "text-red-600"}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeStatus.aiOnline ? "Online" : "Offline"}</div>
            <p className="text-xs text-muted-foreground">
              Última verificação: {realTimeStatus.lastHealthCheck.toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conexões Ativas</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeStatus.activeConnections}</div>
            <p className="text-xs text-muted-foreground">
              {realTimeStatus.queuedRequests} na fila • {realTimeStatus.processingTime.toFixed(1)}s médio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uso de Memória</CardTitle>
            <MemoryStick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeStatus.memoryUsage}%</div>
            <Progress value={realTimeStatus.memoryUsage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uso de CPU</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeStatus.cpuUsage}%</div>
            <Progress value={realTimeStatus.cpuUsage} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Tabs principais */}
      <Tabs defaultValue="tests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tests">Testes de Diagnóstico</TabsTrigger>
          <TabsTrigger value="metrics">Métricas de Performance</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
          <TabsTrigger value="logs">Logs da IA</TabsTrigger>
        </TabsList>

        <TabsContent value="tests" className="space-y-4">
          {health.percentage > 0 && (
            <Alert className={health.status === "success" ? "border-green-200" : "border-yellow-200"}>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Resultado dos Testes</AlertTitle>
              <AlertDescription>
                {health.percentage}% dos testes passaram com sucesso.{" "}
                {health.status === "warning" && "Alguns testes apresentaram avisos."}
                {health.status === "error" && "Alguns testes falharam e precisam de atenção."}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {tests.map((test) => (
              <Card key={test.id} className={`border ${getStatusColor(test.status)}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(test.status)}
                      <div>
                        <CardTitle className="text-base">{test.name}</CardTitle>
                        <CardDescription className="text-sm">{test.description}</CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => runDiagnosticTest(test.id)}
                      disabled={test.status === "running" || isRunningTests}
                    >
                      {test.status === "running" ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {test.duration && (
                    <div className="text-sm text-gray-600 mb-2">
                      Executado em {test.duration}ms
                      {test.lastRun && ` • ${test.lastRun.toLocaleTimeString()}`}
                    </div>
                  )}

                  {test.error && (
                    <Alert className="border-red-200 bg-red-50 mb-3">
                      <XCircle className="h-4 w-4" />
                      <AlertDescription className="text-red-800">{test.error}</AlertDescription>
                    </Alert>
                  )}

                  {test.result && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-700">Resultados:</div>
                      <div className="bg-white rounded border p-3 text-xs">
                        <pre className="whitespace-pre-wrap">{JSON.stringify(test.result, null, 2)}</pre>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Requisições
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Total</span>
                    <span className="font-medium">{metrics.totalRequests.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-green-600">Sucesso</span>
                    <span className="font-medium">{metrics.successfulRequests.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-red-600">Falhas</span>
                    <span className="font-medium">{metrics.failedRequests.toLocaleString()}</span>
                  </div>
                  <Progress value={(metrics.successfulRequests / metrics.totalRequests) * 100} className="mt-2" />
                  <div className="text-xs text-gray-500">
                    Taxa de sucesso: {((metrics.successfulRequests / metrics.totalRequests) * 100).toFixed(1)}%
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Tempo Médio</span>
                    <span className="font-medium">{metrics.averageResponseTime}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Confiança Média</span>
                    <span className="font-medium">{(metrics.averageConfidence * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Tokens Usados</span>
                    <span className="font-medium">{metrics.tokensUsed.toLocaleString()}</span>
                  </div>
                  <Progress value={metrics.averageConfidence * 100} className="mt-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Qualidade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Taxa de Escalação</span>
                    <span className="font-medium">{metrics.escalationRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Satisfação</span>
                    <span className="font-medium">{metrics.userSatisfaction}/5</span>
                  </div>
                  <Progress value={metrics.escalationRate} className="mt-2" />
                  <div className="text-xs text-gray-500">Meta: &lt; 15%</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Modelos Utilizados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(metrics.modelsUsed).map(([model, count]) => (
                    <div key={model} className="flex items-center justify-between">
                      <span className="text-sm">{model}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={(count / metrics.totalRequests) * 100} className="w-20" />
                        <span className="text-sm font-medium w-12 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Categorias Detectadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(metrics.categoriesDetected).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{category}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={(count / metrics.totalRequests) * 100} className="w-20" />
                        <span className="text-sm font-medium w-12 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Monitoramento em Tempo Real</CardTitle>
                <CardDescription>Atualizado a cada 5 segundos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-medium">Sistema Online</span>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Operacional
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Conexões Ativas</span>
                      <span className="font-medium">{realTimeStatus.activeConnections}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Requisições na Fila</span>
                      <span className="font-medium">{realTimeStatus.queuedRequests}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tempo de Processamento</span>
                      <span className="font-medium">{realTimeStatus.processingTime.toFixed(1)}s</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alertas e Notificações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle className="text-green-800">Sistema Estável</AlertTitle>
                    <AlertDescription className="text-green-700">
                      Todos os serviços estão funcionando normalmente
                    </AlertDescription>
                  </Alert>

                  {realTimeStatus.memoryUsage > 80 && (
                    <Alert className="border-yellow-200 bg-yellow-50">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle className="text-yellow-800">Uso de Memória Alto</AlertTitle>
                      <AlertDescription className="text-yellow-700">
                        Uso de memória em {realTimeStatus.memoryUsage}% - monitorar
                      </AlertDescription>
                    </Alert>
                  )}

                  {realTimeStatus.queuedRequests > 5 && (
                    <Alert className="border-orange-200 bg-orange-50">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle className="text-orange-800">Fila de Requisições</AlertTitle>
                      <AlertDescription className="text-orange-700">
                        {realTimeStatus.queuedRequests} requisições aguardando processamento
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logs da IA em Tempo Real</CardTitle>
              <CardDescription>Últimas atividades do sistema de inteligência artificial</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2 font-mono text-sm">
                  <div className="flex gap-3 p-2 hover:bg-gray-50 rounded">
                    <span className="text-gray-500">{new Date().toLocaleTimeString()}</span>
                    <span className="text-green-600">[INFO]</span>
                    <span>Sistema de IA inicializado com sucesso</span>
                  </div>
                  <div className="flex gap-3 p-2 hover:bg-gray-50 rounded">
                    <span className="text-gray-500">{new Date(Date.now() - 30000).toLocaleTimeString()}</span>
                    <span className="text-blue-600">[DEBUG]</span>
                    <span>Processando requisição para análise de sentimento</span>
                  </div>
                  <div className="flex gap-3 p-2 hover:bg-gray-50 rounded">
                    <span className="text-gray-500">{new Date(Date.now() - 60000).toLocaleTimeString()}</span>
                    <span className="text-green-600">[SUCCESS]</span>
                    <span>Resposta gerada com confiança de 94%</span>
                  </div>
                  <div className="flex gap-3 p-2 hover:bg-gray-50 rounded">
                    <span className="text-gray-500">{new Date(Date.now() - 90000).toLocaleTimeString()}</span>
                    <span className="text-yellow-600">[WARN]</span>
                    <span>Tempo de resposta acima do esperado: 4.2s</span>
                  </div>
                  <div className="flex gap-3 p-2 hover:bg-gray-50 rounded">
                    <span className="text-gray-500">{new Date(Date.now() - 120000).toLocaleTimeString()}</span>
                    <span className="text-blue-600">[INFO]</span>
                    <span>Auto-escalação ativada para ticket #1247</span>
                  </div>
                  <div className="flex gap-3 p-2 hover:bg-gray-50 rounded">
                    <span className="text-gray-500">{new Date(Date.now() - 150000).toLocaleTimeString()}</span>
                    <span className="text-green-600">[SUCCESS]</span>
                    <span>Contexto de conversa atualizado para usuário admin</span>
                  </div>
                  <div className="flex gap-3 p-2 hover:bg-gray-50 rounded">
                    <span className="text-gray-500">{new Date(Date.now() - 180000).toLocaleTimeString()}</span>
                    <span className="text-blue-600">[INFO]</span>
                    <span>Modelo GPT-4 selecionado para consulta complexa</span>
                  </div>
                  <div className="flex gap-3 p-2 hover:bg-gray-50 rounded">
                    <span className="text-gray-500">{new Date(Date.now() - 210000).toLocaleTimeString()}</span>
                    <span className="text-green-600">[SUCCESS]</span>
                    <span>Base de conhecimento atualizada com 15 novos artigos</span>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
