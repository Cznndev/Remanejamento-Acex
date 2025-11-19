"use client"

import { useCallback } from "react"

interface AuditLogEntry {
  action: string
  module: string
  resource: string
  resourceId?: string
  details: string
  severity: "low" | "medium" | "high" | "critical"
  oldValues?: Record<string, any>
  newValues?: Record<string, any>
}

export function useAuditLogger() {
  const logAction = useCallback((entry: AuditLogEntry) => {
    // Obter informações do usuário atual
    const userData = localStorage.getItem("et-wicca-user")
    if (!userData) return

    const user = JSON.parse(userData)

    // Obter informações da sessão
    const sessionId = localStorage.getItem("et-wicca-session") || `sess_${Date.now()}`
    if (!localStorage.getItem("et-wicca-session")) {
      localStorage.setItem("et-wicca-session", sessionId)
    }

    // Criar log de auditoria
    const auditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      userId: user.id || "unknown",
      userName: user.name || "Unknown User",
      userRole: user.role || "unknown",
      action: entry.action,
      module: entry.module,
      resource: entry.resource,
      resourceId: entry.resourceId,
      details: entry.details,
      ipAddress: "192.168.1.100", // Em produção, seria obtido do servidor
      userAgent: navigator.userAgent,
      location: "São Paulo, SP", // Em produção, seria obtido via geolocalização
      severity: entry.severity,
      status: "success" as const,
      sessionId: sessionId,
      duration: Math.floor(Math.random() * 3000) + 500, // Simulado
      oldValues: entry.oldValues,
      newValues: entry.newValues,
    }

    // Salvar no localStorage (em produção seria enviado para API)
    const existingLogs = JSON.parse(localStorage.getItem("et-wicca-audit-logs") || "[]")
    existingLogs.unshift(auditLog) // Adicionar no início

    // Manter apenas os últimos 1000 logs
    if (existingLogs.length > 1000) {
      existingLogs.splice(1000)
    }

    localStorage.setItem("et-wicca-audit-logs", JSON.stringify(existingLogs))
  }, [])

  // Função para logar login
  const logLogin = useCallback(
    (success: boolean, details?: string) => {
      logAction({
        action: success ? "LOGIN" : "LOGIN_FAILED",
        module: "auth",
        resource: "session",
        details: details || (success ? "Login realizado com sucesso" : "Falha no login"),
        severity: success ? "low" : "medium",
      })
    },
    [logAction],
  )

  // Função para logar logout
  const logLogout = useCallback(() => {
    logAction({
      action: "LOGOUT",
      module: "auth",
      resource: "session",
      details: "Usuário fez logout do sistema",
      severity: "low",
    })
  }, [logAction])

  // Função para logar criação
  const logCreate = useCallback(
    (module: string, resource: string, resourceId: string, details: string, newValues?: Record<string, any>) => {
      logAction({
        action: "CREATE",
        module,
        resource,
        resourceId,
        details,
        severity: "medium",
        newValues,
      })
    },
    [logAction],
  )

  // Função para logar atualização
  const logUpdate = useCallback(
    (
      module: string,
      resource: string,
      resourceId: string,
      details: string,
      oldValues?: Record<string, any>,
      newValues?: Record<string, any>,
    ) => {
      logAction({
        action: "UPDATE",
        module,
        resource,
        resourceId,
        details,
        severity: "medium",
        oldValues,
        newValues,
      })
    },
    [logAction],
  )

  // Função para logar exclusão
  const logDelete = useCallback(
    (module: string, resource: string, resourceId: string, details: string, oldValues?: Record<string, any>) => {
      logAction({
        action: "DELETE",
        module,
        resource,
        resourceId,
        details,
        severity: "high",
        oldValues,
      })
    },
    [logAction],
  )

  // Função para logar visualização
  const logView = useCallback(
    (module: string, resource: string, resourceId?: string, details?: string) => {
      logAction({
        action: "VIEW",
        module,
        resource,
        resourceId,
        details: details || `Visualizou ${resource}`,
        severity: "low",
      })
    },
    [logAction],
  )

  // Função para logar exportação
  const logExport = useCallback(
    (module: string, resource: string, details: string) => {
      logAction({
        action: "EXPORT",
        module,
        resource,
        details,
        severity: "medium",
      })
    },
    [logAction],
  )

  // Função para logar mudanças de configuração
  const logConfigChange = useCallback(
    (
      module: string,
      resource: string,
      details: string,
      oldValues?: Record<string, any>,
      newValues?: Record<string, any>,
    ) => {
      logAction({
        action: "CONFIG_CHANGE",
        module,
        resource,
        details,
        severity: "critical",
        oldValues,
        newValues,
      })
    },
    [logAction],
  )

  return {
    logAction,
    logLogin,
    logLogout,
    logCreate,
    logUpdate,
    logDelete,
    logView,
    logExport,
    logConfigChange,
  }
}
