"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Shield,
  AlertTriangle,
  CheckCircle,
  Building2,
  Target,
  FileText,
  Calendar,
  Award,
  Zap,
  Eye,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface ExecutiveMetrics {
  riskScore: number
  financialImpact: {
    potentialLoss: number
    preventedLoss: number
    securityInvestment: number
    roi: number
  }
  businessContinuity: {
    uptime: number
    mttr: number // Mean Time To Recovery
    incidents: number
    slaCompliance: number
  }
  compliance: {
    overall: number
    frameworks: {
      lgpd: number
      iso27001: number
      sox: number
    }
    auditReadiness: number
  }
  threatLandscape: {
    level: "low" | "medium" | "high" | "critical"
    trends: "improving" | "stable" | "deteriorating"
    industryComparison: number
  }
}

interface BusinessRisk {
  id: string
  title: string
  impact: "low" | "medium" | "high" | "critical"
  probability: "low" | "medium" | "high"
  financialImpact: number
  businessArea: string
  mitigation: string
  timeline: string
}

interface IndustryBenchmark {
  metric: string
  ourValue: number
  industryAverage: number
  topQuartile: number
  unit: string
  trend: "up" | "down" | "stable"
}

export function ExecutiveDashboard() {
  const [metrics, setMetrics] = useState<ExecutiveMetrics>({
    riskScore: 0,
    financialImpact: {
      potentialLoss: 0,
      preventedLoss: 0,
      securityInvestment: 0,
      roi: 0,
    },
    businessContinuity: {
      uptime: 0,
      mttr: 0,
      incidents: 0,
      slaCompliance: 0,
    },
    compliance: {
      overall: 0,
      frameworks: {
        lgpd: 0,
        iso27001: 0,
        sox: 0,
      },
      auditReadiness: 0,
    },
    threatLandscape: {
      level: "low",
      trends: "stable",
      industryComparison: 0,
    },
  })

  const [businessRisks, setBusinessRisks] = useState<BusinessRisk[]>([])
  const [benchmarks, setBenchmarks] = useState<IndustryBenchmark[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadExecutiveData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Métricas executivas realistas
      const executiveMetrics: ExecutiveMetrics = {
        riskScore: 23, // Score de risco baixo (0-100, menor é melhor)
        financialImpact: {
          potentialLoss: 2400000, // R$ 2.4M em perdas potenciais evitadas
          preventedLoss: 890000, // R$ 890K em perdas efetivamente evitadas
          securityInvestment: 320000, // R$ 320K investidos em segurança
          roi: 278, // 278% de ROI em segurança
        },
        businessContinuity: {
          uptime: 99.87, // 99.87% de uptime
          mttr: 23, // 23 minutos de tempo médio de recuperação
          incidents: 3, // 3 incidentes críticos no trimestre
          slaCompliance: 98.5, // 98.5% de compliance com SLA
        },
        compliance: {
          overall: 94,
          frameworks: {
            lgpd: 97,
            iso27001: 91,
            sox: 89,
          },
          auditReadiness: 92,
        },
        threatLandscape: {
          level: "medium",
          trends: "improving",
          industryComparison: 15, // 15% melhor que a média do setor
        },
      }

      // Riscos de negócio prioritários
      const executiveRisks: BusinessRisk[] = [
        {
          id: "1",
          title: "Vazamento de Dados de Clientes",
          impact: "critical",
          probability: "low",
          financialImpact: 1200000,
          businessArea: "Operações",
          mitigation: "Implementação de DLP e criptografia avançada",
          timeline: "30 dias",
        },
        {
          id: "2",
          title: "Interrupção de Sistemas Críticos",
          impact: "high",
          probability: "medium",
          financialImpact: 450000,
          businessArea: "TI",
          mitigation: "Redundância de infraestrutura e DR aprimorado",
          timeline: "60 dias",
        },
        {
          id: "3",
          title: "Não Conformidade Regulatória",
          impact: "high",
          probability: "low",
          financialImpact: 800000,
          businessArea: "Compliance",
          mitigation: "Auditoria trimestral e automação de controles",
          timeline: "90 dias",
        },
        {
          id: "4",
          title: "Ataque de Ransomware",
          impact: "critical",
          probability: "medium",
          financialImpact: 2100000,
          businessArea: "Toda Organização",
          mitigation: "Backup imutável e treinamento de usuários",
          timeline: "45 dias",
        },
      ]

      // Benchmarks da indústria
      const industryBenchmarks: IndustryBenchmark[] = [
        {
          metric: "Tempo de Detecção de Ameaças",
          ourValue: 12,
          industryAverage: 287,
          topQuartile: 24,
          unit: "horas",
          trend: "up",
        },
        {
          metric: "Custo por Incidente",
          ourValue: 45000,
          industryAverage: 4350000,
          topQuartile: 1200000,
          unit: "R$",
          trend: "down",
        },
        {
          metric: "Taxa de Phishing Bem-sucedido",
          ourValue: 2.1,
          industryAverage: 11.9,
          topQuartile: 3.2,
          unit: "%",
          trend: "down",
        },
        {
          metric: "Disponibilidade de Sistemas",
          ourValue: 99.87,
          industryAverage: 99.5,
          topQuartile: 99.9,
          unit: "%",
          trend: "up",
        },
        {
          metric: "Conformidade Regulatória",
          ourValue: 94,
          industryAverage: 78,
          topQuartile: 95,
          unit: "%",
          trend: "up",
        },
      ]

      setMetrics(executiveMetrics)
      setBusinessRisks(executiveRisks)
      setBenchmarks(industryBenchmarks)
      setIsLoading(false)
    }

    loadExecutiveData()
  }, [])

  const getRiskColor = (score: number) => {
    if (score <= 25) return "text-green-600"
    if (score <= 50) return "text-amber-600"
    if (score <= 75) return "text-orange-600"
    return "text-red-600"
  }

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "critical":
        return <Badge className="bg-red-500">Crítico</Badge>
      case "high":
        return <Badge className="bg-orange-500">Alto</Badge>
      case "medium":
        return <Badge className="bg-amber-500">Médio</Badge>
      case "low":
        return <Badge className="bg-blue-500">Baixo</Badge>
      default:
        return <Badge variant="outline">{impact}</Badge>
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <div className="h-4 w-4" />
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const generateExecutiveReport = () => {
    toast({
      title: "Relatório Executivo Gerado",
      description: "Relatório mensal de segurança para diretoria foi criado com sucesso.",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard executivo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Executivo */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-blue-600">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl text-blue-800">Dashboard Executivo de Segurança</CardTitle>
                <CardDescription className="text-lg">
                  Visão estratégica de riscos e investimentos em segurança - ET & WICCA
                </CardDescription>
                <p className="text-sm text-gray-600 mt-1">
                  Última atualização: {new Date().toLocaleDateString("pt-BR")} às{" "}
                  {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={generateExecutiveReport} className="bg-blue-600 hover:bg-blue-700">
                <FileText className="h-4 w-4 mr-2" />
                Gerar Relatório
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* KPIs Principais */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Nível de Risco</p>
                <p className={`text-3xl font-bold ${getRiskColor(metrics.riskScore)}`}>{metrics.riskScore}/100</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" />
                  -8% vs trimestre anterior
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">ROI em Segurança</p>
                <p className="text-3xl font-bold text-blue-600">{metrics.financialImpact.roi}%</p>
                <p className="text-xs text-blue-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +23% vs ano anterior
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Disponibilidade</p>
                <p className="text-3xl font-bold text-green-600">{metrics.businessContinuity.uptime}%</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Meta: 99.5%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Conformidade</p>
                <p className="text-3xl font-bold text-purple-600">{metrics.compliance.overall}%</p>
                <p className="text-xs text-purple-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Acima da meta (90%)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Impacto Financeiro */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Impacto Financeiro da Segurança
            </CardTitle>
            <CardDescription>Análise de custos, benefícios e ROI dos investimentos em segurança</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-800">Perdas Evitadas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(metrics.financialImpact.preventedLoss)}
                  </p>
                  <p className="text-xs text-green-600">Últimos 12 meses</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-800">Investimento</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(metrics.financialImpact.securityInvestment)}
                  </p>
                  <p className="text-xs text-blue-600">Orçamento anual</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-800">Retorno sobre Investimento</p>
                  <Badge className="bg-green-500 text-white">Excelente</Badge>
                </div>
                <p className="text-3xl font-bold text-green-600">{metrics.financialImpact.roi}%</p>
                <p className="text-sm text-gray-600">
                  Para cada R$ 1 investido, economizamos R$ {(metrics.financialImpact.roi / 100 + 1).toFixed(2)}
                </p>
              </div>

              <Alert className="bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800">Risco Potencial</AlertTitle>
                <AlertDescription className="text-amber-700">
                  Exposição máxima estimada: {formatCurrency(metrics.financialImpact.potentialLoss)} em caso de
                  incidente crítico
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Benchmark da Indústria
            </CardTitle>
            <CardDescription>Comparação com padrões do setor de tecnologia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {benchmarks.map((benchmark, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{benchmark.metric}</p>
                    {getTrendIcon(benchmark.trend)}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <p className="font-bold text-blue-600">
                        {benchmark.ourValue}
                        {benchmark.unit}
                      </p>
                      <p className="text-gray-500">Nossa empresa</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-600">
                        {benchmark.industryAverage}
                        {benchmark.unit}
                      </p>
                      <p className="text-gray-500">Média do setor</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-green-600">
                        {benchmark.topQuartile}
                        {benchmark.unit}
                      </p>
                      <p className="text-gray-500">Top 25%</p>
                    </div>
                  </div>
                  <Progress
                    value={
                      benchmark.metric.includes("Custo") || benchmark.metric.includes("Tempo")
                        ? Math.max(0, 100 - (benchmark.ourValue / benchmark.industryAverage) * 100)
                        : (benchmark.ourValue / benchmark.topQuartile) * 100
                    }
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Executivas */}
      <Tabs defaultValue="risks" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="risks" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Riscos Críticos
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Conformidade
          </TabsTrigger>
          <TabsTrigger value="operations" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Operações
          </TabsTrigger>
          <TabsTrigger value="strategy" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Estratégia
          </TabsTrigger>
        </TabsList>

        <TabsContent value="risks">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Riscos Críticos de Negócio</CardTitle>
              <CardDescription>Principais riscos que requerem atenção executiva</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {businessRisks.map((risk) => (
                  <div key={risk.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{risk.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">Área: {risk.businessArea}</p>
                      </div>
                      <div className="flex gap-2">
                        {getImpactBadge(risk.impact)}
                        <Badge variant="outline">Prob: {risk.probability}</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-700">Impacto Financeiro</p>
                        <p className="text-lg font-bold text-red-600">{formatCurrency(risk.financialImpact)}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Mitigação</p>
                        <p className="text-gray-600">{risk.mitigation}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Prazo</p>
                        <p className="text-blue-600 font-medium">{risk.timeline}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Status de Conformidade</CardTitle>
                <CardDescription>Aderência a regulamentações e frameworks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">LGPD (Lei Geral de Proteção de Dados)</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-green-600">{metrics.compliance.frameworks.lgpd}%</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                  <Progress value={metrics.compliance.frameworks.lgpd} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="font-medium">ISO 27001 (Segurança da Informação)</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-600">{metrics.compliance.frameworks.iso27001}%</span>
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                    </div>
                  </div>
                  <Progress value={metrics.compliance.frameworks.iso27001} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="font-medium">SOX (Sarbanes-Oxley)</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-600">{metrics.compliance.frameworks.sox}%</span>
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </div>
                  </div>
                  <Progress value={metrics.compliance.frameworks.sox} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Prontidão para Auditoria</CardTitle>
                <CardDescription>Preparação para auditorias regulatórias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{metrics.compliance.auditReadiness}%</div>
                  <p className="text-gray-600">Prontidão Geral</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Documentação</span>
                    <Badge className="bg-green-500">Completa</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Controles Implementados</span>
                    <Badge className="bg-green-500">95%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Evidências de Teste</span>
                    <Badge className="bg-amber-500">Em Progresso</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Treinamento de Equipe</span>
                    <Badge className="bg-green-500">Concluído</Badge>
                  </div>
                </div>

                <Alert className="mt-4 bg-blue-50 border-blue-200">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-700">
                    Próxima auditoria externa agendada para Q3 2025
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operations">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Continuidade de Negócios</CardTitle>
                <CardDescription>Métricas operacionais críticas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800">Uptime</p>
                    <p className="text-2xl font-bold text-green-600">{metrics.businessContinuity.uptime}%</p>
                    <p className="text-xs text-green-600">Meta: 99.5%</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">MTTR</p>
                    <p className="text-2xl font-bold text-blue-600">{metrics.businessContinuity.mttr}min</p>
                    <p className="text-xs text-blue-600">Tempo médio de recuperação</p>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-lg">
                    <p className="text-sm font-medium text-amber-800">Incidentes</p>
                    <p className="text-2xl font-bold text-amber-600">{metrics.businessContinuity.incidents}</p>
                    <p className="text-xs text-amber-600">Críticos no trimestre</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm font-medium text-purple-800">SLA</p>
                    <p className="text-2xl font-bold text-purple-600">{metrics.businessContinuity.slaCompliance}%</p>
                    <p className="text-xs text-purple-600">Compliance</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Panorama de Ameaças</CardTitle>
                <CardDescription>Análise do cenário de segurança</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Nível de Ameaça Atual</span>
                    <Badge
                      className={
                        metrics.threatLandscape.level === "low"
                          ? "bg-green-500"
                          : metrics.threatLandscape.level === "medium"
                            ? "bg-amber-500"
                            : "bg-red-500"
                      }
                    >
                      {metrics.threatLandscape.level.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium">Tendência</span>
                    <div className="flex items-center gap-2">
                      <span className="capitalize text-green-600">{metrics.threatLandscape.trends}</span>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium">vs Média do Setor</span>
                    <span className="font-bold text-green-600">+{metrics.threatLandscape.industryComparison}%</span>
                  </div>

                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">
                      Nossa postura de segurança está {metrics.threatLandscape.industryComparison}% acima da média do
                      setor
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="strategy">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Recomendações Estratégicas</CardTitle>
              <CardDescription>Próximos passos para fortalecer a postura de segurança</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Investimentos Prioritários</h4>
                  <div className="space-y-3">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h5 className="font-medium">Zero Trust Architecture</h5>
                      <p className="text-sm text-gray-600">Investimento: R$ 180K | ROI esperado: 340%</p>
                      <p className="text-xs text-blue-600">Redução de 60% no risco de acesso não autorizado</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <h5 className="font-medium">AI/ML para Detecção de Ameaças</h5>
                      <p className="text-sm text-gray-600">Investimento: R$ 120K | ROI esperado: 280%</p>
                      <p className="text-xs text-green-600">Redução de 75% no tempo de detecção</p>
                    </div>
                    <div className="border-l-4 border-amber-500 pl-4">
                      <h5 className="font-medium">Treinamento Avançado de Usuários</h5>
                      <p className="text-sm text-gray-600">Investimento: R$ 45K | ROI esperado: 450%</p>
                      <p className="text-xs text-amber-600">Redução de 80% em incidentes de phishing</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Metas para 2025</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Reduzir risco geral para</span>
                      <Badge className="bg-green-500">≤ 15</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Aumentar uptime para</span>
                      <Badge className="bg-blue-500">99.95%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Conformidade LGPD</span>
                      <Badge className="bg-purple-500">100%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">ROI em segurança</span>
                      <Badge className="bg-amber-500">≥ 300%</Badge>
                    </div>
                  </div>

                  <Alert className="bg-blue-50 border-blue-200">
                    <Target className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-700">
                      Orçamento recomendado para 2025: R$ 420K (+31% vs 2024)
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
