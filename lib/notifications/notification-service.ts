import type { Notification, NotificationTemplate, NotificationPreferences } from "./types"

export class NotificationService {
  private static instance: NotificationService
  private notifications: Notification[] = []
  private templates: NotificationTemplate[] = []
  private preferences: Map<string, NotificationPreferences> = new Map()

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  constructor() {
    this.initializeTemplates()
  }

  private initializeTemplates() {
    this.templates = [
      {
        id: "remanejamento-professor",
        nome: "Remanejamento - Professor",
        tipo: "remanejamento",
        assunto: "Aula Remanejada - {{disciplina}} - {{turma}}",
        corpo: `Olá {{professor}},

Sua aula de {{disciplina}} da turma {{turma}} foi remanejada:

📅 Data: {{data}}
🕐 Horário: {{horario}}
🏫 Sala: {{sala}}
📝 Motivo: {{motivo}}

{{#novoProfessor}}
👨‍🏫 Professor substituto: {{novoProfessor}}
{{/novoProfessor}}

Atenciosamente,
Coordenação Pedagógica`,
        variaveis: ["professor", "disciplina", "turma", "data", "horario", "sala", "motivo", "novoProfessor"],
      },
      {
        id: "remanejamento-aluno",
        nome: "Remanejamento - Aluno/Responsável",
        tipo: "remanejamento",
        assunto: "Alteração no Cronograma - {{turma}}",
        corpo: `Prezado(a) responsável,

Informamos que houve uma alteração no cronograma da turma {{turma}}:

📚 Disciplina: {{disciplina}}
📅 Data: {{data}}
🕐 Novo horário: {{horario}}
🏫 Nova sala: {{sala}}

A aula será ministrada normalmente no novo horário.

Coordenação Escolar`,
        variaveis: ["turma", "disciplina", "data", "horario", "sala"],
      },
    ]
  }

  async enviarNotificacao(notification: Omit<Notification, "id" | "criadoEm" | "lida">): Promise<string> {
    const id = Math.random().toString(36).substr(2, 9)
    const novaNotificacao: Notification = {
      ...notification,
      id,
      criadoEm: new Date(),
      lida: false,
    }

    this.notifications.push(novaNotificacao)

    // Simula envio baseado no canal
    await this.processarEnvio(novaNotificacao)

    return id
  }

  private async processarEnvio(notification: Notification): Promise<void> {
    // Simula tempo de envio
    await new Promise((resolve) => setTimeout(resolve, 500))

    try {
      switch (notification.canal) {
        case "email":
          await this.enviarEmail(notification)
          break
        case "sms":
          await this.enviarSMS(notification)
          break
        case "push":
          await this.enviarPush(notification)
          break
        case "whatsapp":
          await this.enviarWhatsApp(notification)
          break
      }

      notification.status = "enviado"
      notification.enviadoEm = new Date()
    } catch (error) {
      notification.status = "erro"
    }
  }

  private async enviarEmail(notification: Notification): Promise<void> {
    console.log(`📧 Email enviado para ${notification.destinatario}: ${notification.titulo}`)
  }

  private async enviarSMS(notification: Notification): Promise<void> {
    console.log(`📱 SMS enviado para ${notification.destinatario}: ${notification.titulo}`)
  }

  private async enviarPush(notification: Notification): Promise<void> {
    console.log(`🔔 Push enviado para ${notification.destinatario}: ${notification.titulo}`)
  }

  private async enviarWhatsApp(notification: Notification): Promise<void> {
    console.log(`💬 WhatsApp enviado para ${notification.destinatario}: ${notification.titulo}`)
  }

  async notificarRemanejamento(dados: {
    professor: string
    disciplina: string
    turma: string
    data: string
    horario: string
    sala: string
    motivo: string
    novoProfessor?: string
  }): Promise<void> {
    // Notifica professor original
    await this.enviarNotificacao({
      tipo: "remanejamento",
      titulo: `Aula Remanejada - ${dados.disciplina}`,
      mensagem: `Sua aula de ${dados.disciplina} foi remanejada para ${dados.horario}`,
      destinatario: dados.professor,
      canal: "email",
      status: "pendente",
      prioridade: "alta",
      dados,
    })

    // Notifica alunos/responsáveis
    await this.enviarNotificacao({
      tipo: "remanejamento",
      titulo: `Alteração no Cronograma - ${dados.turma}`,
      mensagem: `A aula de ${dados.disciplina} foi remanejada`,
      destinatario: `turma-${dados.turma}`,
      canal: "email",
      status: "pendente",
      prioridade: "media",
      dados,
    })

    // Notifica novo professor se houver
    if (dados.novoProfessor) {
      await this.enviarNotificacao({
        tipo: "remanejamento",
        titulo: `Nova Aula Atribuída - ${dados.disciplina}`,
        mensagem: `Você foi designado para ministrar a aula de ${dados.disciplina}`,
        destinatario: dados.novoProfessor,
        canal: "email",
        status: "pendente",
        prioridade: "alta",
        dados,
      })
    }
  }

  getNotifications(userId?: string): Notification[] {
    if (userId) {
      return this.notifications.filter((n) => n.destinatario === userId)
    }
    return this.notifications
  }

  marcarComoLida(notificationId: string): void {
    const notification = this.notifications.find((n) => n.id === notificationId)
    if (notification) {
      notification.lida = true
    }
  }

  getTemplates(): NotificationTemplate[] {
    return this.templates
  }
}
