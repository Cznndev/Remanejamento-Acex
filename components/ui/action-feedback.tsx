"use client"

import { useEffect, useState } from "react"
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ActionFeedbackProps {
  type: "success" | "error" | "info" | "warning"
  message: string
  description?: string
  show: boolean
  onClose?: () => void
  autoClose?: boolean
  duration?: number
}

export function ActionFeedback({
  type,
  message,
  description,
  show,
  onClose,
  autoClose = true,
  duration = 3000,
}: ActionFeedbackProps) {
  const [isVisible, setIsVisible] = useState(show)

  useEffect(() => {
    setIsVisible(show)

    if (show && autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [show, autoClose, duration, onClose])

  if (!isVisible) return null

  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
    warning: AlertTriangle,
  }

  const colors = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  }

  const iconColors = {
    success: "text-green-500",
    error: "text-red-500",
    info: "text-blue-500",
    warning: "text-yellow-500",
  }

  const Icon = icons[type]

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 max-w-md p-4 border rounded-lg shadow-lg transition-all duration-300",
        colors[type],
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn("h-5 w-5 mt-0.5", iconColors[type])} />
        <div className="flex-1">
          <h4 className="font-medium">{message}</h4>
          {description && <p className="text-sm mt-1 opacity-90">{description}</p>}
        </div>
        {onClose && (
          <button
            onClick={() => {
              setIsVisible(false)
              onClose()
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}
