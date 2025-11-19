// Tipos para o sistema de analytics
export interface AnalyticsEvent {
  eventName: string
  timestamp: number
  userId?: string
  sessionId: string
  properties: Record<string, any>
}

export interface PageView extends AnalyticsEvent {
  eventName: "page_view"
  properties: {
    path: string
    referrer: string
    title: string
    loadTime?: number
  }
}

export interface UserAction extends AnalyticsEvent {
  eventName: "user_action"
  properties: {
    actionType: string
    targetId?: string
    targetType?: string
    value?: any
  }
}

export interface PerformanceMetric extends AnalyticsEvent {
  eventName: "performance"
  properties: {
    metricName: string
    value: number
    unit: string
  }
}

export interface ErrorEvent extends AnalyticsEvent {
  eventName: "error"
  properties: {
    errorType: string
    errorMessage: string
    stackTrace?: string
    componentName?: string
  }
}

// Classe principal de Analytics
export class Analytics {
  private static instance: Analytics
  private events: AnalyticsEvent[] = []
  private sessionId: string
  private userId: string | null = null
  private flushInterval = 30000 // 30 segundos
  private flushTimer: NodeJS.Timeout | null = null
  private endpoint: string
  private isEnabled = true
  private performanceObserver: PerformanceObserver | null = null

  private constructor() {
    this.sessionId = this.generateSessionId()
    this.endpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT || "/api/analytics"

    // Iniciar timer para envio automático
    this.startFlushTimer()

    // Configurar observador de performance
    this.setupPerformanceObserver()

    // Registrar eventos de ciclo de vida da página
    if (typeof window !== "undefined") {
      this.registerPageLifecycleEvents()
    }
  }

  // Padrão Singleton
  public static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics()
    }
    return Analytics.instance
  }

  // Identificar usuário
  public identify(userId: string, traits?: Record<string, any>): void {
    this.userId = userId

    this.track("identify", {
      userId,
      ...(traits || {}),
    })
  }

  // Registrar visualização de página
  public pageView(path?: string, title?: string, referrer?: string): void {
    if (!this.isEnabled) return

    const event: PageView = {
      eventName: "page_view",
      timestamp: Date.now(),
      userId: this.userId || undefined,
      sessionId: this.sessionId,
      properties: {
        path: path || (typeof window !== "undefined" ? window.location.pathname : ""),
        title: title || (typeof window !== "undefined" ? document.title : ""),
        referrer: referrer || (typeof window !== "undefined" ? document.referrer : ""),
      },
    }

    this.events.push(event)
  }

  // Registrar ação do usuário
  public trackAction(actionType: string, targetId?: string, targetType?: string, value?: any): void {
    if (!this.isEnabled) return

    const event: UserAction = {
      eventName: "user_action",
      timestamp: Date.now(),
      userId: this.userId || undefined,
      sessionId: this.sessionId,
      properties: {
        actionType,
        targetId,
        targetType,
        value,
      },
    }

    this.events.push(event)
  }

  // Registrar evento genérico
  public track(eventName: string, properties: Record<string, any> = {}): void {
    if (!this.isEnabled) return

    const event: AnalyticsEvent = {
      eventName,
      timestamp: Date.now(),
      userId: this.userId || undefined,
      sessionId: this.sessionId,
      properties,
    }

    this.events.push(event)
  }

  // Registrar erro
  public trackError(errorType: string, errorMessage: string, stackTrace?: string, componentName?: string): void {
    if (!this.isEnabled) return

    const event: ErrorEvent = {
      eventName: "error",
      timestamp: Date.now(),
      userId: this.userId || undefined,
      sessionId: this.sessionId,
      properties: {
        errorType,
        errorMessage,
        stackTrace,
        componentName,
      },
    }

    this.events.push(event)

    // Erros são enviados imediatamente
    this.flush()
  }

  // Enviar eventos para o servidor
  public async flush(): Promise<boolean> {
    if (!this.isEnabled || this.events.length === 0) return true

    try {
      const eventsToSend = [...this.events]
      this.events = []

      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          events: eventsToSend,
          metadata: {
            userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
            language: typeof navigator !== "undefined" ? navigator.language : "",
            screenSize: typeof window !== "undefined" ? `${window.innerWidth}x${window.innerHeight}` : "",
            timestamp: Date.now(),
          },
        }),
        // Não falhar se offline
        keepalive: true,
      })

      if (!response.ok) {
        // Restaurar eventos que não foram enviados
        this.events = [...eventsToSend, ...this.events]
        return false
      }

      return true
    } catch (error) {
      // Restaurar eventos que não foram enviados
      this.events = [...this.events]
      console.error("Erro ao enviar eventos de analytics:", error)
      return false
    }
  }

  // Habilitar/desabilitar analytics
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled

    if (typeof window !== "undefined") {
      localStorage.setItem("analytics_enabled", String(enabled))
    }
  }

  // Verificar se analytics está habilitado
  public isAnalyticsEnabled(): boolean {
    return this.isEnabled
  }

  // Gerar ID de sessão único
  private generateSessionId(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === "x" ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  // Iniciar timer para envio automático
  private startFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
    }

    this.flushTimer = setInterval(() => {
      this.flush()
    }, this.flushInterval)
  }

  // Configurar observador de performance
  private setupPerformanceObserver(): void {
    if (typeof window !== "undefined" && "PerformanceObserver" in window) {
      try {
        this.performanceObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (entry.entryType === "largest-contentful-paint") {
              this.trackPerformanceMetric("LCP", entry.startTime, "ms")
            } else if (entry.entryType === "first-input") {
              this.trackPerformanceMetric(
                "FID",
                (entry as PerformanceEventTiming).processingStart - entry.startTime,
                "ms",
              )
            } else if (entry.entryType === "layout-shift") {
              this.trackPerformanceMetric("CLS", (entry as any).value, "")
            }
          }
        })

        this.performanceObserver.observe({
          type: "largest-contentful-paint",
          buffered: true,
        })
        this.performanceObserver.observe({
          type: "first-input",
          buffered: true,
        })
        this.performanceObserver.observe({
          type: "layout-shift",
          buffered: true,
        })
      } catch (e) {
        console.error("Erro ao configurar PerformanceObserver:", e)
      }
    }
  }

  // Registrar métrica de performance
  private trackPerformanceMetric(metricName: string, value: number, unit: string): void {
    if (!this.isEnabled) return

    const event: PerformanceMetric = {
      eventName: "performance",
      timestamp: Date.now(),
      userId: this.userId || undefined,
      sessionId: this.sessionId,
      properties: {
        metricName,
        value,
        unit,
      },
    }

    this.events.push(event)
  }

  // Registrar eventos de ciclo de vida da página
  private registerPageLifecycleEvents(): void {
    // Registrar visualização de página inicial
    this.pageView()

    // Registrar quando a página é carregada completamente
    window.addEventListener("load", () => {
      if (performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart
        this.track("page_loaded", { loadTime })
      }
    })

    // Registrar quando o usuário sai da página
    window.addEventListener("beforeunload", () => {
      this.track("page_exit", {
        timeSpent: Date.now() - (performance.timing?.navigationStart || Date.now()),
      })

      // Tentar enviar eventos antes de sair
      this.flush()
    })

    // Registrar quando a página fica visível/invisível
    document.addEventListener("visibilitychange", () => {
      this.track(document.hidden ? "page_hidden" : "page_visible")
    })
  }
}

// Exportar instância singleton
export const analytics = Analytics.getInstance()
