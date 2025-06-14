"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  Brain,
  MessageSquare,
  Calendar,
  Target,
  DollarSign,
  Activity,
} from "lucide-react"

interface ExecutiveMetrics {
  kpis: {
    eficienciaOperacional: number
    satisfacaoProfessores: number
    utilizacaoSalas: number
    custoRemanejamento: number
    tempoResolucao: number
    precisaoIA: number
  }
  tendencias: {
    remanejamentos: { periodo: string; valor: number; variacao: number }[]
    custos: { periodo: string; valor: number; variacao: number }[]
    satisfacao: { periodo: string; valor: number; variacao: number }[]
  }
  alertas: {
    id: string
    tipo: "critico" | "atencao" | "info"
    titulo: string
    descricao: string
    timestamp: Date
  }[]
  previsoes: {
    proximoMes: {
      remanejamentos: number
      custos: number
      riscoProfessores: string[]
    }
    proximoTrimestre: {
      tendencia: "crescimento" | "estabilidade" | "reducao"
      impacto: string
    }
  }
}

export function ExecutiveDashboard() {
  const [metrics, setMetrics] = useState<ExecutiveMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [periodo, setPeriodo] = useState("30d")
  const [visao, setVisao] = useState("geral")

  useEffect(() => {
    loadExecutiveMetrics()
  }, [periodo])

  const loadExecutiveMetrics = async () => {
    setLoading(true)

    // Simula carregamento de métricas executivas
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockMetrics: ExecutiveMetrics = {
      kpis: {
        eficienciaOperacional: 87.5,
        satisfacaoProfessores: 92.3,
        utilizacaoSalas: 78.9,
        custoRemanejamento: 1250.75,
        tempoResolucao: 12.5,
        precisaoIA: 94.2,
      },
      tendencias: {
        remanejamentos: [
          { periodo: "Jan", valor: 45, variacao: 12 },
          { periodo: "Fev", valor: 38, variacao: -15 },
          { periodo: "Mar", valor: 52, variacao: 37 },
          { periodo: "Abr", valor: 41, variacao: -21 },
          { periodo: "Mai", valor: 47, variacao: 15 },
          { periodo: "Jun", valor: 35, variacao: -26 },
        ],
        custos: [
          { periodo: "Jan", valor: 1850, variacao: 8 },
          { periodo: "Fev", valor: 1620, variacao: -12 },
          { periodo: "Mar", valor: 2100, variacao: 30 },
          { periodo: "Abr", valor: 1750, variacao: -17 },
          { periodo: "Mai", valor: 1950, variacao: 11 },
          { periodo: "Jun", valor: 1450, variacao: -26 },
        ],
        satisfacao: [
          { periodo: "Jan", valor: 89, variacao: 2 },
          { periodo: "Fev", valor: 91, variacao: 2 },
          { periodo: "Mar", valor: 88, variacao: -3 },
          { periodo: "Abr", valor: 93, variacao: 6 },
          { periodo: "Mai", valor: 92, variacao: -1 },
          { periodo: "Jun", valor: 94, variacao: 2 },
        ],
      },
      alertas: [
        {
          id: "1",
          tipo: "critico",
          titulo: "Alta probabilidade de ausência",
          descricao: "IA detectou 85% de chance de ausência de Maria Silva na segunda-feira",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        {
          id: "2",
          tipo: "atencao",
          titulo: "Utilização de sala baixa",
          descricao: "Laboratório de Informática com apenas 45% de utilização esta semana",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        },
        {
          id: "3",
          tipo: "info",
          titulo: "Novo recorde de eficiência",
          descricao: "Sistema resolveu 98% dos conflitos automaticamente hoje",
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        },
      ],
      previsoes: {
        proximoMes: {
          remanejamentos: 42,
          custos: 1680,
          riscoProfessores: ["Maria Silva", "João Pereira"],
        },
        proximoTrimestre: {
          tendencia: "reducao",
          impacto: "Redução de 15% nos remanejamentos com otimizações de IA",
        },
      },
    }

    setMetrics(mockMetrics)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Carregando métricas executivas...</p>
        </div>
      </div>
    )
  }

  if (!metrics) return null

  const getVariationIcon = (variacao: number) => {
    if (variacao > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (variacao < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Activity className="h-4 w-4 text-gray-600" />
  }

  const getVariationColor = (variacao: number) => {
    if (variacao > 0) return "text-green-600"
    if (variacao < 0) return "text-red-600"
    return "text-gray-600"
  }

  const getAlertIcon = (tipo: string) => {
    switch (tipo) {
      case "critico":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "atencao":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "info":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getAlertColor = (tipo: string) => {
    switch (tipo) {
      case "critico":
        return "destructive"
      case "atencao":
        return "secondary"
      case "info":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Dashboard Executivo</h2>
          <p className="text-muted-foreground">Visão estratégica e métricas de performance</p>
        </div>
        <div className="flex gap-2">
          <Select value={visao} onValueChange={setVisao}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Visão" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="geral">Geral</SelectItem>
              <SelectItem value="operacional">Operacional</SelectItem>
              <SelectItem value="financeiro">Financeiro</SelectItem>
              <SelectItem value="pedagogico">Pedagógico</SelectItem>
            </SelectContent>
          </Select>
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
              <SelectItem value="1y">Último ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eficiência Operacional</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.kpis.eficienciaOperacional}%</div>
            <Progress value={metrics.kpis.eficienciaOperacional} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Meta: 85%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfação Professores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.kpis.satisfacaoProfessores}%</div>
            <Progress value={metrics.kpis.satisfacaoProfessores} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Meta: 90%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilização Salas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.kpis.utilizacaoSalas}%</div>
            <Progress value={metrics.kpis.utilizacaoSalas} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Meta: 80%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custo Remanejamento</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {metrics.kpis.custoRemanejamento}</div>
            <p className="text-xs text-green-600 mt-1">-15% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Resolução</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.kpis.tempoResolucao}min</div>
            <p className="text-xs text-green-600 mt-1">-8% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precisão IA</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.kpis.precisaoIA}%</div>
            <Progress value={metrics.kpis.precisaoIA} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Meta: 90%</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tendencias">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tendencias">Tendências</TabsTrigger>
          <TabsTrigger value="alertas">Alertas</TabsTrigger>
          <TabsTrigger value="previsoes">Previsões</TabsTrigger>
          <TabsTrigger value="comparativo">Comparativo</TabsTrigger>
        </TabsList>

        <TabsContent value="tendencias">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Remanejamentos</CardTitle>
                <CardDescription>Evolução mensal dos remanejamentos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.tendencias.remanejamentos.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.periodo}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{item.valor}</span>
                        <div className={`flex items-center gap-1 ${getVariationColor(item.variacao)}`}>
                          {getVariationIcon(item.variacao)}
                          <span className="text-xs">{Math.abs(item.variacao)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Custos</CardTitle>
                <CardDescription>Evolução dos custos operacionais</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.tendencias.custos.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.periodo}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">R$ {item.valor}</span>
                        <div className={`flex items-center gap-1 ${getVariationColor(item.variacao)}`}>
                          {getVariationIcon(item.variacao)}
                          <span className="text-xs">{Math.abs(item.variacao)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Satisfação</CardTitle>
                <CardDescription>Índice de satisfação dos professores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.tendencias.satisfacao.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.periodo}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{item.valor}%</span>
                        <div className={`flex items-center gap-1 ${getVariationColor(item.variacao)}`}>
                          {getVariationIcon(item.variacao)}
                          <span className="text-xs">{Math.abs(item.variacao)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alertas">
          <Card>
            <CardHeader>
              <CardTitle>Alertas do Sistema</CardTitle>
              <CardDescription>Notificações importantes que requerem atenção</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.alertas.map((alerta) => (
                  <div key={alerta.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="mt-0.5">{getAlertIcon(alerta.tipo)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{alerta.titulo}</h4>
                        <Badge variant={getAlertColor(alerta.tipo)} className="text-xs">
                          {alerta.tipo}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{alerta.descricao}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alerta.timestamp.toLocaleString("pt-BR")}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Resolver
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="previsoes">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Previsões Próximo Mês</CardTitle>
                <CardDescription>Predições baseadas em IA e dados históricos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium">Remanejamentos Previstos</p>
                    <p className="text-sm text-muted-foreground">Baseado em padrões históricos</p>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{metrics.previsoes.proximoMes.remanejamentos}</div>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium">Custo Estimado</p>
                    <p className="text-sm text-muted-foreground">Economia de 12% prevista</p>
                  </div>
                  <div className="text-2xl font-bold text-green-600">R$ {metrics.previsoes.proximoMes.custos}</div>
                </div>

                <div className="space-y-2">
                  <p className="font-medium">Professores em Risco</p>
                  <div className="space-y-1">
                    {metrics.previsoes.proximoMes.riscoProfessores.map((professor, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm">{professor}</span>
                        <Badge variant="outline" className="text-xs">
                          Alto risco
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tendência Trimestral</CardTitle>
                <CardDescription>Projeção para os próximos 3 meses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingDown className="h-8 w-8 text-green-600" />
                    <span className="text-2xl font-bold text-green-600">
                      {metrics.previsoes.proximoTrimestre.tendencia === "reducao"
                        ? "Redução"
                        : metrics.previsoes.proximoTrimestre.tendencia === "crescimento"
                          ? "Crescimento"
                          : "Estabilidade"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{metrics.previsoes.proximoTrimestre.impacto}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">IA otimizando automaticamente</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-green-600" />
                    <span className="text-sm">WhatsApp reduzindo tempo resposta</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Google Calendar sincronizado</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparativo">
          <Card>
            <CardHeader>
              <CardTitle>Comparativo de Performance</CardTitle>
              <CardDescription>Antes vs Depois da implementação do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium">Antes do Sistema</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                      <span className="text-sm">Tempo médio resolução</span>
                      <span className="font-medium text-red-600">45 min</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                      <span className="text-sm">Conflitos não resolvidos</span>
                      <span className="font-medium text-red-600">25%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                      <span className="text-sm">Custo mensal</span>
                      <span className="font-medium text-red-600">R$ 3.200</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                      <span className="text-sm">Satisfação professores</span>
                      <span className="font-medium text-red-600">72%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Depois do Sistema</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span className="text-sm">Tempo médio resolução</span>
                      <span className="font-medium text-green-600">12.5 min</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span className="text-sm">Conflitos não resolvidos</span>
                      <span className="font-medium text-green-600">3%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span className="text-sm">Custo mensal</span>
                      <span className="font-medium text-green-600">R$ 1.250</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span className="text-sm">Satisfação professores</span>
                      <span className="font-medium text-green-600">92.3%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2">Impacto Geral</h4>
                <div className="grid gap-2 md:grid-cols-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">72%</div>
                    <div className="text-xs text-muted-foreground">Redução tempo</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">61%</div>
                    <div className="text-xs text-muted-foreground">Redução custos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">28%</div>
                    <div className="text-xs text-muted-foreground">Aumento satisfação</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
