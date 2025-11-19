"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from "lucide-react"

interface ToastNotification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export function ToastNotifications() {
  const [toasts, setToasts] = useState<ToastNotification[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Verifica se o usuário está autenticado
    const auth = localStorage.getItem("et-wicca-auth")
    setIsAuthenticated(!!auth)

    // Se não estiver autenticado, não mostra notificações
    if (!auth) {
      setToasts([])
      return
    }

    // Resto do código de notificações...
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% de chance a cada 10 segundos
        const newToast: ToastNotification = {
          id: Date.now().toString(),
          title: getRandomToastTitle(),
          message: getRandomToastMessage(),
          type: getRandomToastType(),
          duration: 5000,
        }

        addToast(newToast)
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const getRandomToastTitle = () => {
    const titles = [
      "Sistema Atualizado",
      "Backup Concluído",
      "Alerta de CPU",
      "Novo Dispositivo",
      "Manutenção Agendada",
    ]
    return titles[Math.floor(Math.random() * titles.length)]
  }

  const getRandomToastMessage = () => {
    const messages = [
      "O sistema foi atualizado com sucesso",
      "Backup automático concluído",
      "CPU do servidor acima de 85%",
      "Novo laptop adicionado ao inventário",
      "Manutenção programada para amanhã",
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  const getRandomToastType = (): ToastNotification["type"] => {
    const types: ToastNotification["type"][] = ["info", "success", "warning", "error"]
    return types[Math.floor(Math.random() * types.length)]
  }

  const addToast = (toast: ToastNotification) => {
    setToasts((prev) => [...prev, toast])

    if (toast.duration) {
      setTimeout(() => {
        removeToast(toast.id)
      }, toast.duration)
    }
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const getToastIcon = (type: ToastNotification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getToastStyles = (type: ToastNotification["type"]) => {
    switch (type) {
      case "success":
        return "border-green-200 bg-green-50"
      case "warning":
        return "border-amber-200 bg-amber-50"
      case "error":
        return "border-red-200 bg-red-50"
      case "info":
      default:
        return "border-blue-200 bg-blue-50"
    }
  }

  // Se não estiver autenticado, não renderiza nada
  if (!isAuthenticated) return null

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <Card
          key={toast.id}
          className={`p-4 shadow-lg animate-in slide-in-from-right-full ${getToastStyles(toast.type)}`}
        >
          <div className="flex items-start gap-3">
            {getToastIcon(toast.type)}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900">{toast.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{toast.message}</p>
              {toast.action && (
                <Button variant="outline" size="sm" className="mt-2" onClick={toast.action.onClick}>
                  {toast.action.label}
                </Button>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-gray-600"
              onClick={() => removeToast(toast.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
