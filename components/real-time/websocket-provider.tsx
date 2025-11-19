"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { WebSocketManager, type WebSocketEvent, type ConnectionStatus } from "@/lib/websocket"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, AlertTriangle, Loader2, X } from "lucide-react"

interface WebSocketContextType {
  status: ConnectionStatus
  isConnected: boolean
  send: (event: WebSocketEvent) => boolean
  subscribe: (listener: (event: WebSocketEvent) => void) => () => void
  simulateEvent: (event: WebSocketEvent) => void
  reconnect: () => void
}

const WebSocketContext = createContext<WebSocketContextType | null>(null)

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [wsManager] = useState(() => {
    // Só cria o WebSocket se estivermos no browser e a URL estiver configurada
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL
    return new WebSocketManager(wsUrl)
  })

  const [status, setStatus] = useState<ConnectionStatus>("disconnected")

  useEffect(() => {
    // Inscreve-se para mudanças de status
    const unsubscribe = wsManager.onStatusChange(setStatus)

    // Tenta conectar apenas se a URL estiver configurada
    if (process.env.NEXT_PUBLIC_WS_URL) {
      wsManager.connect()
    } else {
      console.log("ℹ️ WebSocket URL não configurada - funcionando em modo offline")
    }

    return () => {
      unsubscribe()
      wsManager.disconnect()
    }
  }, [wsManager])

  const send = useCallback(
    (event: WebSocketEvent) => {
      return wsManager.send(event)
    },
    [wsManager],
  )

  const subscribe = useCallback(
    (listener: (event: WebSocketEvent) => void) => {
      return wsManager.subscribe(listener)
    },
    [wsManager],
  )

  const simulateEvent = useCallback(
    (event: WebSocketEvent) => {
      wsManager.simulateEvent(event)
    },
    [wsManager],
  )

  const reconnect = useCallback(() => {
    wsManager.enable()
  }, [wsManager])

  const value = {
    status,
    isConnected: status === "connected",
    send,
    subscribe,
    simulateEvent,
    reconnect,
  }

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>
}

export function useWebSocket() {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error("useWebSocket deve ser usado dentro de WebSocketProvider")
  }
  return context
}

export function WebSocketStatus() {
  const { status, reconnect } = useWebSocket()

  const getStatusConfig = (status: ConnectionStatus) => {
    switch (status) {
      case "connected":
        return {
          variant: "default" as const,
          icon: <Wifi className="h-3 w-3" />,
          text: "Conectado",
          className: "bg-green-100 text-green-800 border-green-200",
        }
      case "connecting":
        return {
          variant: "secondary" as const,
          icon: <Loader2 className="h-3 w-3 animate-spin" />,
          text: "Conectando...",
          className: "bg-blue-100 text-blue-800 border-blue-200",
        }
      case "error":
        return {
          variant: "destructive" as const,
          icon: <AlertTriangle className="h-3 w-3" />,
          text: "Erro",
          className: "bg-red-100 text-red-800 border-red-200 cursor-pointer",
        }
      case "disabled":
        return {
          variant: "outline" as const,
          icon: <X className="h-3 w-3" />,
          text: "Offline",
          className: "bg-gray-100 text-gray-600 border-gray-200",
        }
      default:
        return {
          variant: "outline" as const,
          icon: <WifiOff className="h-3 w-3" />,
          text: "Desconectado",
          className: "bg-yellow-100 text-yellow-800 border-yellow-200 cursor-pointer",
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Badge
        variant={config.variant}
        className={`flex items-center gap-2 ${config.className}`}
        onClick={status === "error" || status === "disconnected" ? reconnect : undefined}
        title={status === "error" || status === "disconnected" ? "Clique para reconectar" : undefined}
      >
        {config.icon}
        {config.text}
      </Badge>
    </div>
  )
}

// Hook para simular eventos em desenvolvimento
export function useWebSocketSimulator() {
  const { simulateEvent } = useWebSocket()

  const simulateDeviceAlert = useCallback(() => {
    simulateEvent({
      type: "NEW_ALERT",
      payload: {
        message: "Servidor principal com alta utilização de CPU (85%)",
        severity: "high",
      },
    })
  }, [simulateEvent])

  const simulateDeviceStatusChange = useCallback(() => {
    simulateEvent({
      type: "DEVICE_STATUS_CHANGED",
      payload: {
        deviceId: "srv-001",
        status: "warning",
      },
    })
  }, [simulateEvent])

  const simulateSystemUpdate = useCallback(() => {
    simulateEvent({
      type: "SYSTEM_UPDATE",
      payload: {
        component: "Sistema de Monitoramento",
        version: "2.1.0",
      },
    })
  }, [simulateEvent])

  return {
    simulateDeviceAlert,
    simulateDeviceStatusChange,
    simulateSystemUpdate,
  }
}
