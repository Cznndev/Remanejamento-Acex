"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, CheckCircle, XCircle, AlertTriangle, Clock, Brain, MessageSquare, Target, RefreshCw } from "lucide-react"

interface TestCase {
  id: string
  name: string
  description: string
  input: string
  expectedCategory?: string
  expectedSentiment?: string
  minConfidence?: number
  status: "pending" | "running" | "passed" | "failed" | "warning"
  result?: {
    response: string
    category: string
    sentiment: string
    confidence: number
    responseTime: number
  }
}

export function AITestSuite() {
  const [testCases, setTestCases] = useState<TestCase[]>([
    {
      id: "auth-test",
      name: "Problema de Autenticação",
      description: "Teste de detecção de problemas de login",
      input: "Não consigo fazer login no sistema, aparece erro de senha inválida",
      expectedCategory: "authentication",
      expectedSentiment: "negative",
      minConfidence: 0.8,
      status: "pending",
    },
    {
      id: "hardware-test",
      name: "Problema de Hardware",
      description: "Teste de detecção de problemas de equipamento",
      input: "Meu computador está muito lento e travando constantemente",
      expectedCategory: "hardware",
      expectedSentiment: "negative",
      minConfidence: 0.75,
      status: "pending",
    },
    {
      id: "network-test",
      name: "Problema de Rede",
      description: "Teste de detecção de problemas de conectividade",
      input: "A internet está instável, fica caindo a conexão toda hora",
      expectedCategory: "network",
      expectedSentiment: "negative",
      minConfidence: 0.8,
      status: "pending",
    },
    {
      id: "positive-feedback",
      name: "Feedback Positivo",
      description: "Teste de detecção de sentimento positivo",
      input: "Obrigado pela ajuda, o problema foi resolvido perfeitamente!",
      expectedSentiment: "positive",
      minConfidence: 0.7,
      status: "pending",
    },
    {
      id: "complex-query",
      name: "Consulta Complexa",
      description: "Teste de resposta para problema complexo",
      input: "Preciso configurar uma VPN para acesso remoto ao banco de dados, mas está dando erro de certificado SSL",
      expectedCategory: "network",
      minConfidence: 0.6,
      status: "pending",
    },
  ])

  const [customTest, setCustomTest] = useState({
    input: "",
    expectedCategory: "authentication",
    expectedSentiment: "positive",
    minConfidence: 0.7,
  })

  const [isRunningAll, setIsRunningAll] = useState(false)

  // Simular teste de IA
  const runTest = async (testId: string) => {
    setTestCases((prev) => prev.map((test) => (test.id === testId ? { ...test, status: "running" } : test)))

    const test = testCases.find((t) => t.id === testId)
    if (!test) return

    // Simular processamento
    await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 3000))

    // Simular resposta da IA
    const mockResponse = {
      response: generateMockResponse(test.input),
      category: detectCategory(test.input),
      sentiment: detectSentiment(test.input),
      confidence: Math.random() * 0.3 + 0.7, // 0.7 - 1.0
      responseTime: Math.random() * 2 + 1, // 1-3 segundos
    }

    // Determinar status do teste
    let status: TestCase["status"] = "passed"

    if (test.expectedCategory && mockResponse.category !== test.expectedCategory) {
      status = "failed"
    } else if (test.expectedSentiment && mockResponse.sentiment !== test.expectedSentiment) {
      status = "failed"
    } else if (test.minConfidence && mockResponse.confidence < test.minConfidence) {
      status = "warning"
    }

    setTestCases((prev) =>
      prev.map((t) =>
        t.id === testId
          ? {
              ...t,
              status,
              result: mockResponse,
            }
          : t,
      ),
    )
  }

  const runAllTests = async () => {
    setIsRunningAll(true)

    // Reset todos os testes
    setTestCases((prev) => prev.map((test) => ({ ...test, status: "pending", result: undefined })))

    // Executar todos os testes
    for (const test of testCases) {
      await runTest(test.id)
    }

    setIsRunningAll(false)
  }

  const addCustomTest = () => {
    if (!customTest.input.trim()) return

    const newTest: TestCase = {
      id: `custom-${Date.now()}`,
      name: "Teste Personalizado",
      description: "Teste criado pelo usuário",
      input: customTest.input,
      expectedCategory: customTest.expectedCategory || undefined,
      expectedSentiment: customTest.expectedSentiment || undefined,
      minConfidence: customTest.minConfidence,
      status: "pending",
    }

    setTestCases((prev) => [...prev, newTest])
    setCustomTest({ input: "", expectedCategory: "authentication", expectedSentiment: "positive", minConfidence: 0.7 })
  }

  // Funções auxiliares para simular IA
  const generateMockResponse = (input: string): string => {
    const lowerInput = input.toLowerCase()

    if (lowerInput.includes("login") || lowerInput.includes("senha")) {
      return "Entendo que você está enfrentando problemas de autenticação. Vou ajudá-lo a resolver isso verificando primeiro se sua conta não está bloqueada e se a senha está correta."
    }

    if (lowerInput.includes("lento") || lowerInput.includes("travando")) {
      return "Vejo que seu computador está apresentando problemas de performance. Vamos executar alguns diagnósticos para identificar a causa e resolver o problema."
    }

    if (lowerInput.includes("internet") || lowerInput.includes("conexão") || lowerInput.includes("rede")) {
      return "Problemas de conectividade podem ter várias causas. Vou ajudá-lo a diagnosticar e resolver o problema de rede passo a passo."
    }

    if (lowerInput.includes("obrigado") || lowerInput.includes("resolvido")) {
      return "Fico feliz em saber que conseguimos resolver seu problema! Se precisar de mais alguma coisa, estarei aqui para ajudar."
    }

    return "Entendi sua solicitação e vou fazer o possível para ajudá-lo. Preciso de mais algumas informações para fornecer a melhor solução."
  }

  const detectCategory = (input: string): string => {
    const lowerInput = input.toLowerCase()

    if (lowerInput.includes("login") || lowerInput.includes("senha") || lowerInput.includes("acesso")) {
      return "authentication"
    }
    if (lowerInput.includes("computador") || lowerInput.includes("lento") || lowerInput.includes("travando")) {
      return "hardware"
    }
    if (
      lowerInput.includes("internet") ||
      lowerInput.includes("rede") ||
      lowerInput.includes("conexão") ||
      lowerInput.includes("vpn")
    ) {
      return "network"
    }
    if (lowerInput.includes("software") || lowerInput.includes("programa") || lowerInput.includes("aplicativo")) {
      return "software"
    }
    if (lowerInput.includes("banco") || lowerInput.includes("database") || lowerInput.includes("sql")) {
      return "database"
    }

    return "other"
  }

  const detectSentiment = (input: string): string => {
    const lowerInput = input.toLowerCase()

    const positiveWords = ["obrigado", "ótimo", "excelente", "funcionou", "resolvido", "perfeito"]
    const negativeWords = ["problema", "erro", "não funciona", "travando", "lento", "ruim"]

    if (positiveWords.some((word) => lowerInput.includes(word))) {
      return "positive"
    }
    if (negativeWords.some((word) => lowerInput.includes(word))) {
      return "negative"
    }

    return "neutral"
  }

  const getStatusIcon = (status: TestCase["status"]) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "running":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: TestCase["status"]) => {
    switch (status) {
      case "passed":
        return "border-green-200 bg-green-50"
      case "failed":
        return "border-red-200 bg-red-50"
      case "warning":
        return "border-yellow-200 bg-yellow-50"
      case "running":
        return "border-blue-200 bg-blue-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const testResults = testCases.filter((t) => t.result)
  const passedTests = testResults.filter((t) => t.status === "passed").length
  const failedTests = testResults.filter((t) => t.status === "failed").length
  const warningTests = testResults.filter((t) => t.status === "warning").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="h-6 w-6 text-blue-600" />
            Suite de Testes da IA
          </h2>
          <p className="text-gray-600">Validação automática das capacidades da inteligência artificial</p>
        </div>
        <Button onClick={runAllTests} disabled={isRunningAll} className="bg-blue-600 hover:bg-blue-700">
          {isRunningAll ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Executando...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Executar Todos
            </>
          )}
        </Button>
      </div>

      {/* Resumo dos resultados */}
      {testResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-2xl font-bold text-green-600">{passedTests}</div>
                  <div className="text-sm text-gray-600">Aprovados</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{warningTests}</div>
                  <div className="text-sm text-gray-600">Avisos</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <div>
                  <div className="text-2xl font-bold text-red-600">{failedTests}</div>
                  <div className="text-sm text-gray-600">Falharam</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {testResults.length > 0 ? Math.round((passedTests / testResults.length) * 100) : 0}%
                  </div>
                  <div className="text-sm text-gray-600">Taxa de Sucesso</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Criar teste personalizado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Criar Teste Personalizado
          </CardTitle>
          <CardDescription>Adicione seus próprios casos de teste para validar a IA</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Entrada do Usuário</label>
            <Textarea
              value={customTest.input}
              onChange={(e) => setCustomTest((prev) => ({ ...prev, input: e.target.value }))}
              placeholder="Digite a mensagem que será enviada para a IA..."
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Categoria Esperada</label>
              <Select
                value={customTest.expectedCategory}
                onValueChange={(value) => setCustomTest((prev) => ({ ...prev, expectedCategory: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Opcional" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="authentication">Autenticação</SelectItem>
                  <SelectItem value="hardware">Hardware</SelectItem>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="network">Rede</SelectItem>
                  <SelectItem value="database">Banco de Dados</SelectItem>
                  <SelectItem value="other">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Sentimento Esperado</label>
              <Select
                value={customTest.expectedSentiment}
                onValueChange={(value) => setCustomTest((prev) => ({ ...prev, expectedSentiment: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Opcional" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="positive">Positivo</SelectItem>
                  <SelectItem value="neutral">Neutro</SelectItem>
                  <SelectItem value="negative">Negativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Confiança Mínima</label>
              <Select
                value={customTest.minConfidence.toString()}
                onValueChange={(value) =>
                  setCustomTest((prev) => ({ ...prev, minConfidence: Number.parseFloat(value) }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">50%</SelectItem>
                  <SelectItem value="0.6">60%</SelectItem>
                  <SelectItem value="0.7">70%</SelectItem>
                  <SelectItem value="0.8">80%</SelectItem>
                  <SelectItem value="0.9">90%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={addCustomTest} disabled={!customTest.input.trim()}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Adicionar Teste
          </Button>
        </CardContent>
      </Card>

      {/* Lista de testes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Casos de Teste</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {testCases.map((test) => (
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
                    onClick={() => runTest(test.id)}
                    disabled={test.status === "running" || isRunningAll}
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
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Entrada:</div>
                    <div className="text-sm bg-white rounded border p-2">{test.input}</div>
                  </div>

                  {test.result && (
                    <div className="space-y-2">
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">Resposta da IA:</div>
                        <div className="text-sm bg-white rounded border p-2">{test.result.response}</div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="font-medium">Categoria:</span>
                          <Badge variant="outline" className="ml-2">
                            {test.result.category}
                          </Badge>
                          {test.expectedCategory && test.result.category !== test.expectedCategory && (
                            <div className="text-red-600 mt-1">Esperado: {test.expectedCategory}</div>
                          )}
                        </div>

                        <div>
                          <span className="font-medium">Sentimento:</span>
                          <Badge variant="outline" className="ml-2">
                            {test.result.sentiment}
                          </Badge>
                          {test.expectedSentiment && test.result.sentiment !== test.expectedSentiment && (
                            <div className="text-red-600 mt-1">Esperado: {test.expectedSentiment}</div>
                          )}
                        </div>

                        <div>
                          <span className="font-medium">Confiança:</span>
                          <span className="ml-2">{(test.result.confidence * 100).toFixed(1)}%</span>
                          {test.minConfidence && test.result.confidence < test.minConfidence && (
                            <div className="text-yellow-600 mt-1">Mínimo: {(test.minConfidence * 100).toFixed(0)}%</div>
                          )}
                        </div>

                        <div>
                          <span className="font-medium">Tempo:</span>
                          <span className="ml-2">{test.result.responseTime.toFixed(2)}s</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
