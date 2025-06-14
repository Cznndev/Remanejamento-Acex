export interface WorkflowStep {
  id: string
  nome: string
  tipo: "aprovacao" | "notificacao" | "acao"
  responsavel: string
  status: "pendente" | "aprovado" | "rejeitado" | "concluido"
  comentario?: string
  dataExecucao?: Date
  prazo?: Date
}

export interface WorkflowInstance {
  id: string
  tipo: "remanejamento" | "conflito" | "alteracao"
  titulo: string
  solicitante: string
  dados: any
  steps: WorkflowStep[]
  status: "iniciado" | "em_andamento" | "aprovado" | "rejeitado" | "concluido"
  criadoEm: Date
  atualizadoEm: Date
}

export interface WorkflowTemplate {
  id: string
  nome: string
  tipo: string
  steps: Omit<WorkflowStep, "id" | "status" | "dataExecucao">[]
}
