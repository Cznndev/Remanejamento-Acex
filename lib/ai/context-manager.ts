// Gerenciador de contexto para conversas com IA

export interface ConversationContext {
  userId: string
  department: string
  role: string
  previousIssues: string[]
  currentSystems: string[]
  preferences: {
    communicationStyle: "formal" | "casual"
    technicalLevel: "beginner" | "intermediate" | "advanced"
    preferredSolutions: "quick" | "detailed" | "comprehensive"
  }
  sessionData: {
    startTime: Date
    lastActivity: Date
    messageCount: number
    resolvedIssues: number
  }
}

export class ContextManager {
  private contexts: Map<string, ConversationContext> = new Map()

  getContext(conversationId: string): ConversationContext | null {
    return this.contexts.get(conversationId) || null
  }

  updateContext(conversationId: string, updates: Partial<ConversationContext>) {
    const existing = this.contexts.get(conversationId)
    if (existing) {
      this.contexts.set(conversationId, { ...existing, ...updates })
    }
  }

  createContext(conversationId: string, initialData: Partial<ConversationContext>): ConversationContext {
    const context: ConversationContext = {
      userId: initialData.userId || "anonymous",
      department: initialData.department || "unknown",
      role: initialData.role || "user",
      previousIssues: initialData.previousIssues || [],
      currentSystems: initialData.currentSystems || [],
      preferences: {
        communicationStyle: "formal",
        technicalLevel: "intermediate",
        preferredSolutions: "detailed",
        ...initialData.preferences,
      },
      sessionData: {
        startTime: new Date(),
        lastActivity: new Date(),
        messageCount: 0,
        resolvedIssues: 0,
        ...initialData.sessionData,
      },
    }

    this.contexts.set(conversationId, context)
    return context
  }

  analyzeUserBehavior(
    conversationId: string,
    messages: any[],
  ): {
    technicalLevel: "beginner" | "intermediate" | "advanced"
    urgencyLevel: "low" | "medium" | "high"
    communicationPattern: "concise" | "detailed" | "verbose"
  } {
    const context = this.getContext(conversationId)
    if (!context) {
      return {
        technicalLevel: "intermediate",
        urgencyLevel: "medium",
        communicationPattern: "detailed",
      }
    }

    // Análise simples baseada no conteúdo das mensagens
    const userMessages = messages.filter((m) => m.type === "user")
    const avgMessageLength = userMessages.reduce((sum, m) => sum + m.content.length, 0) / userMessages.length

    const technicalTerms = [
      "api",
      "database",
      "sql",
      "server",
      "network",
      "firewall",
      "dns",
      "tcp",
      "ip",
      "authentication",
      "authorization",
      "ssl",
      "tls",
      "vpn",
      "ldap",
      "active directory",
    ]

    const technicalTermCount = userMessages.reduce((count, message) => {
      const lowerContent = message.content.toLowerCase()
      return count + technicalTerms.filter((term) => lowerContent.includes(term)).length
    }, 0)

    const urgencyWords = ["urgente", "crítico", "parado", "emergência", "imediato", "agora"]
    const hasUrgencyWords = userMessages.some((m) =>
      urgencyWords.some((word) => m.content.toLowerCase().includes(word)),
    )

    return {
      technicalLevel: technicalTermCount > 3 ? "advanced" : technicalTermCount > 1 ? "intermediate" : "beginner",
      urgencyLevel: hasUrgencyWords ? "high" : context.sessionData.messageCount > 5 ? "medium" : "low",
      communicationPattern: avgMessageLength > 200 ? "verbose" : avgMessageLength > 50 ? "detailed" : "concise",
    }
  }

  generatePersonalizedPrompt(context: ConversationContext, userBehavior: any): string {
    return `
Contexto do usuário:
- Departamento: ${context.department}
- Função: ${context.role}
- Nível técnico: ${userBehavior.technicalLevel}
- Estilo de comunicação: ${context.preferences.communicationStyle}
- Padrão de comunicação: ${userBehavior.communicationPattern}
- Urgência: ${userBehavior.urgencyLevel}

Histórico:
- Problemas anteriores: ${context.previousIssues.join(", ")}
- Sistemas utilizados: ${context.currentSystems.join(", ")}
- Mensagens na sessão: ${context.sessionData.messageCount}

Instruções:
- Adapte a linguagem ao nível técnico do usuário
- Use o estilo de comunicação preferido
- Considere o histórico para evitar repetir soluções já tentadas
- Ajuste o nível de detalhamento baseado no padrão de comunicação
- Priorize soluções baseadas na urgência detectada
`
  }
}

export const contextManager = new ContextManager()
