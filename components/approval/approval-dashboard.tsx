"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Timer,
  Users,
  BookOpen,
} from "lucide-react"
import { ApprovalService } from "@/lib/approval/approval-service"
import type { ApprovalRequest } from "@/lib/approval/types"
import { useToast } from "@/hooks/use-toast"

export function ApprovalDashboard() {
  const [solicitacoes, setSolicitacoes] = useState<ApprovalRequest[]>([])
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [filtroPrioridade, setFiltroPrioridade] = useState("todas")
  const [aprovadorAtual] = useState("coordenador") // Simular usuário logado
  const [comentarioAprovacao, setComentarioAprovacao] = useState("")
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState<ApprovalRequest | null>(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [acaoModal, setAcaoModal] = useState<"aprovar" | "rejeitar" | "visualizar">("visualizar")

  const approvalService = ApprovalService.getInstance()
  const { toast } = useToast()

  useEffect(() => {
    carregarSolicitacoes()
    const interval = setInterval(carregarSolicitacoes, 30000) // Atualizar a cada 30s
    return () => clearInterval(interval)
  }, [filtroStatus, filtroPrioridade, aprovadorAtual])

  const carregarSolicitacoes = () => {
    const filtros = {
      status: filtroStatus,
      prioridade: filtroPrioridade,
      aprovador: aprovadorAtual,
    }
    const novasSolicitacoes = approvalService.getSolicitacoes(filtros)
    setSolicitacoes(novasSolicitacoes)
  }

  const abrirModal = (solicitacao: ApprovalRequest, acao: "aprovar" | "rejeitar" | "visualizar") => {
    setSolicitacaoSelecionada(solicitacao)
    setAcaoModal(acao)
    setModalAberto(true)
    setComentarioAprovacao("")
  }

  const executarAcao = async () => {
    if (!solicitacaoSelecionada) return

    try {
      if (acaoModal === "aprovar") {
        await approvalService.aprovar(
          solicitacaoSelecionada.id,
          "João Coordenador", // Simular usuário logado
          aprovadorAtual as "coordenador" | "diretor",
          comentarioAprovacao,
        )
        toast({
          title: "✅ Solicitação Aprovada",
          description: `A solicitação "${solicitacaoSelecionada.titulo}" foi aprovada com sucesso.`,
        })
      } else if (acaoModal === "rejeitar") {
        if (!comentarioAprovacao.trim()) {
          toast({
            title: "❌ Comentário Obrigatório",
            description: "É necessário informar o motivo da rejeição.",
            variant: "destructive",
          })
          return
        }
        await approvalService.rejeitar(
          solicitacaoSelecionada.id,
          "João Coordenador",
          aprovadorAtual as "coordenador" | "diretor",
          comentarioAprovacao,
        )
        toast({
          title: "❌ Solicitação Rejeitada",
          description: `A solicitação "${solicitacaoSelecionada.titulo}" foi rejeitada.`,
        })
      }

      carregarSolicitacoes()
      setModalAberto(false)
    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Ocorreu um erro ao processar a solicitação.",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendente":
        return "destructive"
      case "aprovado_coordenador":
        return "secondary"
      case "aprovado":
        return "default"
      case "rejeitado":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "critica":
        return "destructive"
      case "alta":
        return "secondary"
      case "media":
        return "outline"
      case "baixa":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pendente":
        return <Clock className="h-4 w-4" />
      case "aprovado_coordenador":
        return <CheckCircle className="h-4 w-4" />
      case "aprovado":
        return <CheckCircle className="h-4 w-4" />
      case "rejeitado":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const formatarTempo = (data: Date) => {
    const agora = new Date()
    const diff = data.getTime() - agora.getTime()
    const horas = Math.floor(diff / (1000 * 60 * 60))
    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (diff < 0) {
      return "Vencido"
    } else if (horas < 1) {
      return `${minutos}min restantes`
    } else {
      return `${horas}h ${minutos}min restantes`
    }
  }

  const stats = approvalService.getEstatisticas()

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold text-orange-600">{stats.pendentes}</p>
                <p className="text-xs text-muted-foreground">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.aprovados}</p>
                <p className="text-xs text-muted-foreground">Aprovados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.rejeitados}</p>
                <p className="text-xs text-muted-foreground">Rejeitados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-yellow-600">{stats.vencidos}</p>
                <p className="text-xs text-muted-foreground">Vencidos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.porNivel[aprovadorAtual as keyof typeof stats.porNivel]}
                </p>
                <p className="text-xs text-muted-foreground">Para Você</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos Status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="aprovado_coordenador">Aprovado Coordenador</SelectItem>
                <SelectItem value="aprovado">Aprovado</SelectItem>
                <SelectItem value="rejeitado">Rejeitado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtroPrioridade} onValueChange={setFiltroPrioridade}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas Prioridades</SelectItem>
                <SelectItem value="critica">Crítica</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>
                Logado como: <strong className="capitalize">{aprovadorAtual}</strong>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Solicitações */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Solicitações de Aprovação ({solicitacoes.length})</CardTitle>
          <CardDescription>Solicitações que requerem sua aprovação como {aprovadorAtual}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {solicitacoes.map((solicitacao) => (
              <div key={solicitacao.id} className="border rounded-lg p-4 space-y-4">
                {/* Header da Solicitação */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(solicitacao.status)}>
                      {getStatusIcon(solicitacao.status)}
                      <span className="ml-1 capitalize">{solicitacao.status.replace("_", " ")}</span>
                    </Badge>
                    <Badge variant={getPrioridadeColor(solicitacao.prioridade)}>
                      {solicitacao.prioridade.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">{solicitacao.tipo.toUpperCase()}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Timer className="h-4 w-4" />
                    <span>{formatarTempo(solicitacao.prazoAprovacao)}</span>
                  </div>
                </div>

                {/* Título e Descrição */}
                <div>
                  <h3 className="font-semibold text-lg">{solicitacao.titulo}</h3>
                  <p className="text-muted-foreground">{solicitacao.descricao}</p>
                </div>

                {/* Detalhes do Conflito */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 dark:bg-gray-800 rounded p-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="font-medium text-sm">{solicitacao.dados.conflito.professor}</p>
                      <p className="text-xs text-muted-foreground">Professor</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="font-medium text-sm">{solicitacao.dados.conflito.turma}</p>
                      <p className="text-xs text-muted-foreground">Turma</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-purple-500" />
                    <div>
                      <p className="font-medium text-sm">{solicitacao.dados.conflito.disciplina}</p>
                      <p className="text-xs text-muted-foreground">Disciplina</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    <div>
                      <p className="font-medium text-sm">{solicitacao.dados.conflito.data}</p>
                      <p className="text-xs text-muted-foreground">Data</p>
                    </div>
                  </div>
                </div>

                {/* Solução Proposta */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-3">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">💡 Solução Proposta:</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">{solicitacao.dados.solucao.justificativa}</p>
                  {solicitacao.dados.solucao.novoProfessor && (
                    <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                      <strong>Novo Professor:</strong> {solicitacao.dados.solucao.novoProfessor}
                    </p>
                  )}
                  {solicitacao.dados.solucao.novaSala && (
                    <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                      <strong>Nova Sala:</strong> {solicitacao.dados.solucao.novaSala}
                    </p>
                  )}
                </div>

                {/* Aprovações Existentes */}
                {solicitacao.aprovacoes.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">📝 Histórico de Aprovações:</h4>
                    {solicitacao.aprovacoes.map((aprovacao) => (
                      <div
                        key={aprovacao.id}
                        className="flex items-center gap-2 text-sm bg-gray-50 dark:bg-gray-800 rounded p-2"
                      >
                        {aprovacao.acao === "aprovado" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="font-medium">{aprovacao.aprovador}</span>
                        <span className="text-muted-foreground">({aprovacao.cargo})</span>
                        <span className={aprovacao.acao === "aprovado" ? "text-green-600" : "text-red-600"}>
                          {aprovacao.acao}
                        </span>
                        {aprovacao.comentario && (
                          <>
                            <span className="text-muted-foreground">-</span>
                            <span className="text-muted-foreground">{aprovacao.comentario}</span>
                          </>
                        )}
                        <span className="text-xs text-muted-foreground ml-auto">
                          {aprovacao.dataAprovacao.toLocaleString("pt-BR")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Ações */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button variant="outline" size="sm" onClick={() => abrirModal(solicitacao, "visualizar")}>
                    <Eye className="mr-2 h-4 w-4" />
                    Visualizar
                  </Button>

                  {(solicitacao.status === "pendente" ||
                    (solicitacao.status === "aprovado_coordenador" && aprovadorAtual === "diretor")) && (
                    <>
                      <Button size="sm" onClick={() => abrirModal(solicitacao, "aprovar")}>
                        <ThumbsUp className="mr-2 h-4 w-4" />
                        Aprovar
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => abrirModal(solicitacao, "rejeitar")}>
                        <ThumbsDown className="mr-2 h-4 w-4" />
                        Rejeitar
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}

            {solicitacoes.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium">Nenhuma solicitação pendente</h3>
                <p className="text-muted-foreground">
                  Todas as solicitações foram processadas ou não há solicitações para seu nível de aprovação.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Ação */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {acaoModal === "aprovar" && "✅ Aprovar Solicitação"}
              {acaoModal === "rejeitar" && "❌ Rejeitar Solicitação"}
              {acaoModal === "visualizar" && "👁️ Detalhes da Solicitação"}
            </DialogTitle>
            <DialogDescription>{solicitacaoSelecionada?.titulo}</DialogDescription>
          </DialogHeader>

          {solicitacaoSelecionada && (
            <div className="space-y-4">
              {/* Detalhes Completos */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="font-medium">Solicitante:</Label>
                  <p>{solicitacaoSelecionada.solicitante}</p>
                </div>
                <div>
                  <Label className="font-medium">Criado em:</Label>
                  <p>{solicitacaoSelecionada.criadoEm.toLocaleString("pt-BR")}</p>
                </div>
                <div>
                  <Label className="font-medium">Prazo:</Label>
                  <p>{solicitacaoSelecionada.prazoAprovacao.toLocaleString("pt-BR")}</p>
                </div>
                <div>
                  <Label className="font-medium">Nível de Aprovação:</Label>
                  <p className="capitalize">{solicitacaoSelecionada.nivelAprovacao.replace("_", " ")}</p>
                </div>
              </div>

              {/* Motivo */}
              <div>
                <Label className="font-medium">Motivo do Conflito:</Label>
                <p className="text-sm bg-gray-50 dark:bg-gray-800 rounded p-2 mt-1">
                  {solicitacaoSelecionada.dados.conflito.motivo}
                </p>
              </div>

              {/* Campo de Comentário para Aprovação/Rejeição */}
              {(acaoModal === "aprovar" || acaoModal === "rejeitar") && (
                <div>
                  <Label htmlFor="comentario">
                    {acaoModal === "aprovar" ? "Comentário (opcional):" : "Motivo da Rejeição:"}
                  </Label>
                  <Textarea
                    id="comentario"
                    value={comentarioAprovacao}
                    onChange={(e) => setComentarioAprovacao(e.target.value)}
                    placeholder={
                      acaoModal === "aprovar"
                        ? "Adicione um comentário sobre a aprovação..."
                        : "Explique o motivo da rejeição..."
                    }
                    rows={3}
                    className="mt-1"
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalAberto(false)}>
              {acaoModal === "visualizar" ? "Fechar" : "Cancelar"}
            </Button>
            {acaoModal !== "visualizar" && (
              <Button onClick={executarAcao} variant={acaoModal === "aprovar" ? "default" : "destructive"}>
                {acaoModal === "aprovar" ? "Aprovar" : "Rejeitar"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
