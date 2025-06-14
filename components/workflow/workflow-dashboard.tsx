"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, XCircle, AlertCircle, Play } from "lucide-react"
import { WorkflowService } from "@/lib/workflow/workflow-service"
import type { WorkflowInstance } from "@/lib/workflow/types"

export function WorkflowDashboard() {
  const [workflows, setWorkflows] = useState<WorkflowInstance[]>([])
  const workflowService = WorkflowService.getInstance()

  useEffect(() => {
    const loadWorkflows = () => {
      const allWorkflows = workflowService.getWorkflows()
      setWorkflows(allWorkflows)
    }

    loadWorkflows()
    const interval = setInterval(loadWorkflows, 3000)

    return () => clearInterval(interval)
  }, [])

  const aprovar = async (workflowId: string, stepId: string) => {
    await workflowService.aprovarStep(workflowId, stepId, "Aprovado via dashboard")
    const updatedWorkflows = workflowService.getWorkflows()
    setWorkflows(updatedWorkflows)
  }

  const rejeitar = async (workflowId: string, stepId: string) => {
    await workflowService.rejeitarStep(workflowId, stepId, "Rejeitado via dashboard")
    const updatedWorkflows = workflowService.getWorkflows()
    setWorkflows(updatedWorkflows)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "concluido":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "aprovado":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejeitado":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "pendente":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "em_andamento":
        return <Play className="h-4 w-4 text-blue-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "concluido":
        return "default"
      case "aprovado":
        return "default"
      case "rejeitado":
        return "destructive"
      case "pendente":
        return "secondary"
      case "em_andamento":
        return "outline"
      default:
        return "secondary"
    }
  }

  const workflowsPendentes = workflows.filter((w) =>
    w.steps.some((s) => s.status === "pendente" && s.tipo === "aprovacao"),
  )

  const workflowsAtivos = workflows.filter((w) => w.status === "em_andamento" || w.status === "iniciado")

  const workflowsConcluidos = workflows.filter((w) => w.status === "concluido" || w.status === "rejeitado")

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pendentes Aprovação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflowsPendentes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflowsAtivos.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Concluídos Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflowsConcluidos.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pendentes">
        <TabsList>
          <TabsTrigger value="pendentes">Pendentes ({workflowsPendentes.length})</TabsTrigger>
          <TabsTrigger value="ativos">Ativos ({workflowsAtivos.length})</TabsTrigger>
          <TabsTrigger value="historico">Histórico ({workflowsConcluidos.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pendentes">
          <Card>
            <CardHeader>
              <CardTitle>Workflows Pendentes de Aprovação</CardTitle>
              <CardDescription>Workflows que precisam de sua aprovação</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Workflow</TableHead>
                    <TableHead>Solicitante</TableHead>
                    <TableHead>Step Atual</TableHead>
                    <TableHead>Prazo</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workflowsPendentes.map((workflow) => {
                    const stepPendente = workflow.steps.find((s) => s.status === "pendente" && s.tipo === "aprovacao")
                    return (
                      <TableRow key={workflow.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{workflow.titulo}</div>
                            <div className="text-sm text-muted-foreground">{workflow.tipo}</div>
                          </div>
                        </TableCell>
                        <TableCell>{workflow.solicitante}</TableCell>
                        <TableCell>
                          {stepPendente && (
                            <div className="flex items-center gap-2">
                              {getStatusIcon(stepPendente.status)}
                              {stepPendente.nome}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {stepPendente?.prazo && (
                            <span className="text-sm">{stepPendente.prazo.toLocaleString("pt-BR")}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => stepPendente && aprovar(workflow.id, stepPendente.id)}>
                              Aprovar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => stepPendente && rejeitar(workflow.id, stepPendente.id)}
                            >
                              Rejeitar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ativos">
          <Card>
            <CardHeader>
              <CardTitle>Workflows Ativos</CardTitle>
              <CardDescription>Workflows em andamento</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Workflow</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progresso</TableHead>
                    <TableHead>Criado em</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workflowsAtivos.map((workflow) => {
                    const stepsCompletos = workflow.steps.filter(
                      (s) => s.status === "concluido" || s.status === "aprovado",
                    ).length
                    const totalSteps = workflow.steps.length
                    const progresso = Math.round((stepsCompletos / totalSteps) * 100)

                    return (
                      <TableRow key={workflow.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{workflow.titulo}</div>
                            <div className="text-sm text-muted-foreground">{workflow.solicitante}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(workflow.status)}>
                            {getStatusIcon(workflow.status)}
                            <span className="ml-1">{workflow.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progresso}%` }}></div>
                            </div>
                            <span className="text-sm">{progresso}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{workflow.criadoEm.toLocaleString("pt-BR")}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historico">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Workflows</CardTitle>
              <CardDescription>Workflows concluídos e rejeitados</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Workflow</TableHead>
                    <TableHead>Status Final</TableHead>
                    <TableHead>Duração</TableHead>
                    <TableHead>Concluído em</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workflowsConcluidos.map((workflow) => {
                    const duracao = workflow.atualizadoEm.getTime() - workflow.criadoEm.getTime()
                    const duracaoMinutos = Math.round(duracao / (1000 * 60))

                    return (
                      <TableRow key={workflow.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{workflow.titulo}</div>
                            <div className="text-sm text-muted-foreground">{workflow.solicitante}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(workflow.status)}>
                            {getStatusIcon(workflow.status)}
                            <span className="ml-1">{workflow.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>{duracaoMinutos} min</TableCell>
                        <TableCell>{workflow.atualizadoEm.toLocaleString("pt-BR")}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
