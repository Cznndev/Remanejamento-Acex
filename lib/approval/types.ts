export interface ApprovalRequest {
  id: string
  tipo: "remanejamento" | "cancelamento" | "substituicao"
  titulo: string
  descricao: string
  solicitante: string
  dados: {
    conflito: {
      id: number
      professor: string
      turma: string
      disciplina: string
      data: string
      horario: string
      sala: string
      motivo: string
    }
    solucao: {
      novoProfessor?: string
      novaSala?: string
      novoHorario?: string
      justificativa: string
    }
  }
  nivelAprovacao: "coordenador" | "diretor" | "ambos"
  status: "pendente" | "aprovado_coordenador" | "aprovado_diretor" | "aprovado" | "rejeitado"
  aprovacoes: Approval[]
  criadoEm: Date
  prazoAprovacao: Date
  prioridade: "baixa" | "media" | "alta" | "critica"
}

export interface Approval {
  id: string
  aprovador: string
  cargo: "coordenador" | "diretor"
  acao: "aprovado" | "rejeitado"
  comentario: string
  dataAprovacao: Date
}

export interface ApprovalStats {
  total: number
  pendentes: number
  aprovados: number
  rejeitados: number
  vencidos: number
  porNivel: {
    coordenador: number
    diretor: number
  }
}
