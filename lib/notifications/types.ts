export interface Notification {
  id: string
  tipo: "remanejamento" | "aprovacao" | "conflito" | "sistema"
  titulo: string
  mensagem: string
  destinatario: string
  canal: "email" | "sms" | "push" | "whatsapp"
  status: "pendente" | "enviado" | "entregue" | "erro"
  prioridade: "baixa" | "media" | "alta" | "critica"
  dados?: any
  criadoEm: Date
  enviadoEm?: Date
  lida: boolean
}

export interface NotificationTemplate {
  id: string
  nome: string
  tipo: string
  assunto: string
  corpo: string
  variaveis: string[]
}

export interface NotificationPreferences {
  userId: string
  email: boolean
  sms: boolean
  push: boolean
  whatsapp: boolean
  tipos: {
    remanejamento: boolean
    aprovacao: boolean
    conflito: boolean
    sistema: boolean
  }
}
