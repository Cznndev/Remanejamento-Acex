export interface IoTDevice {
  id: string
  type: "occupancy" | "temperature" | "humidity" | "noise" | "air_quality" | "lighting"
  location: string
  status: "online" | "offline" | "maintenance"
  lastReading: number
  unit: string
  threshold: {
    min: number
    max: number
  }
  battery?: number
}

export interface IoTReading {
  deviceId: string
  timestamp: Date
  value: number
  quality: "good" | "warning" | "critical"
}

export interface SmartClassroom {
  id: string
  name: string
  capacity: number
  currentOccupancy: number
  temperature: number
  humidity: number
  noiseLevel: number
  airQuality: number
  lightingLevel: number
  isOptimal: boolean
  recommendations: string[]
}

class IoTService {
  private devices: Map<string, IoTDevice> = new Map()
  private readings: IoTReading[] = []
  private websocket: WebSocket | null = null

  constructor() {
    this.initializeDevices()
    this.connectWebSocket()
    this.startSimulation()
  }

  private initializeDevices() {
    const mockDevices: IoTDevice[] = [
      {
        id: "temp_001",
        type: "temperature",
        location: "Sala 101",
        status: "online",
        lastReading: 23.5,
        unit: "°C",
        threshold: { min: 18, max: 26 },
        battery: 85,
      },
      {
        id: "occ_001",
        type: "occupancy",
        location: "Sala 101",
        status: "online",
        lastReading: 25,
        unit: "pessoas",
        threshold: { min: 0, max: 30 },
      },
      {
        id: "noise_001",
        type: "noise",
        location: "Sala 101",
        status: "online",
        lastReading: 45,
        unit: "dB",
        threshold: { min: 30, max: 60 },
      },
      {
        id: "air_001",
        type: "air_quality",
        location: "Sala 101",
        status: "online",
        lastReading: 350,
        unit: "ppm CO2",
        threshold: { min: 300, max: 1000 },
      },
    ]

    mockDevices.forEach((device) => {
      this.devices.set(device.id, device)
    })
  }

  private connectWebSocket() {
    // Simulação de WebSocket para dados em tempo real
    this.websocket = {
      send: () => {},
      close: () => {},
      readyState: WebSocket.OPEN,
    } as WebSocket
  }

  private startSimulation() {
    setInterval(() => {
      this.devices.forEach((device) => {
        const variation = (Math.random() - 0.5) * 2
        let newValue = device.lastReading + variation

        // Aplicar limites realistas
        switch (device.type) {
          case "temperature":
            newValue = Math.max(15, Math.min(35, newValue))
            break
          case "occupancy":
            newValue = Math.max(0, Math.min(30, Math.floor(newValue)))
            break
          case "noise":
            newValue = Math.max(25, Math.min(80, newValue))
            break
          case "air_quality":
            newValue = Math.max(300, Math.min(1500, newValue))
            break
        }

        device.lastReading = newValue

        const reading: IoTReading = {
          deviceId: device.id,
          timestamp: new Date(),
          value: newValue,
          quality: this.getQuality(device, newValue),
        }

        this.readings.push(reading)

        // Manter apenas últimas 1000 leituras
        if (this.readings.length > 1000) {
          this.readings = this.readings.slice(-1000)
        }
      })
    }, 5000) // Atualiza a cada 5 segundos
  }

  private getQuality(device: IoTDevice, value: number): "good" | "warning" | "critical" {
    const { min, max } = device.threshold
    const range = max - min
    const warningZone = range * 0.1

    if (value < min - warningZone || value > max + warningZone) {
      return "critical"
    } else if (value < min + warningZone || value > max - warningZone) {
      return "warning"
    }
    return "good"
  }

  getDevices(): IoTDevice[] {
    return Array.from(this.devices.values())
  }

  getDeviceById(id: string): IoTDevice | undefined {
    return this.devices.get(id)
  }

  getRecentReadings(deviceId: string, limit = 50): IoTReading[] {
    return this.readings.filter((reading) => reading.deviceId === deviceId).slice(-limit)
  }

  getSmartClassrooms(): SmartClassroom[] {
    const classrooms: SmartClassroom[] = []
    const locations = [...new Set(Array.from(this.devices.values()).map((d) => d.location))]

    locations.forEach((location) => {
      const locationDevices = Array.from(this.devices.values()).filter((d) => d.location === location)

      const tempDevice = locationDevices.find((d) => d.type === "temperature")
      const occDevice = locationDevices.find((d) => d.type === "occupancy")
      const noiseDevice = locationDevices.find((d) => d.type === "noise")
      const airDevice = locationDevices.find((d) => d.type === "air_quality")

      const temperature = tempDevice?.lastReading || 22
      const occupancy = occDevice?.lastReading || 0
      const noise = noiseDevice?.lastReading || 40
      const airQuality = airDevice?.lastReading || 400

      const recommendations: string[] = []
      let isOptimal = true

      if (temperature > 26) {
        recommendations.push("Reduzir temperatura do ar condicionado")
        isOptimal = false
      } else if (temperature < 18) {
        recommendations.push("Aumentar temperatura do ar condicionado")
        isOptimal = false
      }

      if (noise > 60) {
        recommendations.push("Nível de ruído alto - verificar atividades")
        isOptimal = false
      }

      if (airQuality > 1000) {
        recommendations.push("Melhorar ventilação - CO2 elevado")
        isOptimal = false
      }

      if (occupancy > 25) {
        recommendations.push("Sala próxima da capacidade máxima")
        isOptimal = false
      }

      classrooms.push({
        id: location.toLowerCase().replace(" ", "_"),
        name: location,
        capacity: 30,
        currentOccupancy: occupancy,
        temperature,
        humidity: 45 + Math.random() * 20,
        noiseLevel: noise,
        airQuality,
        lightingLevel: 80 + Math.random() * 20,
        isOptimal,
        recommendations,
      })
    })

    return classrooms
  }

  async optimizeClassroom(classroomId: string): Promise<boolean> {
    // Simulação de otimização automática
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const classroom = this.getSmartClassrooms().find((c) => c.id === classroomId)
    if (classroom) {
      // Simular ajustes automáticos
      const devices = Array.from(this.devices.values()).filter((d) => d.location === classroom.name)

      devices.forEach((device) => {
        if (device.type === "temperature" && device.lastReading > 26) {
          device.lastReading = 24
        }
        if (device.type === "air_quality" && device.lastReading > 1000) {
          device.lastReading = 450
        }
      })

      return true
    }
    return false
  }

  getSystemHealth(): {
    totalDevices: number
    onlineDevices: number
    criticalAlerts: number
    batteryLow: number
    uptime: string
  } {
    const devices = Array.from(this.devices.values())
    const criticalReadings = this.readings.filter((r) => r.quality === "critical").length
    const lowBatteryDevices = devices.filter((d) => d.battery && d.battery < 20).length

    return {
      totalDevices: devices.length,
      onlineDevices: devices.filter((d) => d.status === "online").length,
      criticalAlerts: criticalReadings,
      batteryLow: lowBatteryDevices,
      uptime: "99.8%",
    }
  }
}

export const iotService = new IoTService()
