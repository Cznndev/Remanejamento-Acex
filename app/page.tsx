"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CalendarDays,
  Clock,
  Users,
  GraduationCap,
  Home,
  AlertCircle,
  TrendingUp,
  Download,
  Upload,
  RefreshCw,
  Database,
  FileText,
  Calendar,
  Bell,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react"
import { useState } from "react"

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false)

  const handleQuickAction = async (action: string) => {
    setIsLoading(true)
    // Simular ação
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    alert(`${action} executado com sucesso!`)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Última atualização: {new Date().toLocaleDateString("pt-BR")}
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Professores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +2 desde o último mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Turmas</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +1 desde o último mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Salas</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">Sem alterações</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conflitos Pendentes</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500 rotate-180" />
              -2 desde ontem
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Ações Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Acesso rápido às principais funcionalidades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2 hover:bg-red-50 hover:border-red-200"
                onClick={() => handleQuickAction("Exportar Dados")}
                disabled={isLoading}
              >
                <Download className="h-5 w-5 text-red-500" />
                <span className="text-xs">Exportar</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2 hover:bg-orange-50 hover:border-orange-200"
                onClick={() => handleQuickAction("Importar Dados")}
                disabled={isLoading}
              >
                <Upload className="h-5 w-5 text-orange-500" />
                <span className="text-xs">Importar</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2 hover:bg-blue-50 hover:border-blue-200"
                onClick={() => handleQuickAction("Sincronizar")}
                disabled={isLoading}
              >
                <RefreshCw className="h-5 w-5 text-blue-500" />
                <span className="text-xs">Sincronizar</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2 hover:bg-green-50 hover:border-green-200"
                onClick={() => handleQuickAction("Backup")}
                disabled={isLoading}
              >
                <Database className="h-5 w-5 text-green-500" />
                <span className="text-xs">Backup</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2 hover:bg-purple-50 hover:border-purple-200"
                onClick={() => handleQuickAction("Relatórios")}
                disabled={isLoading}
              >
                <FileText className="h-5 w-5 text-purple-500" />
                <span className="text-xs">Relatórios</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2 hover:bg-indigo-50 hover:border-indigo-200"
                onClick={() => handleQuickAction("Cronograma")}
                disabled={isLoading}
              >
                <Calendar className="h-5 w-5 text-indigo-500" />
                <span className="text-xs">Cronograma</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Atividades Recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Últimas ações realizadas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: "Professor João Silva adicionado",
                  time: "há 5 minutos",
                  type: "success",
                },
                {
                  action: "Turma 9º A remanejada para Sala 12",
                  time: "há 15 minutos",
                  type: "info",
                },
                {
                  action: "Horário de Matemática atualizado",
                  time: "há 30 minutos",
                  type: "warning",
                },
                {
                  action: "Backup automático realizado",
                  time: "há 1 hora",
                  type: "success",
                },
                {
                  action: "Relatório mensal gerado",
                  time: "há 2 horas",
                  type: "info",
                },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  {activity.type === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {activity.type === "info" && <Bell className="h-4 w-4 text-blue-500" />}
                  {activity.type === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Remanejamentos por Período */}
      <Tabs defaultValue="hoje">
        <TabsList>
          <TabsTrigger value="hoje">Hoje</TabsTrigger>
          <TabsTrigger value="semana">Esta Semana</TabsTrigger>
          <TabsTrigger value="mes">Este Mês</TabsTrigger>
        </TabsList>

        <TabsContent value="hoje" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Remanejamentos do Dia</CardTitle>
              <CardDescription>Aulas remanejadas para hoje</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    hora: "08:00 - 09:00",
                    professor: "Maria Silva",
                    turma: "9º Ano A",
                    disciplina: "Matemática",
                    sala: "Sala 12",
                    status: "confirmado",
                  },
                  {
                    hora: "10:00 - 11:00",
                    professor: "João Pereira",
                    turma: "7º Ano B",
                    disciplina: "História",
                    sala: "Sala 5",
                    status: "pendente",
                  },
                  {
                    hora: "14:00 - 15:00",
                    professor: "Ana Costa",
                    turma: "8º Ano C",
                    disciplina: "Ciências",
                    sala: "Laboratório",
                    status: "confirmado",
                  },
                ].map((aula, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">
                          {aula.hora} - {aula.disciplina}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Prof. {aula.professor} • {aula.turma} • {aula.sala}
                        </p>
                      </div>
                    </div>
                    <Badge variant={aula.status === "confirmado" ? "default" : "secondary"}>{aula.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="semana" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Remanejamentos da Semana</CardTitle>
              <CardDescription>Visão geral dos remanejamentos desta semana</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">12 remanejamentos programados</h3>
                <p className="text-muted-foreground">Para esta semana</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Remanejamentos do Mês</CardTitle>
              <CardDescription>Visão geral dos remanejamentos deste mês</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">42 remanejamentos programados</h3>
                <p className="text-muted-foreground">Para este mês</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Alertas Importantes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Alertas Importantes
          </CardTitle>
          <CardDescription>Notificações que requerem atenção</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                title: "Conflito de horário detectado",
                description: "Sala 8 tem duas aulas marcadas para 14:00",
                type: "error",
                action: "Resolver",
              },
              {
                title: "Professor ausente amanhã",
                description: "Maria Silva - substituição necessária",
                type: "warning",
                action: "Agendar",
              },
              {
                title: "Backup programado",
                description: "Backup automático será executado às 23:00",
                type: "info",
                action: "Visualizar",
              },
            ].map((alert, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {alert.type === "error" && <XCircle className="h-5 w-5 text-red-500" />}
                  {alert.type === "warning" && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                  {alert.type === "info" && <Bell className="h-5 w-5 text-blue-500" />}
                  <div>
                    <p className="text-sm font-medium">{alert.title}</p>
                    <p className="text-xs text-muted-foreground">{alert.description}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  {alert.action}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
