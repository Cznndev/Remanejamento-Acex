"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, RefreshCw, Settings, Wand2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AlgorithmFactory } from "@/lib/algorithms/factory"
import { professoresMock, salasMock, horariosMock, disciplinasMock } from "@/lib/data/mock-data"
import type { ResultadoAlgoritmo } from "@/lib/algorithms/types"
import { WorkflowService } from "@/lib/workflow/workflow-service"
import { BackupService } from "@/lib/backup/backup-service"
import { NotificationService } from "@/lib/notifications/notification-service" // Import NotificationService
import { GoogleCalendarService } from "@/lib/integrations/google-calendar"

// Dados de exemplo
const conflitos = [
  {
    id: 1,
    professor: "Maria Silva",
    turma: "9º Ano A",
    disciplina: "Matemática",
    motivo: "Ausência do professor",
    data: "10/06/2024",
    status: "Pendente",
  },
  {
    id: 2,
    professor: "João Pereira",
    turma: "7º Ano B",
    disciplina: "História",
    motivo: "Sala em manutenção",
    data: "12/06/2024",
    status: "Resolvido",
  },
  {
    id: 3,
    professor: "Ana Costa",
    turma: "8º Ano C",
    disciplina: "Ciências",
    motivo: "Evento escolar",
    data: "15/06/2024",
    status: "Pendente",
  },
]

export default function Remanejamento() {
  const [algoritmo, setAlgoritmo] = useState("otimizacao")
  const [executandoRemanejamento, setExecutandoRemanejamento] = useState(false)
  const [conflitosAtualizados, setConflitosAtualizados] = useState(conflitos)
  const { toast } = useToast()
  const [resultadoAlgoritmo, setResultadoAlgoritmo] = useState<ResultadoAlgoritmo | null>(null)
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false)
  let notificationService: NotificationService

  try {
    notificationService = NotificationService.getInstance()
  } catch (error) {
    console.error("Failed to initialize NotificationService:", error)
    // Provide a fallback or alternative behavior if the service fails to initialize
    // For example, you could disable notifications or use a mock implementation
    notificationService = {
      notificarRemanejamento: async () => {
        console.warn("Notification service not available.")
      },
    } as any
  }

  const executarRemanejamento = async () => {
    setExecutandoRemanejamento(true)
    setResultadoAlgoritmo(null)

    const workflowService = WorkflowService.getInstance()
    const backupService = BackupService.getInstance()

    try {
      toast({
        title: "Iniciando remanejamento automático...",
        description: `Executando algoritmo: ${getAlgoritmoNome(algoritmo)}`,
      })

      // Cria o algoritmo selecionado
      const algoritmoInstance = AlgorithmFactory.criarAlgoritmo(
        algoritmo,
        professoresMock,
        salasMock,
        horariosMock,
        disciplinasMock,
      )

      // Converte conflitos para o formato esperado
      const conflitosComPrioridade = conflitosAtualizados.map((conflito) => ({
        ...conflito,
        prioridade: Math.floor(Math.random() * 10) + 1,
        horario: horariosMock[0], // Simplificado para o exemplo
      }))

      await backupService.criarSnapshotPreRemanejamento(
        `Remanejamento automático - ${getAlgoritmoNome(algoritmo)}`,
        "admin",
      )

      // Executa o algoritmo
      const resultado = await algoritmoInstance.executar(conflitosComPrioridade)
      setResultadoAlgoritmo(resultado)

      // Atualiza conflitos resolvidos
      const conflitosResolvidos = conflitosAtualizados.map((conflito) =>
        conflito.status === "Pendente" ? { ...conflito, status: "Resolvido" } : conflito,
      )
      setConflitosAtualizados(conflitosResolvidos)

      await workflowService.iniciarWorkflow(
        "remanejamento-automatico",
        {
          titulo: `Remanejamento ${getAlgoritmoNome(algoritmo)}`,
          remanejamento: {
            professor: "Sistema",
            disciplina: "Múltiplas",
            turma: "Múltiplas",
            data: new Date().toLocaleDateString("pt-BR"),
            horario: "Variados",
            sala: "Variadas",
            motivo: "Remanejamento automático",
          },
        },
        "admin",
      )

      // Notificar sobre os remanejamentos:
      for (const solucao of resultado.solucoes) {
        if (solucao.novoProfessor) {
          await notificationService.notificarRemanejamento({
            professor: solucao.conflito.professor,
            disciplina: solucao.conflito.disciplina,
            turma: solucao.conflito.turma,
            data: solucao.conflito.data,
            horario: "08:00-09:00", // Simplificado
            sala: "Sala 1", // Simplificado
            motivo: solucao.conflito.motivo,
            novoProfessor: solucao.novoProfessor.nome,
          })
        }
      }

      // Criar eventos no Google Calendar para cada remanejamento
      const calendarService = GoogleCalendarService.getInstance()
      const calendarStatus = calendarService.getIntegrationStatus()

      if (calendarStatus.isConnected) {
        for (const solucao of resultado.solucoes) {
          try {
            await calendarService.createRemanejamentoEvent({
              professor: solucao.novoProfessor?.nome || solucao.conflito.professor,
              disciplina: solucao.conflito.disciplina,
              turma: solucao.conflito.turma,
              data: solucao.conflito.data,
              horario: "08:00-09:00", // Simplificado
              sala: solucao.novaSala?.nome || "Sala 1", // Simplificado
              motivo: solucao.conflito.motivo,
            })
          } catch (error) {
            console.warn("Erro ao criar evento no Google Calendar:", error)
          }
        }
      }

      toast({
        title: "Remanejamento concluído!",
        description: `${resultado.conflitosResolvidos} conflitos resolvidos em ${resultado.tempoExecucao}ms. Score: ${resultado.scoreTotal}`,
      })
    } catch (error) {
      toast({
        title: "Erro no remanejamento",
        description: "Ocorreu um erro durante o processo. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setExecutandoRemanejamento(false)
    }
  }

  const getAlgoritmoNome = (tipo: string) => {
    const nomes = {
      otimizacao: "Otimização de Recursos",
      prioridade: "Prioridade de Disciplinas",
      balanceamento: "Balanceamento de Carga",
      genetico: "Algoritmo Genético",
    }
    return nomes[tipo as keyof typeof nomes] || "Otimização de Recursos"
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Remanejamento</h1>
        <Button>
          <RefreshCw className="mr-2 h-4 w-4" />
          Novo Remanejamento
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Conflitos Pendentes</CardTitle>
            <CardDescription>Aulas que precisam ser remanejadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Professor</TableHead>
                    <TableHead>Turma</TableHead>
                    <TableHead>Disciplina</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conflitosAtualizados.map((conflito) => (
                    <TableRow key={conflito.id}>
                      <TableCell className="font-medium">{conflito.professor}</TableCell>
                      <TableCell>{conflito.turma}</TableCell>
                      <TableCell>{conflito.disciplina}</TableCell>
                      <TableCell>{conflito.data}</TableCell>
                      <TableCell>
                        <Badge variant={conflito.status === "Pendente" ? "outline" : "secondary"}>
                          {conflito.status === "Pendente" ? (
                            <AlertCircle className="mr-1 h-3 w-3" />
                          ) : (
                            <CheckCircle className="mr-1 h-3 w-3" />
                          )}
                          {conflito.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Remanejamento Automático</CardTitle>
            <CardDescription>Configure e execute o remanejamento automático</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Algoritmo de Remanejamento</label>
                <Select value={algoritmo} onValueChange={setAlgoritmo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o algoritmo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="otimizacao">Otimização de Recursos</SelectItem>
                    <SelectItem value="prioridade">Prioridade de Disciplinas</SelectItem>
                    <SelectItem value="balanceamento">Balanceamento de Carga</SelectItem>
                    <SelectItem value="genetico">Algoritmo Genético</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Configurações</label>
                <Tabs defaultValue="basico">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basico">Básico</TabsTrigger>
                    <TabsTrigger value="avancado">Avançado</TabsTrigger>
                  </TabsList>
                  <TabsContent value="basico" className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Priorizar mesma disciplina</span>
                      <div className="w-12 h-6 bg-primary rounded-full relative">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Manter mesmo professor</span>
                      <div className="w-12 h-6 bg-muted rounded-full relative">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Manter mesma sala</span>
                      <div className="w-12 h-6 bg-primary rounded-full relative">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="avancado" className="pt-4">
                    <Button variant="outline" className="w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      Configurações Avançadas
                    </Button>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={executarRemanejamento} disabled={executandoRemanejamento}>
              {executandoRemanejamento ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Executando Remanejamento...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Executar Remanejamento Automático
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Remanejamentos</CardTitle>
          <CardDescription>Últimos remanejamentos realizados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Turma</TableHead>
                  <TableHead>Aula Original</TableHead>
                  <TableHead>Aula Remanejada</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Realizado por</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>05/06/2024</TableCell>
                  <TableCell>7º Ano B</TableCell>
                  <TableCell>História - João P.</TableCell>
                  <TableCell>Geografia - Ana C.</TableCell>
                  <TableCell>Ausência do professor</TableCell>
                  <TableCell>Sistema (Automático)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>03/06/2024</TableCell>
                  <TableCell>9º Ano A</TableCell>
                  <TableCell>Matemática - Maria S.</TableCell>
                  <TableCell>Física - Carlos S.</TableCell>
                  <TableCell>Evento escolar</TableCell>
                  <TableCell>Admin</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>01/06/2024</TableCell>
                  <TableCell>8º Ano C</TableCell>
                  <TableCell>Ciências - Ana C.</TableCell>
                  <TableCell>Inglês - Fernanda L.</TableCell>
                  <TableCell>Sala em manutenção</TableCell>
                  <TableCell>Sistema (Automático)</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {resultadoAlgoritmo && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado do Algoritmo</CardTitle>
            <CardDescription>Detalhes da execução do {resultadoAlgoritmo.algoritmoUtilizado}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{resultadoAlgoritmo.conflitosResolvidos}</div>
                <div className="text-sm text-muted-foreground">Conflitos Resolvidos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{resultadoAlgoritmo.scoreTotal}</div>
                <div className="text-sm text-muted-foreground">Score Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{resultadoAlgoritmo.tempoExecucao}ms</div>
                <div className="text-sm text-muted-foreground">Tempo de Execução</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(resultadoAlgoritmo.scoreTotal / resultadoAlgoritmo.conflitosResolvidos || 0)}
                </div>
                <div className="text-sm text-muted-foreground">Score Médio</div>
              </div>
            </div>

            <Button variant="outline" onClick={() => setMostrarDetalhes(!mostrarDetalhes)} className="mb-4">
              {mostrarDetalhes ? "Ocultar" : "Mostrar"} Detalhes das Soluções
            </Button>

            {mostrarDetalhes && (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Conflito</TableHead>
                      <TableHead>Solução</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Justificativa</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resultadoAlgoritmo.solucoes.map((solucao, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{solucao.conflito.disciplina}</div>
                            <div className="text-muted-foreground">{solucao.conflito.turma}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {solucao.novoProfessor ? (
                            <div className="text-sm">
                              <div className="font-medium">Prof. {solucao.novoProfessor.nome}</div>
                              <div className="text-muted-foreground">Substituto</div>
                            </div>
                          ) : solucao.novaSala ? (
                            <div className="text-sm">
                              <div className="font-medium">{solucao.novaSala.nome}</div>
                              <div className="text-muted-foreground">Nova sala</div>
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground">Reagendamento</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={solucao.score >= 80 ? "default" : solucao.score >= 60 ? "secondary" : "outline"}
                          >
                            {solucao.score}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{solucao.justificativa}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
