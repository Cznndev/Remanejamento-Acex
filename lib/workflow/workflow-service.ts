import type { WorkflowInstance, WorkflowStep, WorkflowTemplate } from "./types"
import { NotificationService } from "../notifications/notification-service"

export class WorkflowService {
  private static instance: WorkflowService
  private workflows: WorkflowInstance[] = []
  private templates: WorkflowTemplate[] = []
  private notificationService = NotificationService.getInstance()

  static getInstance(): WorkflowService {
    if (!WorkflowService.instance) {
      WorkflowService.instance = new WorkflowService()
    }
    return WorkflowService.instance
  }

  constructor() {
    this.initializeTemplates()
  }

  private initializeTemplates() {
    this.templates = [
      {
        id: "remanejamento-automatico",
        nome: "Remanejamento Automático",
        tipo: "remanejamento",
        steps: [
          {
            nome: "Análise Automática",
            tipo: "acao",
            responsavel: "sistema",
            prazo: new Date(Date.now() + 5 * 60 * 1000), // 5 minutos
          },
          {
            nome: "Aprovação Coordenador",
            tipo: "aprovacao",
            responsavel: "coordenador",
            prazo: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos
          },
          {
            nome: "Notificação Professores",
            tipo: "notificacao",
            responsavel: "sistema",
            prazo: new Date(Date.now() + 35 * 60 * 1000), // 35 minutos
          },
          {
            nome: "Notificação Alunos",
            tipo: "notificacao",
            responsavel: "sistema",
            prazo: new Date(Date.now() + 40 * 60 * 1000), // 40 minutos
          },
        ],
      },
      {
        id: "conflito-critico",
        nome: "Resolução de Conflito Crítico",
        tipo: "conflito",
        steps: [
          {
            nome: "Análise de Impacto",
            tipo: "acao",
            responsavel: "coordenador",
            prazo: new Date(Date.now() + 15 * 60 * 1000), // 15 minutos
          },
          {
            nome: "Aprovação Diretor",
            tipo: "aprovacao",
            responsavel: "diretor",
            prazo: new Date(Date.now() + 60 * 60 * 1000), // 1 hora
          },
          {
            nome: "Execução",
            tipo: "acao",
            responsavel: "sistema",
            prazo: new Date(Date.now() + 65 * 60 * 1000), // 1h5min
          },
        ],
      },
    ]
  }

  async iniciarWorkflow(templateId: string, dados: any, solicitante: string): Promise<string> {
    const template = this.templates.find((t) => t.id === templateId)
    if (!template) {
      throw new Error("Template não encontrado")
    }

    const workflowId = Math.random().toString(36).substr(2, 9)
    const steps: WorkflowStep[] = template.steps.map((step, index) => ({
      ...step,
      id: `${workflowId}-step-${index}`,
      status: index === 0 ? "pendente" : "pendente",
    }))

    const workflow: WorkflowInstance = {
      id: workflowId,
      tipo: template.tipo as any,
      titulo: `${template.nome} - ${dados.titulo || "Sem título"}`,
      solicitante,
      dados,
      steps,
      status: "iniciado",
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    }

    this.workflows.push(workflow)

    // Inicia primeiro step
    await this.processarProximoStep(workflowId)

    return workflowId
  }

  async aprovarStep(workflowId: string, stepId: string, comentario?: string): Promise<void> {
    const workflow = this.workflows.find((w) => w.id === workflowId)
    if (!workflow) return

    const step = workflow.steps.find((s) => s.id === stepId)
    if (!step) return

    step.status = "aprovado"
    step.comentario = comentario
    step.dataExecucao = new Date()
    workflow.atualizadoEm = new Date()

    // Notifica aprovação
    await this.notificationService.enviarNotificacao({
      tipo: "aprovacao",
      titulo: "Step Aprovado",
      mensagem: `O step "${step.nome}" foi aprovado`,
      destinatario: workflow.solicitante,
      canal: "push",
      status: "pendente",
      prioridade: "media",
    })

    await this.processarProximoStep(workflowId)
  }

  async rejeitarStep(workflowId: string, stepId: string, comentario: string): Promise<void> {
    const workflow = this.workflows.find((w) => w.id === workflowId)
    if (!workflow) return

    const step = workflow.steps.find((s) => s.id === stepId)
    if (!step) return

    step.status = "rejeitado"
    step.comentario = comentario
    step.dataExecucao = new Date()
    workflow.status = "rejeitado"
    workflow.atualizadoEm = new Date()

    // Notifica rejeição
    await this.notificationService.enviarNotificacao({
      tipo: "aprovacao",
      titulo: "Workflow Rejeitado",
      mensagem: `O workflow "${workflow.titulo}" foi rejeitado: ${comentario}`,
      destinatario: workflow.solicitante,
      canal: "email",
      status: "pendente",
      prioridade: "alta",
    })
  }

  private async processarProximoStep(workflowId: string): Promise<void> {
    const workflow = this.workflows.find((w) => w.id === workflowId)
    if (!workflow) return

    const proximoStep = workflow.steps.find((s) => s.status === "pendente")
    if (!proximoStep) {
      // Workflow concluído
      workflow.status = "concluido"
      workflow.atualizadoEm = new Date()
      return
    }

    workflow.status = "em_andamento"

    // Processa step baseado no tipo
    switch (proximoStep.tipo) {
      case "acao":
        await this.executarAcao(workflow, proximoStep)
        break
      case "notificacao":
        await this.executarNotificacao(workflow, proximoStep)
        break
      case "aprovacao":
        await this.solicitarAprovacao(workflow, proximoStep)
        break
    }
  }

  private async executarAcao(workflow: WorkflowInstance, step: WorkflowStep): Promise<void> {
    // Simula execução de ação
    await new Promise((resolve) => setTimeout(resolve, 1000))

    step.status = "concluido"
    step.dataExecucao = new Date()
    workflow.atualizadoEm = new Date()

    await this.processarProximoStep(workflow.id)
  }

  private async executarNotificacao(workflow: WorkflowInstance, step: WorkflowStep): Promise<void> {
    // Executa notificações baseadas no contexto
    if (workflow.dados.remanejamento) {
      await this.notificationService.notificarRemanejamento(workflow.dados.remanejamento)
    }

    step.status = "concluido"
    step.dataExecucao = new Date()
    workflow.atualizadoEm = new Date()

    await this.processarProximoStep(workflow.id)
  }

  private async solicitarAprovacao(workflow: WorkflowInstance, step: WorkflowStep): Promise<void> {
    // Notifica responsável sobre aprovação pendente
    await this.notificationService.enviarNotificacao({
      tipo: "aprovacao",
      titulo: "Aprovação Necessária",
      mensagem: `O workflow "${workflow.titulo}" precisa de sua aprovação`,
      destinatario: step.responsavel,
      canal: "email",
      status: "pendente",
      prioridade: "alta",
      dados: { workflowId: workflow.id, stepId: step.id },
    })
  }

  getWorkflows(responsavel?: string): WorkflowInstance[] {
    if (responsavel) {
      return this.workflows.filter(
        (w) =>
          w.solicitante === responsavel ||
          w.steps.some((s) => s.responsavel === responsavel && s.status === "pendente"),
      )
    }
    return this.workflows
  }

  getWorkflow(id: string): WorkflowInstance | undefined {
    return this.workflows.find((w) => w.id === id)
  }
}
