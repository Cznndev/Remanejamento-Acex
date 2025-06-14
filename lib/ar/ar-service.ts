export interface ARMarker {
  id: string
  type: "classroom" | "teacher" | "equipment" | "route"
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  scale: { x: number; y: number; z: number }
  content: {
    title: string
    description: string
    icon: string
    color: string
    data?: any
  }
}

export interface ARScene {
  id: string
  name: string
  markers: ARMarker[]
  isActive: boolean
}

export interface NavigationRoute {
  from: string
  to: string
  steps: {
    instruction: string
    direction: "forward" | "left" | "right" | "up" | "down"
    distance: number
    marker?: ARMarker
  }[]
  totalDistance: number
  estimatedTime: number
}

class ARService {
  private scenes: Map<string, ARScene> = new Map()
  private isARSupported = false
  private currentScene: string | null = null

  constructor() {
    this.checkARSupport()
    this.initializeScenes()
  }

  private async checkARSupport(): Promise<boolean> {
    if (typeof navigator !== "undefined" && "xr" in navigator) {
      try {
        // @ts-ignore
        const supported = await navigator.xr.isSessionSupported("immersive-ar")
        this.isARSupported = supported
        return supported
      } catch (error) {
        console.log("AR não suportado:", error)
        this.isARSupported = false
        return false
      }
    }
    this.isARSupported = false
    return false
  }

  private initializeScenes() {
    // Cena do mapa da escola
    const schoolMapScene: ARScene = {
      id: "school_map",
      name: "Mapa da Escola",
      isActive: false,
      markers: [
        {
          id: "sala_101",
          type: "classroom",
          position: { x: 0, y: 0, z: -2 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          content: {
            title: "Sala 101",
            description: "Matemática - Prof. João Silva\nCapacidade: 30 alunos\nStatus: Disponível",
            icon: "🏫",
            color: "#4CAF50",
            data: {
              capacity: 30,
              currentOccupancy: 0,
              temperature: 23,
              nextClass: "14:00 - Álgebra",
            },
          },
        },
        {
          id: "sala_102",
          type: "classroom",
          position: { x: 2, y: 0, z: -2 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          content: {
            title: "Sala 102",
            description: "Português - Prof. Maria Santos\nCapacidade: 25 alunos\nStatus: Em uso",
            icon: "📚",
            color: "#FF9800",
            data: {
              capacity: 25,
              currentOccupancy: 23,
              temperature: 24,
              currentClass: "Literatura - 9º Ano",
            },
          },
        },
        {
          id: "prof_joao",
          type: "teacher",
          position: { x: -1, y: 0, z: -1 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 0.8, y: 0.8, z: 0.8 },
          content: {
            title: "Prof. João Silva",
            description: "Matemática\nDisponível para remanejamento\nLocalização: Sala dos Professores",
            icon: "👨‍🏫",
            color: "#2196F3",
            data: {
              subject: "Matemática",
              availability: "available",
              location: "Sala dos Professores",
              nextClass: "15:00",
            },
          },
        },
      ],
    }

    // Cena de navegação
    const navigationScene: ARScene = {
      id: "navigation",
      name: "Navegação AR",
      isActive: false,
      markers: [],
    }

    this.scenes.set("school_map", schoolMapScene)
    this.scenes.set("navigation", navigationScene)
  }

  async startARSession(sceneId: string): Promise<boolean> {
    if (!this.isARSupported) {
      console.log("AR não suportado neste dispositivo")
      return false
    }

    try {
      // Simulação de início de sessão AR
      this.currentScene = sceneId
      const scene = this.scenes.get(sceneId)
      if (scene) {
        scene.isActive = true
        console.log(`Sessão AR iniciada para: ${scene.name}`)
        return true
      }
      return false
    } catch (error) {
      console.error("Erro ao iniciar sessão AR:", error)
      return false
    }
  }

  stopARSession(): void {
    if (this.currentScene) {
      const scene = this.scenes.get(this.currentScene)
      if (scene) {
        scene.isActive = false
      }
      this.currentScene = null
      console.log("Sessão AR finalizada")
    }
  }

  getScene(sceneId: string): ARScene | undefined {
    return this.scenes.get(sceneId)
  }

  getAllScenes(): ARScene[] {
    return Array.from(this.scenes.values())
  }

  addMarker(sceneId: string, marker: ARMarker): boolean {
    const scene = this.scenes.get(sceneId)
    if (scene) {
      scene.markers.push(marker)
      return true
    }
    return false
  }

  removeMarker(sceneId: string, markerId: string): boolean {
    const scene = this.scenes.get(sceneId)
    if (scene) {
      const index = scene.markers.findIndex((m) => m.id === markerId)
      if (index !== -1) {
        scene.markers.splice(index, 1)
        return true
      }
    }
    return false
  }

  generateNavigationRoute(from: string, to: string): NavigationRoute {
    // Simulação de geração de rota
    const routes = {
      entrada_sala101: {
        steps: [
          {
            instruction: "Siga em frente pelo corredor principal",
            direction: "forward" as const,
            distance: 20,
            marker: {
              id: "nav_1",
              type: "route" as const,
              position: { x: 0, y: 0, z: -1 },
              rotation: { x: 0, y: 0, z: 0 },
              scale: { x: 1, y: 1, z: 1 },
              content: {
                title: "Siga em frente",
                description: "20 metros",
                icon: "⬆️",
                color: "#4CAF50",
              },
            },
          },
          {
            instruction: "Vire à direita no final do corredor",
            direction: "right" as const,
            distance: 5,
            marker: {
              id: "nav_2",
              type: "route" as const,
              position: { x: 1, y: 0, z: -2 },
              rotation: { x: 0, y: 90, z: 0 },
              scale: { x: 1, y: 1, z: 1 },
              content: {
                title: "Vire à direita",
                description: "5 metros",
                icon: "➡️",
                color: "#FF9800",
              },
            },
          },
          {
            instruction: "A Sala 101 estará à sua esquerda",
            direction: "left" as const,
            distance: 10,
            marker: {
              id: "nav_3",
              type: "route" as const,
              position: { x: 0, y: 0, z: -2 },
              rotation: { x: 0, y: -90, z: 0 },
              scale: { x: 1, y: 1, z: 1 },
              content: {
                title: "Destino à esquerda",
                description: "Sala 101",
                icon: "🎯",
                color: "#2196F3",
              },
            },
          },
        ],
        totalDistance: 35,
        estimatedTime: 45,
      },
    }

    const routeKey = `${from}_${to}`
    const route = routes[routeKey as keyof typeof routes] || routes["entrada_sala101"]

    return {
      from,
      to,
      ...route,
    }
  }

  async scanQRCode(): Promise<{ type: string; data: any } | null> {
    // Simulação de escaneamento de QR Code
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockQRData = {
      type: "classroom",
      data: {
        id: "sala_101",
        name: "Sala 101",
        capacity: 30,
        currentClass: null,
        nextClass: {
          time: "14:00",
          subject: "Matemática",
          teacher: "Prof. João Silva",
          class: "9º Ano A",
        },
        equipment: ["Projetor", "Quadro Digital", "Ar Condicionado"],
        iotData: {
          temperature: 23,
          occupancy: 0,
          airQuality: "Boa",
        },
      },
    }

    return mockQRData
  }

  getARCapabilities(): {
    isSupported: boolean
    features: string[]
    limitations: string[]
  } {
    return {
      isSupported: this.isARSupported,
      features: [
        "Visualização 3D de salas",
        "Navegação com setas AR",
        "Informações em tempo real",
        "Escaneamento de QR Codes",
        "Marcadores interativos",
        "Rotas otimizadas",
      ],
      limitations: [
        "Requer dispositivo compatível",
        "Necessita boa iluminação",
        "Funciona melhor em ambientes internos",
        "Requer calibração inicial",
      ],
    }
  }

  updateMarkerData(sceneId: string, markerId: string, newData: any): boolean {
    const scene = this.scenes.get(sceneId)
    if (scene) {
      const marker = scene.markers.find((m) => m.id === markerId)
      if (marker) {
        marker.content.data = { ...marker.content.data, ...newData }
        return true
      }
    }
    return false
  }
}

export const arService = new ARService()
