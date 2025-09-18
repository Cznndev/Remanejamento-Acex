"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  BookOpen,
  MapPin,
  Wand2,
  Calendar,
  BarChart3,
  Activity,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"

// Dados simulados para o dashboard
const dashboardData = {
  conflitosHoje: 3,
  conflitosResolvidos: 12,
  conflitosTotal: 15,
  eficienciaAlgoritmo: 87,
  tempoMedioResolucao: 2.3,
  professoresAfetados: 8,
  turmasAfetadas: 11,
  salasRemanejadas: 6,
  ultimosRemanejamentos: [
    {
      id: 1,
      professor: "Maria Silva",
      disciplina: "Matemática",
      turma: "9º Ano A",
      status: "Resolvido",
      tempo: "2 min atrás",
      solucao: "Professor substituto: João Pereira",
    },
    {
      id: 2,
      professor: "Ana Costa",
      disciplina: "Ciências",
      turma: "8º Ano B",
      status: "Pendente",
      tempo: "15 min atrás",
      solucao: "Aguardando análise",
    },
    {
      id: 3,
      professor: "Carlos Santos",
      disciplina: "História",
      turma: "7º Ano C",
      status: "Resolvido",
      tempo: "1 hora atrás",
      solucao: "Nova sala: Sala 5",
    },
  ],
  alertasCriticos: [
    {
      id: 1,
      tipo: "Professor Ausente",
      descricao: "Maria Silva - Licença médica por 3 dias",
      prioridade: "Alta",
      afetados: "3 turmas",
    },
    {
      id: 2,
      tipo: "Sala Indisponível",
      descricao: "Laboratório - Manutenção elétrica",
      prioridade: "Média",
      afetados: "2 aulas",
    },
  ],
}

export default function DashboardRemanejamento() {
  const [horaAtual, setHoraAtual] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setHoraAtual(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const eficienciaColor =
    dashboardData.eficienciaAlgoritmo >= 80
      ? "text-green-600"
      : dashboardData.eficienciaAlgoritmo >= 60
        ? "text-yellow-600"
        : "text-red-600"

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Principal */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🎯 Dashboard de Remanejamento</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {horaAtual.toLocaleDateString("pt-BR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            - {horaAtual.toLocaleTimeString("pt-BR")}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/remanejamento">
            <Button>
              <Wand2 className="mr-2 h-4 w-4" />
              Executar Remanejamento
            </Button>
          </Link>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conflitos Hoje</p>
                <p className="text-3xl font-bold text-red-600">{dashboardData.conflitosHoje}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <div className="mt-2">
              <Badge variant="destructive" className="text-xs">
                Requer atenção
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolvidos</p>
                <p className="text-3xl font-bold text-green-600">{dashboardData.conflitosResolvidos}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">de {dashboardData.conflitosTotal} total</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Eficiência IA</p>
                <p className={`text-3xl font-bold ${eficienciaColor}`}>{dashboardData.eficienciaAlgoritmo}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                Algoritmo ativo
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tempo Médio</p>
                <p className="text-3xl font-bold text-purple-600">{dashboardData.tempoMedioResolucao}min</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">Por resolução</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas Críticos */}
      {dashboardData.alertasCriticos.length > 0 && (
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <AlertTriangle className="h-5 w-5" />🚨 Alertas Críticos
            </CardTitle>
            <CardDescription>Situações que requerem atenção imediata</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.alertasCriticos.map((alerta) => (
                <div
                  key={alerta.id}
                  className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={alerta.prioridade === "Alta" ? "destructive" : "secondary"}>
                        {alerta.prioridade}
                      </Badge>
                      <span className="font-medium">{alerta.tipo}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{alerta.descricao}</p>
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">Afeta: {alerta.afetados}</p>
                  </div>
                  <Link href="/remanejamento">
                    <Button size="sm" variant="outline">
                      Resolver
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Impacto do Remanejamento */}
        <Card>
          <CardHeader>
            <CardTitle>📊 Impacto do Remanejamento</CardTitle>
            <CardDescription>Recursos afetados pelos remanejamentos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Professores Afetados</p>
                    <p className="text-sm text-muted-foreground">Envolvidos em remanejamentos</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{dashboardData.professoresAfetados}</p>
                  <p className="text-xs text-muted-foreground">professores</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Turmas Afetadas</p>
                    <p className="text-sm text-muted-foreground">Com aulas remanejadas</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">{dashboardData.turmasAfetadas}</p>
                  <p className="text-xs text-muted-foreground">turmas</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="font-medium">Salas Remanejadas</p>
                    <p className="text-sm text-muted-foreground">Mudanças de local</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600">{dashboardData.salasRemanejadas}</p>
                  <p className="text-xs text-muted-foreground">salas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Últimos Remanejamentos */}
        <Card>
          <CardHeader>
            <CardTitle>⏱️ Atividade Recente</CardTitle>
            <CardDescription>Últimos remanejamentos processados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.ultimosRemanejamentos.map((remanejamento) => (
                <div key={remanejamento.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0 mt-1">
                    {remanejamento.status === "Resolvido" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{remanejamento.professor}</p>
                      <Badge
                        variant={remanejamento.status === "Resolvido" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {remanejamento.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {remanejamento.disciplina} - {remanejamento.turma}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">{remanejamento.solucao}</p>
                    <p className="text-xs text-muted-foreground mt-1">{remanejamento.tempo}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link href="/remanejamento">
                <Button variant="outline" className="w-full bg-transparent">
                  <Activity className="mr-2 h-4 w-4" />
                  Ver Todos os Remanejamentos
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>⚡ Ações Rápidas</CardTitle>
          <CardDescription>Acesso direto às funcionalidades principais</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/remanejamento">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                <Wand2 className="h-6 w-6" />
                <span className="text-sm">Executar Remanejamento</span>
              </Button>
            </Link>

            <Link href="/professores">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                <Users className="h-6 w-6" />
                <span className="text-sm">Gerenciar Professores</span>
              </Button>
            </Link>

            <Link href="/cronograma">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                <Calendar className="h-6 w-6" />
                <span className="text-sm">Ver Cronograma</span>
              </Button>
            </Link>

            <Link href="/relatorios">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                <BarChart3 className="h-6 w-6" />
                <span className="text-sm">Relatórios</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
