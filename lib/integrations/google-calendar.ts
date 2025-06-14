export interface CalendarEvent {
  id: string
  title: string
  description?: string
  start: Date
  end: Date
  location?: string
  attendees?: string[]
  status: "confirmed" | "tentative" | "cancelled"
  creator: string
  organizer: string
}

export interface CalendarIntegration {
  isConnected: boolean
  accountEmail?: string
  lastSync?: Date
  syncEnabled: boolean
}

export class GoogleCalendarService {
  private static instance: GoogleCalendarService
  private integration: CalendarIntegration = {
    isConnected: false,
    syncEnabled: false,
  }

  static getInstance(): GoogleCalendarService {
    if (!GoogleCalendarService.instance) {
      GoogleCalendarService.instance = new GoogleCalendarService()
    }
    return GoogleCalendarService.instance
  }

  async connect(userEmail: string): Promise<boolean> {
    // Simula conexão com Google Calendar
    await new Promise((resolve) => setTimeout(resolve, 2000))

    this.integration = {
      isConnected: true,
      accountEmail: userEmail,
      lastSync: new Date(),
      syncEnabled: true,
    }

    return true
  }

  async disconnect(): Promise<void> {
    this.integration = {
      isConnected: false,
      syncEnabled: false,
    }
  }

  async syncEvents(): Promise<CalendarEvent[]> {
    if (!this.integration.isConnected) {
      throw new Error("Google Calendar não conectado")
    }

    // Simula sincronização de eventos
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const mockEvents: CalendarEvent[] = [
      {
        id: "gc_1",
        title: "Reunião Pedagógica",
        description: "Reunião mensal da equipe pedagógica",
        start: new Date(2025, 0, 8, 14, 0),
        end: new Date(2025, 0, 8, 16, 0),
        location: "Sala de Reuniões",
        attendees: ["coordenador@escola.edu", "diretor@escola.edu"],
        status: "confirmed",
        creator: "coordenador@escola.edu",
        organizer: "coordenador@escola.edu",
      },
      {
        id: "gc_2",
        title: "Conselho de Classe - 9º Ano",
        description: "Avaliação do desempenho dos alunos do 9º ano",
        start: new Date(2025, 0, 10, 19, 0),
        end: new Date(2025, 0, 10, 21, 0),
        location: "Auditório",
        attendees: ["maria.silva@escola.edu", "joao.pereira@escola.edu"],
        status: "confirmed",
        creator: "coordenador@escola.edu",
        organizer: "coordenador@escola.edu",
      },
      {
        id: "gc_3",
        title: "Formação Continuada",
        description: "Workshop sobre novas metodologias de ensino",
        start: new Date(2025, 0, 15, 8, 0),
        end: new Date(2025, 0, 15, 12, 0),
        location: "Laboratório de Informática",
        attendees: ["maria.silva@escola.edu", "ana.costa@escola.edu"],
        status: "tentative",
        creator: "diretor@escola.edu",
        organizer: "diretor@escola.edu",
      },
    ]

    this.integration.lastSync = new Date()
    return mockEvents
  }

  async createEvent(event: Omit<CalendarEvent, "id" | "creator" | "organizer">): Promise<string> {
    if (!this.integration.isConnected) {
      throw new Error("Google Calendar não conectado")
    }

    // Simula criação de evento
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const eventId = `gc_${Math.random().toString(36).substr(2, 9)}`

    console.log(`📅 Evento criado no Google Calendar: ${event.title}`)
    console.log(`🔗 ID: ${eventId}`)

    return eventId
  }

  async updateEvent(eventId: string, updates: Partial<CalendarEvent>): Promise<void> {
    if (!this.integration.isConnected) {
      throw new Error("Google Calendar não conectado")
    }

    // Simula atualização de evento
    await new Promise((resolve) => setTimeout(resolve, 800))

    console.log(`📅 Evento atualizado no Google Calendar: ${eventId}`)
  }

  async deleteEvent(eventId: string): Promise<void> {
    if (!this.integration.isConnected) {
      throw new Error("Google Calendar não conectado")
    }

    // Simula exclusão de evento
    await new Promise((resolve) => setTimeout(resolve, 500))

    console.log(`📅 Evento removido do Google Calendar: ${eventId}`)
  }

  getIntegrationStatus(): CalendarIntegration {
    return { ...this.integration }
  }

  async createRemanejamentoEvent(dados: {
    professor: string
    disciplina: string
    turma: string
    data: string
    horario: string
    sala: string
    motivo: string
  }): Promise<string> {
    const event = {
      title: `${dados.disciplina} - ${dados.turma} (Remanejado)`,
      description: `Aula remanejada
      
Professor: ${dados.professor}
Motivo: ${dados.motivo}
Sala: ${dados.sala}

⚠️ Esta aula foi remanejada automaticamente pelo sistema.`,
      start: new Date(`${dados.data} ${dados.horario.split("-")[0]}`),
      end: new Date(`${dados.data} ${dados.horario.split("-")[1]}`),
      location: dados.sala,
      attendees: [`${dados.professor.toLowerCase().replace(" ", ".")}@escola.edu`],
      status: "confirmed" as const,
    }

    return this.createEvent(event)
  }
}
