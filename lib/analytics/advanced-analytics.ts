export interface MetricEvent {
  id: string
  type: "remanejamento" | "aprovacao" | "conflito" | "usuario" | "performance"
  action: string
  data: Record<string, any>
  timestamp: Date
  userId?: string
  sessionId: string
}

export interface AnalyticsReport {
  periodo: {
    inicio: Date
    fim: Date
  }
  metricas: {
    totalRemanejamentos: number
    tempoMedioAprovacao: number
    taxaAprovacao: number
    conflitosResolvidos: number
    eficienciaAlgoritmos: Record<string, number>
    usuariosAtivos: number
    tempoMedioResposta: number
  }
  tendencias: {
    remanejamentosPorDia: Array<{ data: string; quantidade: number }>
    aprovacoesPorHora: Array<{ hora: number; quantidade: number }>
    conflitosRecorrentes: Array<{ tipo: string; frequencia: number }>
  }
  insights: string[]
}

export class AdvancedAnalyticsService {
  private static instance: AdvancedAnalyticsService
  private events: MetricEvent[] = []
  private sessionId = this.generateSessionId()

  static getInstance(): AdvancedAnalyticsService {
    if (!AdvancedAnalyticsService.instance) {
      AdvancedAnalyticsService.instance = new AdvancedAnalyticsService()
    }
    return AdvancedAnalyticsService.instance
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  track(type: MetricEvent["type"], action: string, data: Record<string, any> = {}, userId?: string): void {
    const event: MetricEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      action,
      data,
      timestamp: new Date(),
      userId,
      sessionId: this.sessionId,
    }

    this.events.push(event)

    // Simular envio para analytics (em produção seria para um serviço real)
    console.log("📊 Analytics Event:", event)
  }

  generateReport(inicio: Date, fim: Date): AnalyticsReport {
    const eventsInPeriod = this.events.filter((e) => e.timestamp >= inicio && e.timestamp <= fim)

    const remanejamentos = eventsInPeriod.filter((e) => e.type === "remanejamento")
    const aprovacoes = eventsInPeriod.filter((e) => e.type === "aprovacao")
    const conflitos = eventsInPeriod.filter((e) => e.type === "conflito")

    // Calcular métricas
    const totalRemanejamentos = remanejamentos.length
    const aprovados = aprovacoes.filter((e) => e.action === "aprovado").length
    const rejeitados = aprovacoes.filter((e) => e.action === "rejeitado").length
    const taxaAprovacao = aprovacoes.length > 0 ? (aprovados / aprovacoes.length) * 100 : 0

    // Tempo médio de aprovação
    const temposAprovacao = aprovacoes.filter((e) => e.data.tempoProcessamento).map((e) => e.data.tempoProcessamento)
    const tempoMedioAprovacao =
      temposAprovacao.length > 0 ? temposAprovacao.reduce((a, b) => a + b, 0) / temposAprovacao.length : 0

    // Usuários únicos
    const usuariosUnicos = new Set(eventsInPeriod.filter((e) => e.userId).map((e) => e.userId))

    // Tendências por dia
    const remanejamentosPorDia = this.groupByDay(remanejamentos)
    const aprovacoesPorHora = this.groupByHour(aprovacoes)

    // Conflitos recorrentes
    const conflitosRecorrentes = this.analyzeRecurringConflicts(conflitos)

    // Gerar insights
    const insights = this.generateInsights({
      totalRemanejamentos,
      taxaAprovacao,
      tempoMedioAprovacao,
      conflitosRecorrentes,
    })

    return {
      periodo: { inicio, fim },
      metricas: {
        totalRemanejamentos,
        tempoMedioAprovacao,
        taxaAprovacao,
        conflitosResolvidos: conflitos.filter((e) => e.action === "resolvido").length,
        eficienciaAlgoritmos: this.calculateAlgorithmEfficiency(remanejamentos),
        usuariosAtivos: usuariosUnicos.size,
        tempoMedioResposta: this.calculateAverageResponseTime(eventsInPeriod),
      },
      tendencias: {
        remanejamentosPorDia,
        aprovacoesPorHora,
        conflitosRecorrentes,
      },
      insights,
    }
  }

  private groupByDay(events: MetricEvent[]) {
    const groups = new Map<string, number>()
    events.forEach((event) => {
      const day = event.timestamp.toISOString().split("T")[0]
      groups.set(day, (groups.get(day) || 0) + 1)
    })
    return Array.from(groups.entries()).map(([data, quantidade]) => ({ data, quantidade }))
  }

  private groupByHour(events: MetricEvent[]) {
    const groups = new Map<number, number>()
    events.forEach((event) => {
      const hour = event.timestamp.getHours()
      groups.set(hour, (groups.get(hour) || 0) + 1)
    })
    return Array.from(groups.entries()).map(([hora, quantidade]) => ({ hora, quantidade }))
  }

  private analyzeRecurringConflicts(conflitos: MetricEvent[]) {
    const tipos = new Map<string, number>()
    conflitos.forEach((conflito) => {
      const tipo = conflito.data.motivo || "Não especificado"
      tipos.set(tipo, (tipos.get(tipo) || 0) + 1)
    })
    return Array.from(tipos.entries())
      .map(([tipo, frequencia]) => ({ tipo, frequencia }))
      .sort((a, b) => b.frequencia - a.frequencia)
      .slice(0, 5)
  }

  private calculateAlgorithmEfficiency(remanejamentos: MetricEvent[]) {
    const algoritmos = new Map<string, { total: number; sucessos: number }>()

    remanejamentos.forEach((event) => {
      const algoritmo = event.data.algoritmo || "desconhecido"
      const sucesso = event.data.sucesso || false

      if (!algoritmos.has(algoritmo)) {
        algoritmos.set(algoritmo, { total: 0, sucessos: 0 })
      }

      const stats = algoritmos.get(algoritmo)!
      stats.total++
      if (sucesso) stats.sucessos++
    })

    const result: Record<string, number> = {}
    algoritmos.forEach((stats, algoritmo) => {
      result[algoritmo] = stats.total > 0 ? (stats.sucessos / stats.total) * 100 : 0
    })

    return result
  }

  private calculateAverageResponseTime(events: MetricEvent[]): number {
    const tempos = events.filter((e) => e.data.tempoResposta).map((e) => e.data.tempoResposta)

    return tempos.length > 0 ? tempos.reduce((a, b) => a + b, 0) / tempos.length : 0
  }

  private generateInsights(data: any): string[] {
    const insights: string[] = []

    if (data.taxaAprovacao > 90) {
      insights.push("🎯 Excelente taxa de aprovação! O sistema está funcionando bem.")
    } else if (data.taxaAprovacao < 70) {
      insights.push("⚠️ Taxa de aprovação baixa. Revisar critérios de remanejamento.")
    }

    if (data.tempoMedioAprovacao > 24 * 60 * 60 * 1000) {
      // 24 horas
      insights.push("⏰ Tempo de aprovação acima do ideal. Considerar automatização.")
    }

    if (data.conflitosRecorrentes.length > 0) {
      const principal = data.conflitosRecorrentes[0]
      insights.push(`🔄 Conflito mais frequente: "${principal.tipo}" (${principal.frequencia}x)`)
    }

    if (data.totalRemanejamentos === 0) {
      insights.push("✅ Período sem remanejamentos - sistema estável!")
    }

    return insights
  }

  getRealtimeMetrics() {
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const recentEvents = this.events.filter((e) => e.timestamp >= last24h)

    return {
      eventosUltimas24h: recentEvents.length,
      usuariosAtivos: new Set(recentEvents.filter((e) => e.userId).map((e) => e.userId)).size,
      remanejamentosHoje: recentEvents.filter((e) => e.type === "remanejamento").length,
      aprovacoesHoje: recentEvents.filter((e) => e.type === "aprovacao").length,
      ultimoEvento: this.events[this.events.length - 1],
    }
  }
}
