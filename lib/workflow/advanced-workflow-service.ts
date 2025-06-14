import type { WorkflowInstance, WorkflowStep } from "./types"
import { WorkflowService } from "./workflow-service"
import { NotificationService } from "../notifications/notification-service"
import { MLPredictionEngine } from "../ml/prediction-engine"
import { WhatsAppBusinessService } from "../integrations/whatsapp-business"

export interface ConditionalStep extends WorkflowStep {
  conditions?: WorkflowCondition[]
  onSuccess?: string // ID do próximo step se condição for verdadeira
  onFailure?: string // ID do próximo step se condição for falsa
  timeout?: number // Timeout em minutos
  escalation?: EscalationRule[]
}

export interface WorkflowCondition {
  type: "time" | "approval" | "prediction" | "external" | "user_action"
  operator: "equals" | "greater_than" | "less_than" | "contains"
  value: any
  field?: string
}

export interface EscalationRule {
  afterMinutes: number
  action: "notify" | "auto_approve" | "escalate_to"
  target?: string
  message?: string
}

export interface AdvancedWorkflowTemplate {
  id: string
  name: string
  description: string
  category: "remanejamento" | "emergencia" | "rotina" | "aprovacao"
  priority: "baixa" | "media" | "alta" | "critica"
  steps: ConditionalStep[]
  triggers: WorkflowTrigger[]
  variables: Record<string, any>
}

export interface WorkflowTrigger {
  type: "schedule" | "event" | "prediction" | "manual"
  condition: any
  enabled: boolean
}

export class AdvancedWorkflowService extends WorkflowService {
  private static advancedInstance: AdvancedWorkflowService
  private advancedTemplates: AdvancedWorkflowTemplate[] = []
  private mlEngine = MLPredictionEngine.getInstance()
  private whatsappService = WhatsAppBusinessService.getInstance()
  private notificationService = NotificationService.getInstance()

  static getInstance(): AdvancedWorkflowService {
    if (!AdvancedWorkflowService.advancedInstance) {
      AdvancedWorkflowService.advancedInstance = new AdvancedWorkflowService()
    }
    return AdvancedWorkflowService.advancedInstance
  }

  constructor() {
    super()
    this.initializeAdvancedTemplates()
    this.startScheduledTriggers()
  }

  private initializeAdvancedTemplates() {
    this.advancedTemplates = [
      {
        id: "remanejamento-inteligente",
        name: "Remanejamento Inteligente com IA",
        description: "Workflow que usa IA para prever e prevenir conflitos",
        category: "remanejamento",
        priority: "alta",
        variables: {},
        triggers: [
          {
            type: "schedule",
            condition: { cron: "0 6 * * *" }, // Todo dia às 6h
            enabled: true,
          },
          {
            type: "prediction",
            condition: { threshold: 0.15 }, // Probabilidade > 15%
            enabled: true,
          },
        ],
        steps: [
          {
            id: "1",
            nome: "Análise Preditiva",
            tipo: "acao",
            responsavel: "sistema",
            status: "pendente",
            conditions: [
              {
                type: "prediction",
                operator: "greater_than",
                value: 0.15,
                field: "probabilidadeAusencia",
              },
            ],
            onSuccess: "2",
            onFailure: "6",
            timeout: 5,
          },
          {
            id: "2",
            nome: "Notificação Preventiva Professor",
            tipo: "notificacao",
            responsavel: "sistema",
            status: "pendente",
            onSuccess: "3",
            timeout: 10,
          },
          {
            id: "3",
            nome: "Aguardar Confirmação",
            tipo: "aprovacao",
            responsavel: "professor",
            status: "pendente",
            conditions: [
              {
                type: "time",
                operator: "less_than",
                value: 30, // 30 minutos
              },
            ],
            onSuccess: "6",
            onFailure: "4",
            timeout: 30,
            escalation: [
              {
                afterMinutes: 15,
                action: "notify",
                target: "coordenador",
                message: "Professor não confirmou presença",
              },
              {
                afterMinutes: 25,
                action: "escalate_to",
                target: "4",
              },
            ],
          },
          {
            id: "4",
            nome: "Buscar Professor Substituto",
            tipo: "acao",
            responsavel: "sistema",
            status: "pendente",
            onSuccess: "5",
          },
          {
            id: "5",
            nome: "Confirmar Substituição",
            tipo: "aprovacao",
            responsavel: "coordenador",
            status: "pendente",
            timeout: 15,
            escalation: [
              {
                afterMinutes: 10,
                action: "auto_approve",
              },
            ],
          },
          {
            id: "6",
            nome: "Finalizar Processo",
            tipo: "acao",
            responsavel: "sistema",
            status: "pendente",
          },
        ],
      },
      {
        id: "emergencia-automatica",
        name: "Resposta Automática a Emergências",
        description: "Workflow para situações de emergência com escalação automática",
        category: "emergencia",
        priority: "critica",
        variables: {},
        triggers: [
          {
            type: "event",
            condition: { type: "emergencia" },
            enabled: true,
          },
        ],
        steps: [
          {
            id: "1",
            nome: "Detectar Emergência",
            tipo: "acao",
            responsavel: "sistema",
            status: "pendente",
            onSuccess: "2",
            timeout: 1,
          },
          {
            id: "2",
            nome: "Notificar Direção",
            tipo: "notificacao",
            responsavel: "sistema",
            status: "pendente",
            onSuccess: "3",
            timeout: 2,
          },
          {
            id: "3",
            nome: "Enviar WhatsApp Emergência",
            tipo: "acao",
            responsavel: "sistema",
            status: "pendente",
            onSuccess: "4",
            timeout: 3,
          },
          {
            id: "4",
            nome: "Aguardar Resposta Direção",
            tipo: "aprovacao",
            responsavel: "diretor",
            status: "pendente",
            timeout: 5,
            escalation: [
              {
                afterMinutes: 3,
                action: "escalate_to",
                target: "5",
              },
            ],
          },
          {
            id: "5",
            nome: "Ativar Protocolo Automático",
            tipo: "acao",
            responsavel: "sistema",
            status: "pendente",
          },
        ],
      },
      {
        id: "aprovacao-cascata",
        name: "Aprovação em Cascata",
        description: "Sistema de aprovação hierárquica com escalação automática",
        category: "aprovacao",
        priority: "media",
        variables: {},
        triggers: [
          {
            type: "manual",
            condition: {},
            enabled: true,
          },
        ],
        steps: [
          {
            id: "1",
            nome: "Aprovação Coordenador",
            tipo: "aprovacao",
            responsavel: "coordenador",
            status: "pendente",
            timeout: 60,
            onSuccess: "4",
            onFailure: "2",
            escalation: [
              {
                afterMinutes: 30,
                action: "notify",
                target: "coordenador",
                message: "Aprovação pendente há 30 minutos",
              },
              {
                afterMinutes: 50,
                action: "escalate_to",
                target: "2",
              },
            ],
          },
          {
            id: "2",
            nome: "Aprovação Diretor",
            tipo: "aprovacao",
            responsavel: "diretor",
            status: "pendente",
            timeout: 120,
            onSuccess: "4",
            onFailure: "3",
            escalation: [
              {
                afterMinutes: 60,
                action: "notify",
                target: "diretor",
              },
              {
                afterMinutes: 100,
                action: "escalate_to",
                target: "3",
              },
            ],
          },
          {
            id: "3",
            nome: "Aprovação Automática",
            tipo: "acao",
            responsavel: "sistema",
            status: "pendente",
            onSuccess: "4",
          },
          {
            id: "4",
            nome: "Executar Ação",
            tipo: "acao",
            responsavel: "sistema",
            status: "pendente",
          },
        ],
      },
    ]
  }

  async iniciarWorkflowInteligente(templateId: string, dados: any, solicitante: string): Promise<string> {
    const template = this.advancedTemplates.find((t) => t.id === templateId)
    if (!template) {
      throw new Error("Template avançado não encontrado")
    }

    // Enriquece dados com predições de IA se necessário
    if (template.category === "remanejamento" && dados.professorId) {
      try {
        const prediction = await this.mlEngine.predictAbsence({
          professorId: dados.professorId,
          disciplina: dados.disciplina,
          diaSemana: new Date().getDay(),
          periodo: dados.periodo || 1,
          mes: new Date().getMonth() + 1,
          feriados: false,
          eventos: false,
        })

        dados.prediction = prediction
      } catch (error) {
        console.warn("Erro ao obter predição:", error)
      }
    }

    const workflowId = await this.iniciarWorkflow(templateId, dados, solicitante)

    // Inicia processamento condicional
    this.processarWorkflowCondicional(workflowId)

    return workflowId
  }

  private async processarWorkflowCondicional(workflowId: string): Promise<void> {
    const workflow = this.getWorkflow(workflowId)
    if (!workflow) return

    const template = this.advancedTemplates.find((t) => t.id === workflow.tipo)
    if (!template) return

    const stepAtual = workflow.steps.find((s) => s.status === "pendente")
    if (!stepAtual) return

    const templateStep = template.steps.find((s) => s.id === stepAtual.id) as ConditionalStep
    if (!templateStep) return

    // Avalia condições
    const condicaoAtendida = await this.avaliarCondicoes(templateStep.conditions || [], workflow.dados)

    // Processa step baseado no resultado
    if (templateStep.tipo === "acao") {
      await this.executarAcaoCondicional(workflow, templateStep, condicaoAtendida)
    } else if (templateStep.tipo === "aprovacao") {
      await this.configurarAprovacaoCondicional(workflow, templateStep)
    } else if (templateStep.tipo === "notificacao") {
      await this.executarNotificacaoCondicional(workflow, templateStep)
    }
  }

  private async avaliarCondicoes(conditions: WorkflowCondition[], dados: any): Promise<boolean> {
    if (conditions.length === 0) return true

    for (const condition of conditions) {
      const resultado = await this.avaliarCondicao(condition, dados)
      if (!resultado) return false
    }

    return true
  }

  private async avaliarCondicao(condition: WorkflowCondition, dados: any): Promise<boolean> {
    switch (condition.type) {
      case "prediction":
        if (dados.prediction && condition.field) {
          const valor = dados.prediction[condition.field]
          return this.compararValores(valor, condition.operator, condition.value)
        }
        return false

      case "time":
        const agora = new Date()
        const inicio = dados.inicioWorkflow || agora
        const diferencaMinutos = (agora.getTime() - inicio.getTime()) / (1000 * 60)
        return this.compararValores(diferencaMinutos, condition.operator, condition.value)

      case "external":
        // Aqui poderia consultar APIs externas
        return true

      default:
        return true
    }
  }

  private compararValores(valor: any, operator: string, referencia: any): boolean {
    switch (operator) {
      case "equals":
        return valor === referencia
      case "greater_than":
        return valor > referencia
      case "less_than":
        return valor < referencia
      case "contains":
        return String(valor).includes(String(referencia))
      default:
        return false
    }
  }

  private async executarAcaoCondicional(
    workflow: WorkflowInstance,
    step: ConditionalStep,
    condicaoAtendida: boolean,
  ): Promise<void> {
    // Simula execução de ação
    await new Promise((resolve) => setTimeout(resolve, 1000))

    step.status = "concluido"
    step.dataExecucao = new Date()

    // Determina próximo step baseado na condição
    const proximoStepId = condicaoAtendida ? step.onSuccess : step.onFailure
    if (proximoStepId) {
      const proximoStep = workflow.steps.find((s) => s.id === proximoStepId)
      if (proximoStep) {
        proximoStep.status = "pendente"
      }
    }

    workflow.atualizadoEm = new Date()

    // Continua processamento
    setTimeout(() => this.processarWorkflowCondicional(workflow.id), 500)
  }

  private async configurarAprovacaoCondicional(workflow: WorkflowInstance, step: ConditionalStep): Promise<void> {
    // Configura timeout e escalação
    if (step.timeout) {
      setTimeout(
        () => {
          this.processarTimeoutStep(workflow.id, step.id)
        },
        step.timeout * 60 * 1000,
      )
    }

    // Configura escalações
    if (step.escalation) {
      for (const escalation of step.escalation) {
        setTimeout(
          () => {
            this.processarEscalacao(workflow.id, step.id, escalation)
          },
          escalation.afterMinutes * 60 * 1000,
        )
      }
    }

    // Notifica responsável
    await this.notificationService.enviarNotificacao({
      tipo: "aprovacao",
      titulo: "Aprovação Necessária",
      mensagem: `Workflow "${workflow.titulo}" precisa de aprovação`,
      destinatario: step.responsavel,
      canal: "email",
      status: "pendente",
      prioridade: "alta",
    })
  }

  private async executarNotificacaoCondicional(workflow: WorkflowInstance, step: ConditionalStep): Promise<void> {
    // Executa notificações via múltiplos canais
    await this.notificationService.enviarNotificacao({
      tipo: "sistema",
      titulo: step.nome,
      mensagem: `Workflow: ${workflow.titulo}`,
      destinatario: step.responsavel,
      canal: "email",
      status: "pendente",
      prioridade: "media",
    })

    // Se WhatsApp estiver conectado, envia também
    const whatsappStatus = this.whatsappService.getConnectionStatus()
    if (whatsappStatus.isConnected) {
      try {
        await this.whatsappService.sendMessage(
          "+5511999990001", // Número do responsável
          `🔔 ${step.nome}\n\nWorkflow: ${workflow.titulo}`,
        )
      } catch (error) {
        console.warn("Erro ao enviar WhatsApp:", error)
      }
    }

    step.status = "concluido"
    step.dataExecucao = new Date()
    workflow.atualizadoEm = new Date()

    // Continua para próximo step
    setTimeout(() => this.processarWorkflowCondicional(workflow.id), 500)
  }

  private async processarTimeoutStep(workflowId: string, stepId: string): Promise<void> {
    const workflow = this.getWorkflow(workflowId)
    if (!workflow) return

    const step = workflow.steps.find((s) => s.id === stepId)
    if (!step || step.status !== "pendente") return

    // Marca como timeout e continua
    step.status = "rejeitado"
    step.comentario = "Timeout - sem resposta no prazo"
    step.dataExecucao = new Date()

    await this.notificationService.enviarNotificacao({
      tipo: "sistema",
      titulo: "Workflow Timeout",
      mensagem: `Step "${step.nome}" expirou por timeout`,
      destinatario: workflow.solicitante,
      canal: "email",
      status: "pendente",
      prioridade: "alta",
    })

    this.processarWorkflowCondicional(workflowId)
  }

  private async processarEscalacao(workflowId: string, stepId: string, escalation: EscalationRule): Promise<void> {
    const workflow = this.getWorkflow(workflowId)
    if (!workflow) return

    const step = workflow.steps.find((s) => s.id === stepId)
    if (!step || step.status !== "pendente") return

    switch (escalation.action) {
      case "notify":
        await this.notificationService.enviarNotificacao({
          tipo: "sistema",
          titulo: "Escalação de Workflow",
          mensagem: escalation.message || `Step "${step.nome}" precisa de atenção`,
          destinatario: escalation.target || step.responsavel,
          canal: "email",
          status: "pendente",
          prioridade: "alta",
        })
        break

      case "auto_approve":
        await this.aprovarStep(workflowId, stepId, "Aprovação automática por escalação")
        break

      case "escalate_to":
        if (escalation.target) {
          const proximoStep = workflow.steps.find((s) => s.id === escalation.target)
          if (proximoStep) {
            step.status = "rejeitado"
            step.comentario = "Escalado automaticamente"
            proximoStep.status = "pendente"
            this.processarWorkflowCondicional(workflowId)
          }
        }
        break
    }
  }

  private startScheduledTriggers(): void {
    // Simula triggers agendados
    setInterval(() => {
      this.processarTriggersAgendados()
    }, 60000) // Verifica a cada minuto
  }

  private async processarTriggersAgendados(): Promise<void> {
    // Processa triggers baseados em horário
    for (const template of this.advancedTemplates) {
      for (const trigger of template.triggers) {
        if (trigger.type === "schedule" && trigger.enabled) {
          // Aqui verificaria se é hora de executar baseado no cron
          // Por simplicidade, vamos simular
          if (Math.random() < 0.01) {
            // 1% chance por minuto
            await this.iniciarWorkflowInteligente(
              template.id,
              {
                trigger: "scheduled",
                timestamp: new Date(),
              },
              "sistema",
            )
          }
        }
      }
    }
  }

  getAdvancedTemplates(): AdvancedWorkflowTemplate[] {
    return this.advancedTemplates
  }

  async criarTemplatePersonalizado(template: AdvancedWorkflowTemplate): Promise<string> {
    template.id = `custom_${Math.random().toString(36).substr(2, 9)}`
    this.advancedTemplates.push(template)
    return template.id
  }
}
