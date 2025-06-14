"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, LineChart, PieChart, TrendingUp, TrendingDown, Activity } from "lucide-react"
import { AnalyticsService } from "@/lib/analytics/analytics-service"
import type { AnalyticsData } from "@/lib/analytics/analytics-service"

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [periodo, setPeriodo] = useState("6meses")
  const analyticsService = AnalyticsService.getInstance()

  useEffect(() => {
    carregarDados()
  }, [periodo])

  const carregarDados = async () => {
    setLoading(true)
    try {
      const analyticsData = await analyticsService.gerarRelatorioCompleto()
      setData(analyticsData)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Carregando analytics...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center p-8">
        <p>Erro ao carregar dados de analytics</p>
        <Button onClick={carregarDados} className="mt-4">
          Tentar novamente
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Analytics e Relatórios</h2>
          <p className="text-muted-foreground">Insights sobre remanejamentos e performance do sistema</p>
        </div>
        <Select value={periodo} onValueChange={setPeriodo}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1mes">Último mês</SelectItem>
            <SelectItem value="3meses">Últimos 3 meses</SelectItem>
            <SelectItem value="6meses">Últimos 6 meses</SelectItem>
            <SelectItem value="1ano">Último ano</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crescimento</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+{data.tendencias.crescimento}%</div>
            <p className="text-xs text-muted-foreground">vs. período anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Previsão Próximo Mês</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.tendencias.previsaoProximoMes}</div>
            <p className="text-xs text-muted-foreground">remanejamentos estimados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pior Dia</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.tendencias.piorDiaSemana}</div>
            <p className="text-xs text-muted-foreground">maior incidência</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Melhor Horário</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.tendencias.melhorHorario}</div>
            <p className="text-xs text-muted-foreground">menor conflitos</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="remanejamentos">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="remanejamentos">Remanejamentos</TabsTrigger>
          <TabsTrigger value="motivos">Motivos</TabsTrigger>
          <TabsTrigger value="disciplinas">Disciplinas</TabsTrigger>
          <TabsTrigger value="algoritmos">Algoritmos</TabsTrigger>
        </TabsList>

        <TabsContent value="remanejamentos">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Remanejamentos por Mês</CardTitle>
                <CardDescription>Evolução mensal dos remanejamentos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <LineChart className="h-32 w-32 text-muted-foreground" />
                </div>
                <div className="mt-4 space-y-2">
                  {data.remanejamentosPorMes.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{item.mes}</span>
                      <span className="font-medium">{item.quantidade}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Remanejamentos por Professor</CardTitle>
                <CardDescription>Professores com mais remanejamentos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <BarChart className="h-32 w-32 text-muted-foreground" />
                </div>
                <div className="mt-4 space-y-2">
                  {data.remanejamentosPorProfessor.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{item.professor}</span>
                      <span className="font-medium">{item.quantidade}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="motivos">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Motivos</CardTitle>
              <CardDescription>Principais causas de remanejamentos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="h-[300px] flex items-center justify-center">
                  <PieChart className="h-32 w-32 text-muted-foreground" />
                </div>
                <div className="space-y-4">
                  {data.remanejamentosPorMotivo.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{item.motivo}</span>
                        <span className="text-sm">{item.percentual}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${item.percentual}%` }}></div>
                      </div>
                      <div className="text-xs text-muted-foreground">{item.quantidade} ocorrências</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disciplinas">
          <Card>
            <CardHeader>
              <CardTitle>Remanejamentos por Disciplina</CardTitle>
              <CardDescription>Disciplinas mais afetadas por remanejamentos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="h-[300px] flex items-center justify-center">
                  <BarChart className="h-32 w-32 text-muted-foreground" />
                </div>
                <div className="space-y-3">
                  {data.remanejamentosPorDisciplina.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{item.disciplina}</div>
                        <div className="text-sm text-muted-foreground">{item.quantidade} remanejamentos</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{item.quantidade}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="algoritmos">
          <Card>
            <CardHeader>
              <CardTitle>Performance dos Algoritmos</CardTitle>
              <CardDescription>Comparação de eficiência dos algoritmos de remanejamento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {data.eficienciaAlgoritmos.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">{item.algoritmo}</h4>
                      <div className="flex gap-4 text-sm">
                        <span>
                          Score: <strong>{item.scoremedio}</strong>
                        </span>
                        <span>
                          Tempo: <strong>{item.tempoMedio}ms</strong>
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Score Médio</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: `${item.scoremedio}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Velocidade</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${Math.max(10, 100 - item.tempoMedio / 50)}%` }}
                          ></div>
                        </div>
                      </div>
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
