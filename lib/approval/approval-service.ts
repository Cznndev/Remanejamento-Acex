import type { ApprovalRequest, Approval, ApprovalStats } from "./types"
import { NotificationService } from "../notifications/notification-service"

export class ApprovalService {
  private static instance: ApprovalService
  private requests: ApprovalRequest[] = []
  private notificationService = NotificationService.getInstance()

  static getInstance(): ApprovalService {
    if (!ApprovalService.instance) {
      ApprovalService.instance = new ApprovalService()
    }
    return ApprovalService.instance
  }

  constructor() {
    this.initializeMockData()
  }

  private initializeMockData() {
    // Dados de exemplo para demonstração
    this.requests = [
      {
        id: "req-001",
        tipo: "remanejamento",
        titulo: "Remanejamento - Matemática 9º Ano A",
        descricao: "Substituição de professor por licença médica",
        solicitante: "Sistema Automático",
        dados: {
          conflito: {
            id: 1,
            professor: "Maria Silva",
            turma: "9º Ano A",
            disciplina: "Matemática",
            data: "2024-06-10",
            horario: "07:30 - 08:20",
            sala: "Sala 1",
            motivo: "Licença médica do professor titular",
          },
          solucao: {
            novoProfessor: "Carlos Santos",
            justificativa: "Professor substituto com especialização em matemática disponível no horário",
          },
        },
        nivelAprovacao: "coordenador",
        status: "pendente",
        aprovacoes: [],
        criadoEm: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
        prazoAprovacao: new Date(Date.now() + 22 * 60 * 60 * 1000), // 22 horas restantes
        prioridade: "alta",
      },
      {
        id: "req-002",
        tipo: "remanejamento",
        titulo: "Mudança de Sala - História 7º Ano B",
        descricao: "Sala em manutenção, necessário remanejamento",
        solicitante: "João Coordenador",
        dados: {
          conflito: {
            id: 2,
            professor: "João Pereira",
            turma: "7º Ano B",
            disciplina: "História",
            data: "2024-06-12",
            horario: "08:20 - 09:10",
            sala: "Laboratório",
            motivo: "Problema elétrico no laboratório",
          },
          solucao: {
            novaSala: "Sala 3",
            justificativa: "Sala 3 disponível no mesmo horário com recursos adequados",
          },
        },
        nivelAprovacao: "diretor",
        status: "pendente",
        aprovacoes: [],
        criadoEm: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
        prazoAprovacao: new Date(Date.now() + 20 * 60 * 60 * 1000), // 20 horas restantes
        prioridade: "media",
      },
      {
        id: "req-003",
        tipo: "cancelamento",
        titulo: "Cancelamento - Evento Escolar",
        descricao: "Cancelamento de aulas para evento especial",
        solicitante: "Ana Diretora",
        dados: {
          conflito: {
            id: 3,
            professor: "Múltiplos",
            turma: "Todas",
            disciplina: "Múltiplas",
            data: "2024-06-15",
            horario: "13:00 - 17:00",
            sala: "Todas",
            motivo: "Feira de Ciências - Evento institucional",
          },
          solucao: {
            justificativa: "Reposição das aulas será agendada para sábado letivo",
          },
        },
        nivelAprovacao: "ambos",
        status: "aprovado_coordenador",
        aprovacoes: [
          {
            id: "app-001",
            aprovador: "João Coordenador",
            cargo: "coordenador",
            acao: "aprovado",
            comentario: "Evento importante para a escola, aprovado",
            dataAprovacao: new Date(Date.now() - 1 * 60 * 60 * 1000),
          },
        ],
        criadoEm: new Date(Date.now() - 6 * 60 * 60 * 1000),
        prazoAprovacao: new Date(Date.now() + 18 * 60 * 60 * 1000),
        prioridade: "critica",
      },
    ]
  }

  async criarSolicitacao(dados: Omit<ApprovalRequest, "id" | "criadoEm" | "status" | "aprovacoes">): Promise<string> {
    const id = `req-${Date.now()}`
    const request: ApprovalRequest = {
      ...dados,
      id,
      status: "pendente",
      aprovacoes: [],
      criadoEm: new Date(),
    }

    this.requests.push(request)

    // Notificar responsáveis pela aprovação
    await this.notificarResponsaveis(request)

    return id
  }

  async aprovar(
    requestId: string,
    aprovador: string,
    cargo: "coordenador" | "diretor",
    comentario = "",
  ): Promise<void> {
    const request = this.requests.find((r) => r.id === requestId)
    if (!request) throw new Error("Solicitação não encontrada")

    const approval: Approval = {
      id: `app-${Date.now()}`,
      aprovador,
      cargo,
      acao: "aprovado",
      comentario,
      dataAprovacao: new Date(),
    }

    request.aprovacoes.push(approval)

    // Atualizar status baseado no nível de aprovação necessário
    if (request.nivelAprovacao === "coordenador" && cargo === "coordenador") {
      request.status = "aprovado"
    } else if (request.nivelAprovacao === "diretor" && cargo === "diretor") {
      request.status = "aprovado"
    } else if (request.nivelAprovacao === "ambos") {
      if (cargo === "coordenador") {
        request.status = "aprovado_coordenador"
        // Notificar diretor
        await this.notificationService.enviarNotificacao({
          tipo: "aprovacao",
          titulo: "Aprovação Necessária - Diretor",
          mensagem: `Solicitação "${request.titulo}" aprovada pelo coordenador, aguardando aprovação da direção`,
          destinatario: "diretor",
          canal: "email",
          status: "pendente",
          prioridade: "alta",
        })
      } else if (cargo === "diretor" && request.status === "aprovado_coordenador") {
        request.status = "aprovado"
      }
    }

    // Notificar solicitante sobre aprovação
    await this.notificationService.enviarNotificacao({
      tipo: "aprovacao",
      titulo: "Solicitação Aprovada",
      mensagem: `Sua solicitação "${request.titulo}" foi aprovada por ${aprovador}`,
      destinatario: request.solicitante,
      canal: "push",
      status: "pendente",
      prioridade: "media",
    })

    // Se totalmente aprovado, executar o remanejamento
    if (request.status === "aprovado") {
      await this.executarRemanejamento(request)
    }
  }

  async rejeitar(
    requestId: string,
    aprovador: string,
    cargo: "coordenador" | "diretor",
    comentario: string,
  ): Promise<void> {
    const request = this.requests.find((r) => r.id === requestId)
    if (!request) throw new Error("Solicitação não encontrada")

    const approval: Approval = {
      id: `app-${Date.now()}`,
      aprovador,
      cargo,
      acao: "rejeitado",
      comentario,
      dataAprovacao: new Date(),
    }

    request.aprovacoes.push(approval)
    request.status = "rejeitado"

    // Notificar solicitante sobre rejeição
    await this.notificationService.enviarNotificacao({
      tipo: "aprovacao",
      titulo: "Solicitação Rejeitada",
      mensagem: `Sua solicitação "${request.titulo}" foi rejeitada: ${comentario}`,
      destinatario: request.solicitante,
      canal: "email",
      status: "pendente",
      prioridade: "alta",
    })
  }

  private async notificarResponsaveis(request: ApprovalRequest): Promise<void> {
    const responsaveis = []

    if (request.nivelAprovacao === "coordenador" || request.nivelAprovacao === "ambos") {
      responsaveis.push("coordenador")
    }

    if (request.nivelAprovacao === "diretor") {
      responsaveis.push("diretor")
    }

    for (const responsavel of responsaveis) {
      await this.notificationService.enviarNotificacao({
        tipo: "aprovacao",
        titulo: "Nova Solicitação de Aprovação",
        mensagem: `Nova solicitação "${request.titulo}" precisa de sua aprovação`,
        destinatario: responsavel,
        canal: "email",
        status: "pendente",
        prioridade: request.prioridade === "critica" ? "critica" : "alta",
      })
    }
  }

  private async executarRemanejamento(request: ApprovalRequest): Promise<void> {
    // Simular execução do remanejamento
    console.log(`Executando remanejamento aprovado: ${request.titulo}`)

    // Notificar todos os envolvidos
    await this.notificationService.enviarNotificacao({
      tipo: "remanejamento",
      titulo: "Remanejamento Executado",
      mensagem: `O remanejamento "${request.titulo}" foi executado com sucesso`,
      destinatario: request.dados.conflito.professor,
      canal: "email",
      status: "pendente",
      prioridade: "media",
    })
  }

  getSolicitacoes(filtros?: {
    status?: string
    aprovador?: string
    prioridade?: string
  }): ApprovalRequest[] {
    let requests = [...this.requests]

    if (filtros?.status && filtros.status !== "todos") {
      requests = requests.filter((r) => r.status === filtros.status)
    }

    if (filtros?.prioridade && filtros.prioridade !== "todas") {
      requests = requests.filter((r) => r.prioridade === filtros.prioridade)
    }

    if (filtros?.aprovador) {
      // Filtrar por solicitações que o aprovador pode aprovar
      if (filtros.aprovador === "coordenador") {
        requests = requests.filter(
          (r) => r.nivelAprovacao === "coordenador" || (r.nivelAprovacao === "ambos" && r.status === "pendente"),
        )
      } else if (filtros.aprovador === "diretor") {
        requests = requests.filter(
          (r) =>
            r.nivelAprovacao === "diretor" || (r.nivelAprovacao === "ambos" && r.status === "aprovado_coordenador"),
        )
      }
    }

    return requests.sort((a, b) => b.criadoEm.getTime() - a.criadoEm.getTime())
  }

  getSolicitacao(id: string): ApprovalRequest | undefined {
    return this.requests.find((r) => r.id === id)
  }

  getEstatisticas(): ApprovalStats {
    const agora = new Date()

    return {
      total: this.requests.length,
      pendentes: this.requests.filter((r) => r.status === "pendente" || r.status === "aprovado_coordenador").length,
      aprovados: this.requests.filter((r) => r.status === "aprovado").length,
      rejeitados: this.requests.filter((r) => r.status === "rejeitado").length,
      vencidos: this.requests.filter(
        (r) => r.prazoAprovacao < agora && (r.status === "pendente" || r.status === "aprovado_coordenador"),
      ).length,
      porNivel: {
        coordenador: this.requests.filter(
          (r) => (r.nivelAprovacao === "coordenador" || r.nivelAprovacao === "ambos") && r.status === "pendente",
        ).length,
        diretor: this.requests.filter(
          (r) =>
            r.nivelAprovacao === "diretor" || (r.nivelAprovacao === "ambos" && r.status === "aprovado_coordenador"),
        ).length,
      },
    }
  }

  async criarSolicitacaoRemanejamento(
    conflito: any,
    solucao: any,
    prioridade: "baixa" | "media" | "alta" | "critica" = "media",
  ): Promise<string> {
    // Determinar nível de aprovação baseado na complexidade
    let nivelAprovacao: "coordenador" | "diretor" | "ambos" = "coordenador"

    if (solucao.novoProfessor && solucao.novaSala) {
      nivelAprovacao = "diretor" // Mudanças múltiplas precisam de diretor
    } else if (prioridade === "critica") {
      nivelAprovacao = "ambos" // Situações críticas precisam de ambos
    }

    return await this.criarSolicitacao({
      tipo: "remanejamento",
      titulo: `Remanejamento - ${conflito.disciplina} ${conflito.turma}`,
      descricao: `${conflito.motivo}`,
      solicitante: "Sistema Automático",
      dados: {
        conflito,
        solucao,
      },
      nivelAprovacao,
      prazoAprovacao: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
      prioridade,
    })
  }
}
