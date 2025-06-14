export interface WhatsAppMessage {
  id: string
  to: string
  type: "text" | "template" | "media"
  content: string
  templateName?: string
  templateParams?: string[]
  status: "pending" | "sent" | "delivered" | "read" | "failed"
  sentAt?: Date
  deliveredAt?: Date
  readAt?: Date
}

export interface WhatsAppContact {
  phone: string
  name: string
  role: "professor" | "responsavel" | "coordenador" | "diretor"
  active: boolean
}

export interface WhatsAppTemplate {
  id: string
  name: string
  category: "remanejamento" | "lembrete" | "emergencia" | "geral"
  content: string
  variables: string[]
  approved: boolean
}

export class WhatsAppBusinessService {
  private static instance: WhatsAppBusinessService
  private isConnected = false
  private apiKey = ""
  private phoneNumberId = ""
  private contacts: WhatsAppContact[] = []
  private templates: WhatsAppTemplate[] = []
  private messages: WhatsAppMessage[] = []

  static getInstance(): WhatsAppBusinessService {
    if (!WhatsAppBusinessService.instance) {
      WhatsAppBusinessService.instance = new WhatsAppBusinessService()
    }
    return WhatsAppBusinessService.instance
  }

  constructor() {
    this.initializeTemplates()
    this.initializeContacts()
  }

  private initializeTemplates() {
    this.templates = [
      {
        id: "1",
        name: "remanejamento_aula",
        category: "remanejamento",
        content: `🏫 *Remanejamento de Aula*

Olá {{nome}},

Sua aula de *{{disciplina}}* da turma *{{turma}}* foi remanejada:

📅 Data: {{data}}
🕐 Horário: {{horario}}
🏫 Sala: {{sala}}
📝 Motivo: {{motivo}}

{{#professor_substituto}}
👨‍🏫 Professor substituto: {{professor_substituto}}
{{/professor_substituto}}

Atenciosamente,
Coordenação Pedagógica`,
        variables: ["nome", "disciplina", "turma", "data", "horario", "sala", "motivo", "professor_substituto"],
        approved: true,
      },
      {
        id: "2",
        name: "lembrete_aula",
        category: "lembrete",
        content: `⏰ *Lembrete de Aula*

Olá {{nome}},

Lembramos que você tem aula de *{{disciplina}}* hoje:

🕐 Horário: {{horario}}
🏫 Sala: {{sala}}
👥 Turma: {{turma}}

Tenha um ótimo dia! 📚`,
        variables: ["nome", "disciplina", "horario", "sala", "turma"],
        approved: true,
      },
      {
        id: "3",
        name: "emergencia_escola",
        category: "emergencia",
        content: `🚨 *Comunicado Urgente*

{{nome}},

{{mensagem_emergencia}}

Para mais informações, entre em contato com a secretaria: {{telefone_escola}}

Escola {{nome_escola}}`,
        variables: ["nome", "mensagem_emergencia", "telefone_escola", "nome_escola"],
        approved: true,
      },
      {
        id: "4",
        name: "confirmacao_presenca",
        category: "geral",
        content: `✅ *Confirmação de Presença*

Olá {{nome}},

Por favor, confirme sua presença para a aula de *{{disciplina}}* amanhã:

📅 {{data}}
🕐 {{horario}}
🏫 {{sala}}

Responda com:
✅ SIM - para confirmar
❌ NÃO - se não puder comparecer

Obrigado!`,
        variables: ["nome", "disciplina", "data", "horario", "sala"],
        approved: true,
      },
    ]
  }

  private initializeContacts() {
    this.contacts = [
      {
        phone: "+5511999990001",
        name: "Maria Silva",
        role: "professor",
        active: true,
      },
      {
        phone: "+5511999990002",
        name: "João Pereira",
        role: "professor",
        active: true,
      },
      {
        phone: "+5511999990003",
        name: "Ana Costa",
        role: "professor",
        active: true,
      },
      {
        phone: "+5511999990004",
        name: "Carlos Santos",
        role: "professor",
        active: true,
      },
      {
        phone: "+5511999990005",
        name: "Ana Coordenadora",
        role: "coordenador",
        active: true,
      },
      {
        phone: "+5511999990006",
        name: "Roberto Diretor",
        role: "diretor",
        active: true,
      },
    ]
  }

  async connect(apiKey: string, phoneNumberId: string): Promise<boolean> {
    // Simula conexão com WhatsApp Business API
    await new Promise((resolve) => setTimeout(resolve, 2000))

    this.apiKey = apiKey
    this.phoneNumberId = phoneNumberId
    this.isConnected = true

    console.log("📱 WhatsApp Business conectado com sucesso!")
    return true
  }

  async disconnect(): Promise<void> {
    this.isConnected = false
    this.apiKey = ""
    this.phoneNumberId = ""
  }

  async sendMessage(to: string, content: string, type: "text" | "template" = "text"): Promise<string> {
    if (!this.isConnected) {
      throw new Error("WhatsApp Business não conectado")
    }

    const messageId = `wa_${Math.random().toString(36).substr(2, 9)}`

    const message: WhatsAppMessage = {
      id: messageId,
      to,
      type,
      content,
      status: "pending",
      sentAt: new Date(),
    }

    this.messages.push(message)

    // Simula envio
    await new Promise((resolve) => setTimeout(resolve, 1000))

    message.status = "sent"

    // Simula entrega após um tempo
    setTimeout(
      () => {
        message.status = "delivered"
        message.deliveredAt = new Date()

        // Simula leitura (50% chance)
        if (Math.random() < 0.5) {
          setTimeout(
            () => {
              message.status = "read"
              message.readAt = new Date()
            },
            Math.random() * 5000 + 1000,
          )
        }
      },
      Math.random() * 3000 + 1000,
    )

    console.log(`📱 WhatsApp enviado para ${to}: ${content.substring(0, 50)}...`)
    return messageId
  }

  async sendTemplate(to: string, templateName: string, params: Record<string, string>): Promise<string> {
    const template = this.templates.find((t) => t.name === templateName)
    if (!template) {
      throw new Error(`Template ${templateName} não encontrado`)
    }

    let content = template.content

    // Substitui variáveis
    for (const [key, value] of Object.entries(params)) {
      const regex = new RegExp(`{{${key}}}`, "g")
      content = content.replace(regex, value)
    }

    // Remove blocos condicionais vazios
    content = content.replace(/{{#\w+}}[\s\S]*?{{\/\w+}}/g, (match) => {
      // Se contém variáveis não substituídas, remove o bloco
      if (match.includes("{{") && match.includes("}}")) {
        return ""
      }
      return match.replace(/{{[#/]\w+}}/g, "")
    })

    return this.sendMessage(to, content, "template")
  }

  async sendRemanejamentoNotification(dados: {
    professor: string
    disciplina: string
    turma: string
    data: string
    horario: string
    sala: string
    motivo: string
    professorSubstituto?: string
  }): Promise<string[]> {
    const messageIds: string[] = []

    // Encontra contato do professor
    const professorContact = this.contacts.find(
      (c) => c.name.toLowerCase().includes(dados.professor.toLowerCase()) && c.role === "professor",
    )

    if (professorContact) {
      const messageId = await this.sendTemplate(professorContact.phone, "remanejamento_aula", {
        nome: dados.professor,
        disciplina: dados.disciplina,
        turma: dados.turma,
        data: dados.data,
        horario: dados.horario,
        sala: dados.sala,
        motivo: dados.motivo,
        professor_substituto: dados.professorSubstituto || "",
      })
      messageIds.push(messageId)
    }

    // Notifica coordenador
    const coordenadorContact = this.contacts.find((c) => c.role === "coordenador")
    if (coordenadorContact) {
      const messageId = await this.sendMessage(
        coordenadorContact.phone,
        `🔄 *Remanejamento Realizado*\n\nProfessor: ${dados.professor}\nDisciplina: ${dados.disciplina}\nTurma: ${dados.turma}\nData: ${dados.data}\nHorário: ${dados.horario}\nSala: ${dados.sala}\nMotivo: ${dados.motivo}`,
      )
      messageIds.push(messageId)
    }

    return messageIds
  }

  async sendBulkMessage(contacts: string[], content: string): Promise<string[]> {
    const messageIds: string[] = []

    for (const contact of contacts) {
      try {
        const messageId = await this.sendMessage(contact, content)
        messageIds.push(messageId)

        // Delay entre mensagens para evitar spam
        await new Promise((resolve) => setTimeout(resolve, 500))
      } catch (error) {
        console.error(`Erro ao enviar para ${contact}:`, error)
      }
    }

    return messageIds
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      phoneNumberId: this.phoneNumberId,
      contactsCount: this.contacts.filter((c) => c.active).length,
      templatesCount: this.templates.filter((t) => t.approved).length,
      messagesCount: this.messages.length,
    }
  }

  getContacts(): WhatsAppContact[] {
    return this.contacts.filter((c) => c.active)
  }

  getTemplates(): WhatsAppTemplate[] {
    return this.templates
  }

  getMessages(limit = 50): WhatsAppMessage[] {
    return this.messages.sort((a, b) => (b.sentAt?.getTime() || 0) - (a.sentAt?.getTime() || 0)).slice(0, limit)
  }

  getMessageStats() {
    const total = this.messages.length
    const sent = this.messages.filter((m) => m.status === "sent").length
    const delivered = this.messages.filter((m) => m.status === "delivered").length
    const read = this.messages.filter((m) => m.status === "read").length
    const failed = this.messages.filter((m) => m.status === "failed").length

    return {
      total,
      sent,
      delivered,
      read,
      failed,
      deliveryRate: total > 0 ? (delivered / total) * 100 : 0,
      readRate: total > 0 ? (read / total) * 100 : 0,
    }
  }
}
