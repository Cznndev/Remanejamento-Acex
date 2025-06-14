"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  Users,
  BookOpen,
  MessageSquare,
  ClipboardList,
  UserCheck,
  Plus,
  Filter,
  Download,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AcademicService } from "@/lib/academic/academic-service"
import { AddEventoModal } from "@/components/modals/add-evento-modal"
import type {
  CalendarioEscolar,
  Ausencia,
  Substituicao,
  PlanejamentoAula,
  Avaliacao,
  Comunicacao,
} from "@/lib/academic/types"

interface Evento {
  id: string
  titulo: string
  descricao: string
  tipo: string
  dataInicio: Date
  dataFim: Date
  cor: string
  turmas?: string[]
  todosDias: boolean
}

export default function GestaoAcademicaPage() {
  const [eventos, setEventos] = useState<CalendarioEscolar[]>([])
  const [eventosAdicionais, setEventosAdicionais] = useState<Evento[]>([])
  const [ausencias, setAusencias] = useState<Ausencia[]>([])
  const [substituicoes, setSubstituicoes] = useState<Substituicao[]>([])
  const [planejamentos, setPlanejamentos] = useState<PlanejamentoAula[]>([])
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])
  const [comunicacoes, setComunicacoes] = useState<Comunicacao[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddEventoModalOpen, setIsAddEventoModalOpen] = useState(false)

  const academicService = AcademicService.getInstance()

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventosData, ausenciasData, substituicoesData, planejamentosData, avaliacoesData, comunicacoesData] =
          await Promise.all([
            academicService.getEventosCalendario(),
            academicService.getAusencias(),
            academicService.getSubstituicoes(),
            academicService.getPlanejamentosAula(),
            academicService.getAvaliacoes(),
            academicService.getComunicacoes("user001"),
          ])

        setEventos(eventosData)
        setAusencias(ausenciasData)
        setSubstituicoes(substituicoesData)
        setPlanejamentos(planejamentosData)
        setAvaliacoes(avaliacoesData)
        setComunicacoes(comunicacoesData)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const getStatusColor = (status: string) => {
    const colors = {
      pendente: "bg-yellow-100 text-yellow-800",
      aprovada: "bg-green-100 text-green-800",
      rejeitada: "bg-red-100 text-red-800",
      agendada: "bg-blue-100 text-blue-800",
      confirmada: "bg-green-100 text-green-800",
      cancelada: "bg-red-100 text-red-800",
      realizada: "bg-gray-100 text-gray-800",
      planejada: "bg-blue-100 text-blue-800",
      "em-andamento": "bg-orange-100 text-orange-800",
      concluida: "bg-green-100 text-green-800",
      aplicada: "bg-purple-100 text-purple-800",
      corrigida: "bg-green-100 text-green-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const handleNovoEvento = () => {
    setIsAddEventoModalOpen(true)
  }

  const handleEventoAdded = (novoEvento: Evento) => {
    setEventosAdicionais((prev) => [...prev, novoEvento])
  }

  const handleSolicitarAusencia = () => {
    alert("Funcionalidade de solicitar ausência será implementada em breve!")
  }

  const handleAgendarSubstituicao = () => {
    alert("Funcionalidade de agendar substituição será implementada em breve!")
  }

  const handleNovoPlanejamento = () => {
    alert("Funcionalidade de novo planejamento será implementada em breve!")
  }

  const handleNovaAvaliacao = () => {
    alert("Funcionalidade de nova avaliação será implementada em breve!")
  }

  const handleNovaMensagem = () => {
    alert("Funcionalidade de nova mensagem será implementada em breve!")
  }

  const handleFiltros = () => {
    alert("Aplicando filtros avançados...")
  }

  const handleExportar = () => {
    alert("Gerando relatório para download...")
  }

  // Combinar eventos originais com eventos adicionados
  const todosEventos = [
    ...eventos,
    ...eventosAdicionais.map((evento) => ({
      id: evento.id,
      titulo: evento.titulo,
      descricao: evento.descricao,
      tipo: evento.tipo as any,
      dataInicio: evento.dataInicio,
      dataFim: evento.dataFim,
      cor: evento.cor,
      turmas: evento.turmas,
    })),
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão Acadêmica</h1>
          <p className="text-gray-600 mt-1">
            Gerencie calendário, ausências, substituições e comunicações ({todosEventos.length} eventos)
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={handleFiltros}>
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button onClick={handleExportar}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="calendario" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="calendario" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Calendário</span>
          </TabsTrigger>
          <TabsTrigger value="ausencias" className="flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Ausências</span>
          </TabsTrigger>
          <TabsTrigger value="substituicoes" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Substituições</span>
          </TabsTrigger>
          <TabsTrigger value="planejamentos" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Planejamentos</span>
          </TabsTrigger>
          <TabsTrigger value="avaliacoes" className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4" />
            <span className="hidden sm:inline">Avaliações</span>
          </TabsTrigger>
          <TabsTrigger value="comunicacoes" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Comunicações</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendario" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Calendário Escolar ({todosEventos.length} eventos)</h2>
            <Button onClick={handleNovoEvento}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Evento
            </Button>
          </div>

          {todosEventos.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-muted-foreground mb-4">Nenhum evento cadastrado</p>
              <Button onClick={handleNovoEvento}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar primeiro evento
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {todosEventos.map((evento) => (
                <Card key={evento.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{evento.titulo}</h3>
                          <p className="text-sm text-gray-600">{evento.descricao}</p>
                        </div>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: evento.cor }} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">
                            {evento.dataInicio.toLocaleDateString("pt-BR")}
                            {evento.dataFim.getTime() !== evento.dataInicio.getTime() &&
                              ` - ${evento.dataFim.toLocaleDateString("pt-BR")}`}
                          </span>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {evento.tipo}
                        </Badge>
                        {evento.turmas && evento.turmas.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {evento.turmas.map((turma) => (
                              <Badge key={turma} variant="secondary" className="text-xs">
                                {turma}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="ausencias" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Gestão de Ausências ({ausencias.length})</h2>
            <Button onClick={handleSolicitarAusencia}>
              <Plus className="w-4 h-4 mr-2" />
              Solicitar Ausência
            </Button>
          </div>
          <div className="grid gap-4">
            {ausencias.map((ausencia) => (
              <Card key={ausencia.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{ausencia.professorNome}</h3>
                        <p className="text-sm text-gray-600 capitalize">{ausencia.motivo}</p>
                        {ausencia.descricao && <p className="text-sm text-gray-500 mt-1">{ausencia.descricao}</p>}
                      </div>
                      <Badge className={getStatusColor(ausencia.status)}>{ausencia.status}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Período:</span>
                        <p>
                          {ausencia.dataInicio.toLocaleDateString("pt-BR")} -{" "}
                          {ausencia.dataFim.toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      {ausencia.substitutoNome && (
                        <div>
                          <span className="font-medium">Substituto:</span>
                          <p>{ausencia.substitutoNome}</p>
                        </div>
                      )}
                    </div>
                    {ausencia.aulasAfetadas.length > 0 && (
                      <div>
                        <span className="font-medium text-sm">Aulas Afetadas:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {ausencia.aulasAfetadas.map((aula) => (
                            <Badge key={aula} variant="outline" className="text-xs">
                              {aula}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="substituicoes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Sistema de Substituições ({substituicoes.length})</h2>
            <Button onClick={handleAgendarSubstituicao}>
              <Plus className="w-4 h-4 mr-2" />
              Agendar Substituição
            </Button>
          </div>
          <div className="grid gap-4">
            {substituicoes.map((substituicao) => (
              <Card key={substituicao.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">
                          {substituicao.disciplina} - {substituicao.turma}
                        </h3>
                        <p className="text-sm text-gray-600">{substituicao.sala}</p>
                      </div>
                      <Badge className={getStatusColor(substituicao.status)}>{substituicao.status}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Data:</span>
                        <p>{substituicao.dataSubstituicao.toLocaleDateString("pt-BR")}</p>
                      </div>
                      <div>
                        <span className="font-medium">Horário:</span>
                        <p>
                          {substituicao.horarioInicio} - {substituicao.horarioFim}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Substituto:</span>
                        <p>Prof. Substituto</p>
                      </div>
                    </div>
                    {substituicao.conteudoPlanejado && (
                      <div>
                        <span className="font-medium text-sm">Conteúdo Planejado:</span>
                        <p className="text-sm text-gray-600 mt-1">{substituicao.conteudoPlanejado}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="planejamentos" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Planejamento de Aulas ({planejamentos.length})</h2>
            <Button onClick={handleNovoPlanejamento}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Planejamento
            </Button>
          </div>
          <div className="grid gap-4">
            {planejamentos.map((planejamento) => (
              <Card key={planejamento.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{planejamento.tema}</h3>
                        <p className="text-sm text-gray-600">
                          {planejamento.data.toLocaleDateString("pt-BR")} - {planejamento.horarioInicio} às{" "}
                          {planejamento.horarioFim}
                        </p>
                      </div>
                      <Badge className={getStatusColor(planejamento.status)}>{planejamento.status}</Badge>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm">Objetivos:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                          {planejamento.objetivos.map((objetivo, idx) => (
                            <li key={idx}>{objetivo}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm">Conteúdo:</h4>
                        <p className="text-sm text-gray-600 mt-1">{planejamento.conteudo}</p>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm">Metodologia:</h4>
                        <p className="text-sm text-gray-600 mt-1">{planejamento.metodologia}</p>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm">Recursos:</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {planejamento.recursos.map((recurso) => (
                            <Badge key={recurso} variant="outline" className="text-xs">
                              {recurso}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="avaliacoes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Sistema de Avaliações ({avaliacoes.length})</h2>
            <Button onClick={handleNovaAvaliacao}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Avaliação
            </Button>
          </div>
          <div className="grid gap-4">
            {avaliacoes.map((avaliacao) => (
              <Card key={avaliacao.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{avaliacao.titulo}</h3>
                        <p className="text-sm text-gray-600 capitalize">{avaliacao.tipo}</p>
                      </div>
                      <Badge className={getStatusColor(avaliacao.status)}>{avaliacao.status}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Data:</span>
                        <p>{avaliacao.data.toLocaleDateString("pt-BR")}</p>
                      </div>
                      <div>
                        <span className="font-medium">Peso:</span>
                        <p>{avaliacao.peso}</p>
                      </div>
                      <div>
                        <span className="font-medium">Pontuação:</span>
                        <p>{avaliacao.pontuacaoMaxima} pontos</p>
                      </div>
                    </div>

                    {avaliacao.descricao && (
                      <div>
                        <span className="font-medium text-sm">Descrição:</span>
                        <p className="text-sm text-gray-600 mt-1">{avaliacao.descricao}</p>
                      </div>
                    )}

                    <div>
                      <span className="font-medium text-sm">Critérios de Avaliação:</span>
                      <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                        {avaliacao.criterios.map((criterio, idx) => (
                          <li key={idx}>{criterio}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comunicacoes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Sistema de Comunicação ({comunicacoes.length})</h2>
            <Button onClick={handleNovaMensagem}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Mensagem
            </Button>
          </div>
          <div className="grid gap-4">
            {comunicacoes.map((comunicacao) => (
              <Card key={comunicacao.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{comunicacao.assunto}</h3>
                        <p className="text-sm text-gray-600">De: {comunicacao.remetenteNome}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={comunicacao.tipo === "urgente" ? "destructive" : "secondary"}>
                          {comunicacao.tipo}
                        </Badge>
                        {!comunicacao.lida && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                      </div>
                    </div>

                    <p className="text-sm text-gray-700">{comunicacao.mensagem}</p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {comunicacao.dataEnvio.toLocaleDateString("pt-BR")} às{" "}
                        {comunicacao.dataEnvio.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <span>{comunicacao.destinatarios.length} destinatário(s)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <AddEventoModal open={isAddEventoModalOpen} onOpenChange={setIsAddEventoModalOpen} onAdd={handleEventoAdded} />
    </div>
  )
}
