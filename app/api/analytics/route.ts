import { type NextRequest, NextResponse } from "next/server"

// Interface para eventos de analytics
interface AnalyticsEvent {
  eventName: string
  timestamp: number
  userId?: string
  sessionId: string
  properties: Record<string, any>
}

interface AnalyticsPayload {
  events: AnalyticsEvent[]
  metadata: {
    userAgent: string
    language: string
    screenSize: string
    timestamp: number
  }
}

// Simulação de armazenamento (em produção, usar banco de dados)
const analyticsStore: AnalyticsEvent[] = []

export async function POST(request: NextRequest) {
  try {
    const payload: AnalyticsPayload = await request.json()

    // Validar payload
    if (!payload.events || !Array.isArray(payload.events)) {
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 })
    }

    // Processar eventos
    for (const event of payload.events) {
      // Validar evento
      if (!event.eventName || !event.timestamp || !event.sessionId) {
        continue
      }

      // Adicionar metadados do request
      const enrichedEvent = {
        ...event,
        metadata: {
          ...payload.metadata,
          ip: request.ip || "unknown",
          userAgent: request.headers.get("user-agent") || "unknown",
        },
      }

      // Armazenar evento (em produção, salvar no banco)
      analyticsStore.push(enrichedEvent)

      // Log para debug
      console.log("Analytics Event:", {
        eventName: event.eventName,
        userId: event.userId,
        sessionId: event.sessionId,
        timestamp: new Date(event.timestamp).toISOString(),
      })
    }

    // Processar eventos em tempo real (opcional)
    await processRealTimeEvents(payload.events)

    return NextResponse.json({
      success: true,
      processed: payload.events.length,
    })
  } catch (error) {
    console.error("Erro ao processar analytics:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "100")
    const eventType = searchParams.get("eventType")
    const userId = searchParams.get("userId")
    const sessionId = searchParams.get("sessionId")

    // Filtrar eventos
    let filteredEvents = analyticsStore

    if (eventType) {
      filteredEvents = filteredEvents.filter((event) => event.eventName === eventType)
    }

    if (userId) {
      filteredEvents = filteredEvents.filter((event) => event.userId === userId)
    }

    if (sessionId) {
      filteredEvents = filteredEvents.filter((event) => event.sessionId === sessionId)
    }

    // Ordenar por timestamp (mais recentes primeiro)
    filteredEvents.sort((a, b) => b.timestamp - a.timestamp)

    // Limitar resultados
    const limitedEvents = filteredEvents.slice(0, limit)

    // Estatísticas básicas
    const stats = {
      totalEvents: analyticsStore.length,
      filteredEvents: filteredEvents.length,
      uniqueUsers: new Set(analyticsStore.map((e) => e.userId).filter(Boolean)).size,
      uniqueSessions: new Set(analyticsStore.map((e) => e.sessionId)).size,
      eventTypes: Object.entries(
        analyticsStore.reduce(
          (acc, event) => {
            acc[event.eventName] = (acc[event.eventName] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        ),
      ).map(([name, count]) => ({ name, count })),
    }

    return NextResponse.json({
      events: limitedEvents,
      stats,
      pagination: {
        limit,
        total: filteredEvents.length,
        hasMore: filteredEvents.length > limit,
      },
    })
  } catch (error) {
    console.error("Erro ao buscar analytics:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

// Processar eventos em tempo real
async function processRealTimeEvents(events: AnalyticsEvent[]) {
  for (const event of events) {
    // Detectar padrões interessantes
    if (event.eventName === "error") {
      console.warn("Erro detectado:", event.properties)
      // Aqui você poderia enviar alertas, notificações, etc.
    }

    if (event.eventName === "performance" && event.properties.value > 3000) {
      console.warn("Performance ruim detectada:", event.properties)
      // Alertar sobre performance ruim
    }

    // Detectar usuários muito ativos
    const userEvents = analyticsStore.filter(
      (e) => e.userId === event.userId && e.timestamp > Date.now() - 60000, // últimos 60 segundos
    )

    if (userEvents.length > 50) {
      console.log("Usuário muito ativo detectado:", event.userId)
      // Possível bot ou uso intensivo
    }
  }
}
