"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, Check, Mail, MessageSquare, Smartphone } from "lucide-react"
import { NotificationService } from "@/lib/notifications/notification-service"
import type { Notification } from "@/lib/notifications/types"

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const notificationService = NotificationService.getInstance()

  useEffect(() => {
    const loadNotifications = () => {
      const allNotifications = notificationService.getNotifications()
      setNotifications(allNotifications)
    }

    loadNotifications()
    const interval = setInterval(loadNotifications, 5000) // Atualiza a cada 5 segundos

    return () => clearInterval(interval)
  }, [])

  const unreadCount = notifications.filter((n) => !n.lida).length

  const marcarComoLida = (notificationId: string) => {
    notificationService.marcarComoLida(notificationId)
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, lida: true } : n)))
  }

  const getIconForChannel = (canal: string) => {
    switch (canal) {
      case "email":
        return <Mail className="h-4 w-4" />
      case "sms":
        return <Smartphone className="h-4 w-4" />
      case "whatsapp":
        return <MessageSquare className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case "critica":
        return "destructive"
      case "alta":
        return "default"
      case "media":
        return "secondary"
      case "baixa":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="relative">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-12 w-96 z-50 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              Notificações
              {unreadCount > 0 && <Badge variant="secondary">{unreadCount} não lidas</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">Nenhuma notificação</div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b hover:bg-muted/50 cursor-pointer ${
                        !notification.lida ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                      }`}
                      onClick={() => marcarComoLida(notification.id)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {getIconForChannel(notification.canal)}
                            <span className="font-medium text-sm truncate">{notification.titulo}</span>
                            <Badge variant={getPriorityColor(notification.prioridade)} className="text-xs">
                              {notification.prioridade}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{notification.mensagem}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">
                              {notification.criadoEm.toLocaleString("pt-BR")}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {notification.status}
                            </Badge>
                          </div>
                        </div>
                        {!notification.lida && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              marcarComoLida(notification.id)
                            }}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
