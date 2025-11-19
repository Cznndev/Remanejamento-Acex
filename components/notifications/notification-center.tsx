"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Bell,
  BellRing,
  Check,
  Settings,
  Trash2,
  AlertTriangle,
  Info,
  CheckCircle,
  Filter,
  MoreHorizontal,
} from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "error" | "success"
  priority: "low" | "medium" | "high" | "critical"
  timestamp: Date
  read: boolean
  category: "hardware" | "software" | "network" | "database" | "system" | "security"
  actionUrl?: string
  metadata?: Record<string, any>
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [filter, setFilter] = useState<"all" | "unread" | "priority">("all")
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Move all helper functions here, before useEffect
  const getRandomNotificationTitle = () => {
    const titles = [
      "Atualização de Sistema Disponível",
      "Manutenção Programada",
      "Novo Dispositivo Conectado",
      "Threshold de Memória Atingido",
      "Certificado SSL Renovado",
      "Backup Agendado Iniciado",
    ]
    return titles[Math.floor(Math.random() * titles.length)]
  }

  const getRandomNotificationMessage = () => {
    const messages = [
      "Uma nova atualização está disponível para o sistema operacional",
      "Manutenção programada para o servidor web às 02:00",
      "Novo smartphone foi conectado à rede corporativa",
      "Uso de memória do servidor atingiu 85%",
      "Certificado SSL foi renovado automaticamente",
      "Backup automático foi iniciado conforme programação",
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  const getRandomType = (): Notification["type"] => {
    const types: Notification["type"][] = ["info", "warning", "error", "success"]
    return types[Math.floor(Math.random() * types.length)]
  }

  const getRandomPriority = (): Notification["priority"] => {
    const priorities: Notification["priority"][] = ["low", "medium", "high", "critical"]
    return priorities[Math.floor(Math.random() * priorities.length)]
  }

  const getRandomCategory = (): Notification["category"] => {
    const categories: Notification["category"][] = ["hardware", "software", "network", "database", "system", "security"]
    return categories[Math.floor(Math.random() * categories.length)]
  }

  // Now the useEffect can safely use these functions
  useEffect(() => {
    // Verifica se o usuário está autenticado
    const auth = localStorage.getItem("et-wicca-auth")
    setIsAuthenticated(!!auth)

    // Se não estiver autenticado, não carrega notificações
    if (!auth) {
      setNotifications([])
      setUnreadCount(0)
      return
    }

    // Notificações iniciais
    const initialNotifications: Notification[] = [
      {
        id: "1",
        title: "CPU Alto no Servidor DB-01",
        message: "O servidor de banco de dados está com uso de CPU acima de 90% há 15 minutos",
        type: "warning",
        priority: "high",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
        category: "hardware",
        actionUrl: "/dashboard?tab=monitoramento",
        metadata: { server: "DB-01", cpu: 92 },
      },
      {
        id: "2",
        title: "Backup Concluído",
        message: "Backup automático do servidor de arquivos concluído com sucesso",
        type: "success",
        priority: "low",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: false,
        category: "system",
        metadata: { size: "2.3TB", duration: "45min" },
      },
      {
        id: "3",
        title: "Licença Adobe Expirando",
        message: "A licença do Adobe Creative Cloud expira em 7 dias",
        type: "warning",
        priority: "medium",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: true,
        category: "software",
        actionUrl: "/dashboard?tab=software",
        metadata: { license: "Adobe Creative Cloud", daysLeft: 7 },
      },
      {
        id: "4",
        title: "Novo Hardware Adicionado",
        message: "Laptop Dell XPS 15 foi adicionado ao inventário",
        type: "info",
        priority: "low",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        read: true,
        category: "hardware",
        metadata: { device: "Dell XPS 15", serial: "XPS159876" },
      },
      {
        id: "5",
        title: "Tentativa de Acesso Suspeita",
        message: "Múltiplas tentativas de login falharam para o usuário admin",
        type: "error",
        priority: "critical",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        read: false,
        category: "security",
        metadata: { attempts: 5, ip: "192.168.1.100" },
      },
    ]

    setNotifications(initialNotifications)
    setUnreadCount(initialNotifications.filter((n) => !n.read).length)

    // Simular novas notificações a cada 30 segundos
    const interval = setInterval(() => {
      // Verificar novamente se ainda está autenticado
      const stillAuth = localStorage.getItem("et-wicca-auth")
      if (!stillAuth) {
        clearInterval(interval)
        return
      }

      const newNotification: Notification = {
        id: Date.now().toString(),
        title: getRandomNotificationTitle(),
        message: getRandomNotificationMessage(),
        type: getRandomType(),
        priority: getRandomPriority(),
        timestamp: new Date(),
        read: false,
        category: getRandomCategory(),
      }

      setNotifications((prev) => [newNotification, ...prev.slice(0, 49)]) // Manter apenas 50 notificações
      setUnreadCount((prev) => prev + 1)
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Se não estiver autenticado, não renderiza nada
  if (!isAuthenticated) return null

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "info":
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getPriorityColor = (priority: Notification["priority"]) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "low":
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
    setUnreadCount(0)
  }

  const deleteNotification = (id: string) => {
    const notification = notifications.find((n) => n.id === id)
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    if (notification && !notification.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1))
    }
  }

  const clearAllNotifications = () => {
    setNotifications([])
    setUnreadCount(0)
  }

  const filteredNotifications = notifications.filter((notification) => {
    switch (filter) {
      case "unread":
        return !notification.read
      case "priority":
        return notification.priority === "high" || notification.priority === "critical"
      default:
        return true
    }
  })

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Agora"
    if (minutes < 60) return `${minutes}min atrás`
    if (hours < 24) return `${hours}h atrás`
    return `${days}d atrás`
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5 text-blue-600" />
          ) : (
            <Bell className="h-5 w-5 text-gray-600" />
          )}
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between p-4 border-b border-blue-100">
          <div>
            <h3 className="font-semibold text-blue-800">Notificações</h3>
            <p className="text-sm text-blue-600">{unreadCount > 0 ? `${unreadCount} não lidas` : "Todas lidas"}</p>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilter("all")}>Todas</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("unread")}>Não lidas</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("priority")}>Alta prioridade</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Configurações de Notificação</DialogTitle>
                  <DialogDescription>Configure suas preferências de notificação</DialogDescription>
                </DialogHeader>
                <NotificationSettings />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <ScrollArea className="h-96">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhuma notificação encontrada</p>
            </div>
          ) : (
            <div className="p-2">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border mb-2 transition-all hover:bg-blue-50 ${
                    !notification.read ? "bg-blue-50/50 border-blue-200" : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 truncate">{notification.title}</h4>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className={`text-xs ${getPriorityColor(notification.priority)}`}>
                              {notification.priority}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {notification.category}
                            </Badge>
                            <span className="text-xs text-gray-500">{formatTimestamp(notification.timestamp)}</span>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {!notification.read && (
                              <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                <Check className="h-4 w-4 mr-2" />
                                Marcar como lida
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => deleteNotification(notification.id)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <div className="p-4 border-t border-blue-100 space-y-2">
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead} className="flex-1 text-xs">
                  <Check className="h-3 w-3 mr-1" />
                  Marcar todas como lidas
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={clearAllNotifications} className="flex-1 text-xs">
                <Trash2 className="h-3 w-3 mr-1" />
                Limpar todas
              </Button>
            </div>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Componente de configurações de notificação
function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    soundEnabled: true,
    criticalOnly: false,
    categories: {
      hardware: true,
      software: true,
      network: true,
      database: true,
      system: true,
      security: true,
    },
    quietHours: {
      enabled: false,
      start: "22:00",
      end: "08:00",
    },
  })

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Tipos de Notificação</h4>
        <div className="space-y-3">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => setSettings((prev) => ({ ...prev, emailNotifications: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <span className="text-sm">Notificações por email</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={(e) => setSettings((prev) => ({ ...prev, pushNotifications: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <span className="text-sm">Notificações push</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => setSettings((prev) => ({ ...prev, soundEnabled: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <span className="text-sm">Som de notificação</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.criticalOnly}
              onChange={(e) => setSettings((prev) => ({ ...prev, criticalOnly: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <span className="text-sm">Apenas notificações críticas</span>
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Categorias</h4>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(settings.categories).map(([category, enabled]) => (
            <label key={category} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    categories: { ...prev.categories, [category]: e.target.checked },
                  }))
                }
                className="rounded border-gray-300"
              />
              <span className="text-sm capitalize">{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Horário Silencioso</h4>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={settings.quietHours.enabled}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                quietHours: { ...prev.quietHours, enabled: e.target.checked },
              }))
            }
            className="rounded border-gray-300"
          />
          <span className="text-sm">Ativar horário silencioso</span>
        </label>
        {settings.quietHours.enabled && (
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-gray-600">Início</label>
              <input
                type="time"
                value={settings.quietHours.start}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    quietHours: { ...prev.quietHours, start: e.target.value },
                  }))
                }
                className="w-full mt-1 px-2 py-1 border rounded text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-600">Fim</label>
              <input
                type="time"
                value={settings.quietHours.end}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    quietHours: { ...prev.quietHours, end: e.target.value },
                  }))
                }
                className="w-full mt-1 px-2 py-1 border rounded text-sm"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" size="sm">
          Cancelar
        </Button>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          Salvar Configurações
        </Button>
      </div>
    </div>
  )
}
