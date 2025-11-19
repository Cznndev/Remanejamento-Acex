"use client"

import type React from "react"
import { createContext, useContext, useEffect, useCallback } from "react"

interface AnalyticsContextType {
  track: (event: string, properties?: Record<string, any>) => void
  identify: (userId: string, traits?: Record<string, any>) => void
  page: (name: string, properties?: Record<string, any>) => void
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null)

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const track = useCallback(async (event: string, properties?: Record<string, any>) => {
    try {
      await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "track",
          event,
          properties: {
            ...properties,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
          },
        }),
      })
    } catch (error) {
      console.error("Erro ao enviar evento de analytics:", error)
    }
  }, [])

  const identify = useCallback(async (userId: string, traits?: Record<string, any>) => {
    try {
      await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "identify",
          userId,
          traits: {
            ...traits,
            timestamp: new Date().toISOString(),
          },
        }),
      })
    } catch (error) {
      console.error("Erro ao identificar usuário:", error)
    }
  }, [])

  const page = useCallback(async (name: string, properties?: Record<string, any>) => {
    try {
      await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "page",
          name,
          properties: {
            ...properties,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            referrer: document.referrer,
          },
        }),
      })
    } catch (error) {
      console.error("Erro ao registrar página:", error)
    }
  }, [])

  // Rastrear Core Web Vitals
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("web-vitals")
        .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
          getCLS((metric) => track("Core Web Vitals", { metric: "CLS", value: metric.value }))
          getFID((metric) => track("Core Web Vitals", { metric: "FID", value: metric.value }))
          getFCP((metric) => track("Core Web Vitals", { metric: "FCP", value: metric.value }))
          getLCP((metric) => track("Core Web Vitals", { metric: "LCP", value: metric.value }))
          getTTFB((metric) => track("Core Web Vitals", { metric: "TTFB", value: metric.value }))
        })
        .catch(() => {
          // web-vitals não disponível, continuar sem métricas
        })
    }
  }, [track])

  return <AnalyticsContext.Provider value={{ track, identify, page }}>{children}</AnalyticsContext.Provider>
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (!context) {
    throw new Error("useAnalytics deve ser usado dentro de AnalyticsProvider")
  }
  return context
}
