export interface HologramTemplate {
  id: string
  name: string
  category: "teacher" | "content" | "interactive" | "ambient" | "custom"
  description: string
  resolution: { width: number; height: number; depth: number }
  fileUrl: string
  fileFormat: "glb" | "gltf" | "usdz" | "hologram"
  fileSize: number
  duration?: number
  interactivePoints?: Array<{
    id: string
    position: { x: number; y: number; z: number }
    name: string
    action: string
  }>
  tags: string[]
  createdBy: string
  createdAt: Date
  lastModified: Date
}

export interface HologramInstance {
  id: string
  templateId: string
  name: string
  status: "initializing" | "active" | "paused" | "stopped" | "error"
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  scale: { x: number; y: number; z: number }
  opacity: number
  startTime: Date
  endTime?: Date
  room: string
  createdBy: string
  currentViewers: number
  interactions: number
  customProperties?: Record<string, any>
}

export interface HologramDevice {
  id: string
  name: string
  type: "projector" | "display" | "lens" | "room"
  location: string
  status: "online" | "offline" | "maintenance" | "standby"
  capabilities: string[]
  currentInstance?: string
  lastMaintenance: Date
  nextMaintenance: Date
  healthStatus: {
    overall: number
    components: Record<string, number>
  }
}

export interface HologramInteraction {
  id: string
  instanceId: string
  userId: string
  timestamp: Date
  type: "view" | "touch" | "gesture" | "voice" | "brain"
  action: string
  position?: { x: number; y: number; z: number }
  duration?: number
  success: boolean
  data?: any
}

export interface HologramSession {
  id: string
  name: string
  startTime: Date
  endTime?: Date
  room: string
  host: string
  participants: string[]
  instances: string[]
  recordings?: Array<{
    id: string
    url: string
    duration: number
    size: number
  }>
  metrics: {
    peakViewers: number
    totalInteractions: number
    averageEngagement: number
    technicalIssues: number
  }
}

class HologramService {
  private templates: Map<string, HologramTemplate> = new Map()
  private instances: Map<string, HologramInstance> = new Map()
  private devices: Map<string, HologramDevice> = new Map()
  private interactions: HologramInteraction[] = []
  private sessions: Map<string, HologramSession> = new Map()
  private isInitialized = false

  constructor() {
    this.initialize()
  }

  private async initialize(): Promise<void> {
    console.log("Inicializando serviço de hologramas...")
    await new Promise((resolve) => setTimeout(resolve, 2000))

    this.loadMockData()
    this.isInitialized = true

    console.log("Serviço de hologramas inicializado com sucesso")
  }

  private loadMockData(): void {
    // Carregar templates de hologramas
    const mockTemplates: HologramTemplate[] = [
      {
        id: "template_teacher_1",
        name: "Professor de Física",
        category: "teacher",
        description: "Holograma de professor para aulas de física com demonstrações interativas",
        resolution: { width: 1920, height: 1080, depth: 512 },
        fileUrl: "/assets/holograms/physics_teacher.glb",
        fileFormat: "glb",
        fileSize: 256000000,
        duration: 3600,
        interactivePoints: [
          {
            id: "point_1",
            position: { x: 0, y: 1.5, z: 0 },
            name: "Demonstração de Gravidade",
            action: "play_animation",
          },
          {
            id: "point_2",
            position: { x: 0.5, y: 1.2, z: 0.3 },
            name: "Explicação de Fórmulas",
            action: "show_content",
          },
        ],
        tags: ["física", "professor", "ciências", "interativo"],
        createdBy: "admin",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        lastModified: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
      {
        id: "template_content_1",
        name: "Sistema Solar 3D",
        category: "content",
        description: "Modelo interativo do sistema solar com planetas em escala e informações detalhadas",
        resolution: { width: 2560, height: 1440, depth: 1024 },
        fileUrl: "/assets/holograms/solar_system.gltf",
        fileFormat: "gltf",
        fileSize: 512000000,
        interactivePoints: [
          {
            id: "point_sun",
            position: { x: 0, y: 0, z: 0 },
            name: "Sol",
            action: "show_info",
          },
          {
            id: "point_earth",
            position: { x: 1, y: 0, z: 0 },
            name: "Terra",
            action: "show_info",
          },
        ],
        tags: ["astronomia", "sistema solar", "planetas", "educação", "3D"],
        createdBy: "admin",
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        lastModified: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
    ]

    mockTemplates.forEach((template) => {
      this.templates.set(template.id, template)
    })

    // Carregar dispositivos de hologramas
    const mockDevices: HologramDevice[] = [
      {
        id: "device_1",
        name: "Projetor Holográfico - Sala 101",
        type: "projector",
        location: "Sala 101",
        status: "online",
        capabilities: ["3D", "interactive", "high_resolution", "gesture_control"],
        lastMaintenance: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        nextMaintenance: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        healthStatus: {
          overall: 0.95,
          components: {
            projector: 0.98,
            sensors: 0.92,
            cooling: 0.96,
            software: 1.0,
          },
        },
      },
      {
        id: "device_2",
        name: "Sala Holográfica Imersiva",
        type: "room",
        location: "Laboratório de Ciências",
        status: "online",
        capabilities: ["360_projection", "multi_user", "interactive", "spatial_audio", "environmental_effects"],
        lastMaintenance: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        nextMaintenance: new Date(Date.now() + 135 * 24 * 60 * 60 * 1000),
        healthStatus: {
          overall: 0.92,
          components: {
            projectors: 0.94,
            sensors: 0.9,
            audio: 0.95,
            environment: 0.89,
            software: 0.98,
          },
        },
      },
    ]

    mockDevices.forEach((device) => {
      this.devices.set(device.id, device)
    })
  }

  async getTemplates(): Promise<HologramTemplate[]> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    return Array.from(this.templates.values())
  }

  async getTemplateById(id: string): Promise<HologramTemplate | null> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    return this.templates.get(id) || null
  }

  async createTemplate(template: Omit<HologramTemplate, "id" | "createdAt" | "lastModified">): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    const id = `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const newTemplate: HologramTemplate = {
      ...template,
      id,
      createdAt: new Date(),
      lastModified: new Date(),
    }

    this.templates.set(id, newTemplate)

    return id
  }

  async updateTemplate(id: string, updates: Partial<HologramTemplate>): Promise<boolean> {
    const template = this.templates.get(id)
    if (!template) return false

    Object.assign(template, updates, { lastModified: new Date() })

    return true
  }

  async deleteTemplate(id: string): Promise<boolean> {
    return this.templates.delete(id)
  }

  async createInstance(
    templateId: string,
    room: string,
    position: { x: number; y: number; z: number },
    options?: Partial<HologramInstance>,
  ): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    const template = this.templates.get(templateId)
    if (!template) {
      throw new Error("Template não encontrado")
    }

    const id = `instance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const newInstance: HologramInstance = {
      id,
      templateId,
      name: options?.name || template.name,
      status: "initializing",
      position,
      rotation: options?.rotation || { x: 0, y: 0, z: 0 },
      scale: options?.scale || { x: 1, y: 1, z: 1 },
      opacity: options?.opacity || 1.0,
      startTime: new Date(),
      room,
      createdBy: options?.createdBy || "system",
      currentViewers: 0,
      interactions: 0,
      customProperties: options?.customProperties,
    }

    this.instances.set(id, newInstance)

    // Simular inicialização do holograma
    setTimeout(() => {
      const instance = this.instances.get(id)
      if (instance) {
        instance.status = "active"
      }
    }, 3000)

    return id
  }

  async getInstanceById(id: string): Promise<HologramInstance | null> {
    return this.instances.get(id) || null
  }

  async getActiveInstances(room?: string): Promise<HologramInstance[]> {
    const instances = Array.from(this.instances.values()).filter(
      (instance) => instance.status === "active" || instance.status === "paused",
    )

    if (room) {
      return instances.filter((instance) => instance.room === room)
    }

    return instances
  }

  async controlInstance(
    id: string,
    action: "start" | "pause" | "resume" | "stop" | "update",
    params?: any,
  ): Promise<boolean> {
    const instance = this.instances.get(id)
    if (!instance) return false

    switch (action) {
      case "start":
        instance.status = "active"
        break
      case "pause":
        instance.status = "paused"
        break
      case "resume":
        instance.status = "active"
        break
      case "stop":
        instance.status = "stopped"
        instance.endTime = new Date()
        break
      case "update":
        if (params) {
          if (params.position) instance.position = params.position
          if (params.rotation) instance.rotation = params.rotation
          if (params.scale) instance.scale = params.scale
          if (params.opacity !== undefined) instance.opacity = params.opacity
        }
        break
    }

    return true
  }

  async recordInteraction(
    instanceId: string,
    userId: string,
    type: HologramInteraction["type"],
    action: string,
    data?: any,
  ): Promise<string> {
    const instance = this.instances.get(instanceId)
    if (!instance) {
      throw new Error("Instância não encontrada")
    }

    const id = `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const interaction: HologramInteraction = {
      id,
      instanceId,
      userId,
      timestamp: new Date(),
      type,
      action,
      success: true,
      data,
    }

    this.interactions.push(interaction)

    // Atualizar contador de interações da instância
    instance.interactions++

    return id
  }

  async getDevices(): Promise<HologramDevice[]> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    return Array.from(this.devices.values())
  }

  async getDeviceById(id: string): Promise<HologramDevice | null> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    return this.devices.get(id) || null
  }

  async updateDeviceStatus(id: string, status: HologramDevice["status"]): Promise<boolean> {
    const device = this.devices.get(id)
    if (!device) return false

    device.status = status

    return true
  }

  async startSession(name: string, room: string, host: string, participants: string[] = []): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const newSession: HologramSession = {
      id,
      name,
      startTime: new Date(),
      room,
      host,
      participants,
      instances: [],
      metrics: {
        peakViewers: 0,
        totalInteractions: 0,
        averageEngagement: 0,
        technicalIssues: 0,
      },
    }

    this.sessions.set(id, newSession)

    return id
  }

  async endSession(id: string): Promise<boolean> {
    const session = this.sessions.get(id)
    if (!session) return false

    session.endTime = new Date()

    // Parar todas as instâncias associadas à sessão
    for (const instanceId of session.instances) {
      await this.controlInstance(instanceId, "stop")
    }

    // Gerar métricas simuladas
    session.metrics = {
      peakViewers: Math.floor(Math.random() * 20) + session.participants.length,
      totalInteractions: Math.floor(Math.random() * 100) + 10,
      averageEngagement: Math.random() * 0.3 + 0.7,
      technicalIssues: Math.floor(Math.random() * 3),
    }

    return true
  }

  async addInstanceToSession(sessionId: string, instanceId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId)
    if (!session) return false

    const instance = this.instances.get(instanceId)
    if (!instance) return false

    if (!session.instances.includes(instanceId)) {
      session.instances.push(instanceId)
    }

    return true
  }

  async getSessionById(id: string): Promise<HologramSession | null> {
    return this.sessions.get(id) || null
  }

  async getActiveSessions(): Promise<HologramSession[]> {
    return Array.from(this.sessions.values()).filter((session) => !session.endTime)
  }

  getSystemStatus(): {
    templates: number
    activeInstances: number
    onlineDevices: number
    activeSessions: number
    totalInteractions: number
  } {
    const activeInstances = Array.from(this.instances.values()).filter(
      (instance) => instance.status === "active" || instance.status === "paused",
    ).length

    const onlineDevices = Array.from(this.devices.values()).filter((device) => device.status === "online").length

    const activeSessions = Array.from(this.sessions.values()).filter((session) => !session.endTime).length

    return {
      templates: this.templates.size,
      activeInstances,
      onlineDevices,
      activeSessions,
      totalInteractions: this.interactions.length,
    }
  }
}

export const hologramService = new HologramService()
