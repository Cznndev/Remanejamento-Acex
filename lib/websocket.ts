export type WebSocketEvent =
  | { type: "DEVICE_STATUS_CHANGED"; payload: { deviceId: string; status: string } }
  | { type: "NEW_ALERT"; payload: { message: string; severity: "low" | "medium" | "high" } }
  | { type: "SYSTEM_UPDATE"; payload: { component: string; version: string } }
  | { type: "USER_ACTIVITY"; payload: { userId: string; action: string } }

export type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error" | "disabled"

export class WebSocketManager {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 3
  private reconnectDelay = 2000
  private listeners: ((event: WebSocketEvent) => void)[] = []
  private statusListeners: ((status: ConnectionStatus) => void)[] = []
  private currentStatus: ConnectionStatus = "disconnected"
  private isEnabled = false

  constructor(private url?: string) {
    // Só habilita WebSocket se a URL estiver configurada e estivermos no browser
    this.isEnabled = !!(url && typeof window !== "undefined")
  }

  private setStatus(status: ConnectionStatus) {
    if (this.currentStatus !== status) {
      this.currentStatus = status
      this.statusListeners.forEach((listener) => listener(status))
    }
  }

  connect() {
    // Se WebSocket não estiver habilitado, não tenta conectar
    if (!this.isEnabled || !this.url) {
      this.setStatus("disabled")
      return
    }

    // Se já está conectado ou conectando, não faz nada
    if (this.currentStatus === "connected" || this.currentStatus === "connecting") {
      return
    }

    try {
      this.setStatus("connecting")
      this.ws = new WebSocket(this.url)

      this.ws.onopen = () => {
        console.log("✅ WebSocket conectado com sucesso")
        this.reconnectAttempts = 0
        this.setStatus("connected")
      }

      this.ws.onmessage = (event) => {
        try {
          const data: WebSocketEvent = JSON.parse(event.data)
          this.listeners.forEach((listener) => {
            try {
              listener(data)
            } catch (error) {
              console.error("Erro no listener WebSocket:", error)
            }
          })
        } catch (error) {
          console.error("Erro ao processar mensagem WebSocket:", error)
        }
      }

      this.ws.onclose = (event) => {
        console.log("🔌 WebSocket desconectado:", event.code, event.reason)
        this.ws = null

        if (this.currentStatus !== "disabled") {
          this.setStatus("disconnected")
          this.scheduleReconnect()
        }
      }

      this.ws.onerror = (error) => {
        console.warn("⚠️ Erro WebSocket (tentando reconectar):", error)
        this.setStatus("error")
        // Não logga erro detalhado para evitar spam no console
      }

      // Timeout para conexão
      setTimeout(() => {
        if (this.ws?.readyState === WebSocket.CONNECTING) {
          console.warn("⏰ Timeout na conexão WebSocket")
          this.ws.close()
        }
      }, 5000)
    } catch (error) {
      console.error("❌ Erro ao criar WebSocket:", error)
      this.setStatus("error")
      this.scheduleReconnect()
    }
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts && this.isEnabled) {
      this.reconnectAttempts++
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1) // Backoff exponencial

      console.log(
        `🔄 Reagendando reconexão em ${delay}ms (tentativa ${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
      )

      setTimeout(() => {
        if (this.currentStatus !== "connected" && this.currentStatus !== "disabled") {
          this.connect()
        }
      }, delay)
    } else {
      console.log("🚫 Máximo de tentativas de reconexão atingido ou WebSocket desabilitado")
      this.setStatus("error")
    }
  }

  subscribe(listener: (event: WebSocketEvent) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  onStatusChange(listener: (status: ConnectionStatus) => void) {
    this.statusListeners.push(listener)
    // Chama imediatamente com o status atual
    listener(this.currentStatus)

    return () => {
      this.statusListeners = this.statusListeners.filter((l) => l !== listener)
    }
  }

  send(event: WebSocketEvent) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(event))
        return true
      } catch (error) {
        console.error("Erro ao enviar mensagem WebSocket:", error)
        return false
      }
    }
    return false
  }

  disconnect() {
    this.isEnabled = false
    this.setStatus("disabled")

    if (this.ws) {
      this.ws.close(1000, "Desconexão manual")
      this.ws = null
    }

    this.listeners = []
    this.statusListeners = []
  }

  getStatus(): ConnectionStatus {
    return this.currentStatus
  }

  isConnected(): boolean {
    return this.currentStatus === "connected"
  }

  // Método para reativar o WebSocket
  enable() {
    if (this.url && typeof window !== "undefined") {
      this.isEnabled = true
      this.reconnectAttempts = 0
      this.connect()
    }
  }

  // Método para simular eventos (útil para desenvolvimento)
  simulateEvent(event: WebSocketEvent) {
    console.log("🎭 Simulando evento WebSocket:", event)
    this.listeners.forEach((listener) => listener(event))
  }
}
