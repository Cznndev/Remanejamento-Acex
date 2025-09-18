"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Wand2,
  Clock,
  Users,
  BookOpen,
  MapPin,
  AlertTriangle,
  TrendingUp,
  Search,
  User,
  CheckSquare,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AlgorithmFactory } from "@/lib/algorithms/factory"
import { professoresMock, salasMock, horariosMock, disciplinasMock } from "@/lib/data/mock-data"
import type { ResultadoAlgoritmo, Conflito } from "@/lib/algorithms/types"
import { ApprovalService } from "@/lib/approval/approval-service"

// Dados expandidos de conflitos para demonstração
const conflitosIniciais: Conflito[] = [
  {
    id: 1,
    professor: "Maria Silva",
    turma: "9º Ano A",
    disciplina: "Matemática",
    motivo: "Ausência do professor - Licença médica",
    data: "2024-06-10",
    status: "Pendente",
    prioridade: 9,
    horario: {
      id: 1,
      inicio: "07:30",
      fim: "08:20",
      periodo: "1º Período",
      turno: "Manhã",
      diaSemana: "Segunda",
    },
    sala: "Sala 1",
  },
  {
    id: 2,
    professor: "João Pereira",
    turma: "7º Ano B",
    disciplina: "História",
    motivo: "Sala em manutenção - Problema elétrico",
    data: "2024-06-12",
    status: "Pendente",
    prioridade: 7,
    horario: {
      id: 2,
      inicio: "08:20",
      fim: "09:10",
      periodo: "2º Período",
      turno: "Manhã",
      diaSemana: "Terça",
    },
    sala: "Laboratório",
  },
  {
    id: 3,
    professor: "Ana Costa",
    turma: "8º Ano C",
    disciplina: "Ciências",
    motivo: "Evento escolar - Feira de Ciências",
    data: "2024-06-15",
    status: "Pendente",
    prioridade: 6,
    horario: {
      id: 3,
      inicio: "13:00",
      fim: "13:50",
      periodo: "1º Período",
      turno: "Tarde",
      diaSemana: "Sexta",
    },
    sala: "Sala 2",
  },
]

export default function RemanejamentoPage() {
  const [conflitos, setConflitos] = useState<Conflito[]>(conflitosIniciais)
  const [algoritmoSelecionado, setAlgoritmoSelecionado] = useState("otimizacao")
  const [executandoRemanejamento, setExecutandoRemanejamento] = useState(false)
  const [resultadoAlgoritmo, setResultadoAlgoritmo] = useState<ResultadoAlgoritmo | null>(null)
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [filtroPrioridade, setFiltroPrioridade] = useState("todas")
  const [busca, setBusca] = useState("")
  const [novoConflito, setNovoConflito] = useState({
    professor: "",
    turma: "",
    disciplina: "",
    motivo: "",
    data: "",
    prioridade: 5,
  })
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false)

  const { toast } = useToast()
  const approvalService = ApprovalService.getInstance()

  // Filtrar conflitos
  const conflitosFilterados = conflitos.filter((conflito) => {
    const matchStatus = filtroStatus === "todos" || conflito.status === filtroStatus
    const matchPrioridade =
      filtroPrioridade === "todas" ||
      (filtroPrioridade === "alta" && conflito.prioridade >= 8) ||
      (filtroPrioridade === "media" && conflito.prioridade >= 5 && conflito.prioridade < 8) ||
      (filtroPrioridade === "baixa" && conflito.prioridade < 5)
    const matchBusca =
      busca === "" ||
      conflito.professor.toLowerCase().includes(busca.toLowerCase()) ||
      conflito.turma.toLowerCase().includes(busca.toLowerCase()) ||
      conflito.disciplina.toLowerCase().includes(busca.toLowerCase()) ||
      conflito.motivo.toLowerCase().includes(busca.toLowerCase())

    return matchStatus && matchPrioridade && matchBusca
  })

  // Estatísticas
  const stats = {
    total: conflitos.length,
    pendentes: conflitos.filter((c) => c.status === "Pendente").length,
    resolvidos: conflitos.filter((c) => c.status === "Resolvido").length,
    emAnalise: conflitos.filter((c) => c.status === "Em Análise").length,
    altaPrioridade: conflitos.filter((c) => c.prioridade >= 8).length,
  }

  const executarRemanejamento = async () => {
    setExecutandoRemanejamento(true)
    setResultadoAlgoritmo(null)

    try {
      toast({
        title: "🚀 Iniciando Remanejamento Inteligente",
        description: `Analisando ${stats.pendentes} conflitos com algoritmo ${getAlgoritmoNome(algoritmoSelecionado)}`,
      })

      const algoritmoInstance = AlgorithmFactory.criarAlgoritmo(
        algoritmoSelecionado,
        professoresMock,
        salasMock,
        horariosMock,
        disciplinasMock,
      )

      const conflitosParaResolver = conflitos.filter((c) => c.status === "Pendente")
      const resultado = await algoritmoInstance.executar(conflitosParaResolver)

      setResultadoAlgoritmo(resultado)

      // Criar solicitações de aprovação para cada solução
      for (const solucao of resultado.solucoes) {
        const prioridade =
          solucao.conflito.prioridade >= 8 ? "alta" : solucao.conflito.prioridade >= 5 ? "media" : "baixa"

        await approvalService.criarSolicitacaoRemanejamento(
          solucao.conflito,
          {
            novoProfessor: solucao.novoProfessor?.nome,
            novaSala: solucao.novaSala?.nome,
            novoHorario: solucao.novoHorario?.periodo,
            justificativa: solucao.justificativa,
          },
          prioridade as "baixa" | "media" | "alta",
        )
      }

      // Atualizar status dos conflitos para "Em Análise"
      const conflitosAtualizados = conflitos.map((conflito) => {
        const solucaoEncontrada = resultado.solucoes.find((s) => s.conflito.id === conflito.id)
        if (solucaoEncontrada && conflito.status === "Pendente") {
          return { ...conflito, status: "Em Análise" as const }
        }
        return conflito
      })

      setConflitos(conflitosAtualizados)

      toast({
        title: "✅ Remanejamento Processado!",
        description: `${resultado.conflitosResolvidos} soluções enviadas para aprovação. Verifique a aba de Aprovações.`,
      })
    } catch (error) {
      toast({
        title: "❌ Erro no Remanejamento",
        description: "Ocorreu um erro durante o processo. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setExecutandoRemanejamento(false)
    }
  }

  const adicionarConflito = () => {
    if (
      !novoConflito.professor ||
      !novoConflito.turma ||
      !novoConflito.disciplina ||
      !novoConflito.motivo ||
      !novoConflito.data
    ) {
      toast({
        title: "❌ Campos Obrigatórios",
        description: "Preencha todos os campos para adicionar o conflito.",
        variant: "destructive",
      })
      return
    }

    const novoId = Math.max(...conflitos.map((c) => c.id)) + 1
    const conflito: Conflito = {
      id: novoId,
      professor: novoConflito.professor,
      turma: novoConflito.turma,
      disciplina: novoConflito.disciplina,
      motivo: novoConflito.motivo,
      data: novoConflito.data,
      status: "Pendente",
      prioridade: novoConflito.prioridade,
      horario: horariosMock[0], // Simplificado
      sala: "A definir",
    }

    setConflitos([...conflitos, conflito])
    setNovoConflito({
      professor: "",
      turma: "",
      disciplina: "",
      motivo: "",
      data: "",
      prioridade: 5,
    })
    setMostrandoFormulario(false)

    toast({
      title: "✅ Conflito Adicionado",
      description: `Novo conflito registrado para ${novoConflito.professor}`,
    })
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

  const getPrioridadeColor = (prioridade: number) => {
    if (prioridade >= 8) return "destructive"
    if (prioridade >= 5) return "secondary"
    return "outline"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendente":
        return "destructive"
      case "Em Análise":
        return "secondary"
      case "Resolvido":
        return "default"
      default:
        return "outline"
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Principal */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🔄 Remanejamento de Aulas</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Sistema inteligente para resolução de conflitos acadêmicos com aprovação
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setMostrandoFormulario(!mostrandoFormulario)}>
            <AlertTriangle className="mr-2 h-4 w-4" />
            Reportar Conflito
          </Button>
          <Button onClick={executarRemanejamento} disabled={executandoRemanejamento}>
            {executandoRemanejamento ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Executar Remanejamento
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.pendentes}</p>
                <p className="text-xs text-muted-foreground">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-yellow-600">{stats.emAnalise}</p>
                <p className="text-xs text-muted-foreground">Em Análise</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.resolvidos}</p>
                <p className="text-xs text-muted-foreground">Resolvidos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold text-orange-600">{stats.altaPrioridade}</p>
                <p className="text-xs text-muted-foreground">Alta Prioridade</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerta de Aprovação */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckSquare className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="font-medium text-blue-900 dark:text-blue-100">Sistema de Aprovação Ativo</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Remanejamentos serão enviados para aprovação antes da execução.
                <Button variant="link" className="p-0 h-auto text-blue-600 underline ml-1">
                  Verificar aprovações pendentes
                </Button>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulário de Novo Conflito */}
      {mostrandoFormulario && (
        <Card>
          <CardHeader>
            <CardTitle>📝 Reportar Novo Conflito</CardTitle>
            <CardDescription>Registre um novo conflito que precisa ser resolvido</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="professor">Professor</Label>
                <Input
                  id="professor"
                  value={novoConflito.professor}
                  onChange={(e) => setNovoConflito({ ...novoConflito, professor: e.target.value })}
                  placeholder="Nome do professor"
                />
              </div>
              <div>
                <Label htmlFor="turma">Turma</Label>
                <Input
                  id="turma"
                  value={novoConflito.turma}
                  onChange={(e) => setNovoConflito({ ...novoConflito, turma: e.target.value })}
                  placeholder="Ex: 9º Ano A"
                />
              </div>
              <div>
                <Label htmlFor="disciplina">Disciplina</Label>
                <Input
                  id="disciplina"
                  value={novoConflito.disciplina}
                  onChange={(e) => setNovoConflito({ ...novoConflito, disciplina: e.target.value })}
                  placeholder="Nome da disciplina"
                />
              </div>
              <div>
                <Label htmlFor="data">Data</Label>
                <Input
                  id="data"
                  type="date"
                  value={novoConflito.data}
                  onChange={(e) => setNovoConflito({ ...novoConflito, data: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="prioridade">Prioridade (1-10)</Label>
                <Input
                  id="prioridade"
                  type="number"
                  min="1"
                  max="10"
                  value={novoConflito.prioridade}
                  onChange={(e) => setNovoConflito({ ...novoConflito, prioridade: Number.parseInt(e.target.value) })}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="motivo">Motivo do Conflito</Label>
                <Textarea
                  id="motivo"
                  value={novoConflito.motivo}
                  onChange={(e) => setNovoConflito({ ...novoConflito, motivo: e.target.value })}
                  placeholder="Descreva o motivo do conflito..."
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button onClick={adicionarConflito}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Adicionar Conflito
            </Button>
            <Button variant="outline" onClick={() => setMostrandoFormulario(false)}>
              Cancelar
            </Button>
          </CardFooter>
        </Card>
      )}

      <Tabs defaultValue="conflitos" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="conflitos">📋 Conflitos Ativos</TabsTrigger>
          <TabsTrigger value="algoritmo">🤖 Configuração IA</TabsTrigger>
          <TabsTrigger value="resultados">📊 Resultados</TabsTrigger>
        </TabsList>

        <TabsContent value="conflitos" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por professor, turma, disciplina..."
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos Status</SelectItem>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Em Análise">Em Análise</SelectItem>
                    <SelectItem value="Resolvido">Resolvido</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filtroPrioridade} onValueChange={setFiltroPrioridade}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="alta">Alta (8-10)</SelectItem>
                    <SelectItem value="media">Média (5-7)</SelectItem>
                    <SelectItem value="baixa">Baixa (1-4)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Conflitos */}
          <Card>
            <CardHeader>
              <CardTitle>📋 Conflitos ({conflitosFilterados.length})</CardTitle>
              <CardDescription>Lista de conflitos que precisam ser resolvidos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conflitosFilterados.map((conflito) => (
                  <div key={conflito.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusColor(conflito.status)}>{conflito.status}</Badge>
                        <Badge variant={getPrioridadeColor(conflito.prioridade)}>
                          Prioridade {conflito.prioridade}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">{conflito.data}</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="font-medium">{conflito.professor}</p>
                          <p className="text-sm text-muted-foreground">Professor</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-500" />
                        <div>
                          <p className="font-medium">{conflito.turma}</p>
                          <p className="text-sm text-muted-foreground">Turma</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-purple-500" />
                        <div>
                          <p className="font-medium">{conflito.disciplina}</p>
                          <p className="text-sm text-muted-foreground">Disciplina</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-orange-500" />
                        <div>
                          <p className="font-medium">{conflito.sala}</p>
                          <p className="text-sm text-muted-foreground">Sala</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <p className="text-sm">
                        <span className="font-medium">Horário:</span> {conflito.horario.periodo} (
                        {conflito.horario.inicio} - {conflito.horario.fim}) - {conflito.horario.diaSemana}
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded p-3">
                      <p className="text-sm">
                        <span className="font-medium">Motivo:</span> {conflito.motivo}
                      </p>
                    </div>
                  </div>
                ))}

                {conflitosFilterados.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">Nenhum conflito encontrado</h3>
                    <p className="text-muted-foreground">
                      {busca || filtroStatus !== "todos" || filtroPrioridade !== "todas"
                        ? "Tente ajustar os filtros de busca"
                        : "Todos os conflitos foram resolvidos!"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="algoritmo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>🤖 Configuração do Algoritmo de IA</CardTitle>
              <CardDescription>Escolha e configure o algoritmo para resolução automática de conflitos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">Algoritmo de Remanejamento</Label>
                <Select value={algoritmoSelecionado} onValueChange={setAlgoritmoSelecionado}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="otimizacao">
                      <div className="flex flex-col">
                        <span className="font-medium">Otimização de Recursos</span>
                        <span className="text-sm text-muted-foreground">
                          Prioriza disponibilidade de professores e salas
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="prioridade">
                      <div className="flex flex-col">
                        <span className="font-medium">Prioridade de Disciplinas</span>
                        <span className="text-sm text-muted-foreground">Foca em disciplinas mais importantes</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="balanceamento">
                      <div className="flex flex-col">
                        <span className="font-medium">Balanceamento de Carga</span>
                        <span className="text-sm text-muted-foreground">Distribui carga de trabalho uniformemente</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="genetico">
                      <div className="flex flex-col">
                        <span className="font-medium">Algoritmo Genético</span>
                        <span className="text-sm text-muted-foreground">IA avançada para soluções otimizadas</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  ℹ️ Como funciona o {getAlgoritmoNome(algoritmoSelecionado)}
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {algoritmoSelecionado === "otimizacao" &&
                    "Este algoritmo analisa a disponibilidade de recursos (professores, salas, horários) e encontra a melhor combinação para resolver conflitos, priorizando a eficiência na alocação."}
                  {algoritmoSelecionado === "prioridade" &&
                    "Resolve conflitos baseado na importância das disciplinas, garantindo que matérias fundamentais tenham prioridade na alocação de recursos."}
                  {algoritmoSelecionado === "balanceamento" &&
                    "Distribui a carga de trabalho de forma equilibrada entre professores, evitando sobrecarga e garantindo uma distribuição justa."}
                  {algoritmoSelecionado === "genetico" &&
                    "Utiliza inteligência artificial avançada para encontrar soluções otimizadas através de múltiplas gerações de possibilidades, garantindo os melhores resultados."}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={executarRemanejamento}
                disabled={executandoRemanejamento || stats.pendentes === 0}
                className="w-full"
              >
                {executandoRemanejamento ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Executando {getAlgoritmoNome(algoritmoSelecionado)}...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Processar Remanejamento ({stats.pendentes} conflitos)
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="resultados" className="space-y-4">
          {resultadoAlgoritmo ? (
            <Card>
              <CardHeader>
                <CardTitle>📊 Resultado do {resultadoAlgoritmo.algoritmoUtilizado}</CardTitle>
                <CardDescription>Soluções enviadas para aprovação</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">{resultadoAlgoritmo.conflitosResolvidos}</div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">Soluções Geradas</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="text-3xl font-bold text-yellow-600">{resultadoAlgoritmo.conflitosResolvidos}</div>
                    <div className="text-sm text-yellow-700 dark:text-yellow-300">Aguardando Aprovação</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">{resultadoAlgoritmo.tempoExecucao}ms</div>
                    <div className="text-sm text-purple-700 dark:text-purple-300">Tempo de Processamento</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{resultadoAlgoritmo.scoreTotal}</div>
                    <div className="text-sm text-green-700 dark:text-green-300">Score de Qualidade</div>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-yellow-600" />
                    <h4 className="font-medium text-yellow-900 dark:text-yellow-100">Aprovação Necessária</h4>
                  </div>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                    As soluções foram enviadas para o sistema de aprovação. Acesse a página de
                    <Button variant="link" className="p-0 h-auto text-yellow-600 underline ml-1">
                      Aprovações
                    </Button>
                    para revisar e aprovar os remanejamentos.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Wand2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum resultado ainda</h3>
                <p className="text-muted-foreground mb-4">
                  Execute o remanejamento para gerar soluções que serão enviadas para aprovação
                </p>
                <Button onClick={executarRemanejamento} disabled={stats.pendentes === 0}>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Executar Remanejamento
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
