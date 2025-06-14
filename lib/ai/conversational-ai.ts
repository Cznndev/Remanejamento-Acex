export interface ConversationMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  metadata?: {
    intent?: string
    confidence?: number
    entities?: any[]
    suggestions?: string[]
  }
}

export interface ConversationContext {
  userId: string
  sessionId: string
  currentTopic?: string
  userPreferences?: any
  conversationHistory: ConversationMessage[]
}

export interface AICapability {
  name: string
  description: string
  examples: string[]
  confidence: number
}

class ConversationalAI {
  private contexts: Map<string, ConversationContext> = new Map()
  private knowledgeBase: Map<string, any> = new Map()

  constructor() {
    this.initializeKnowledgeBase()
  }

  private initializeKnowledgeBase() {
    // Base de conhecimento sobre o sistema
    this.knowledgeBase.set("remanejamento", {
      description: "Sistema de remanejamento de aulas",
      capabilities: [
        "Criar remanejamentos automáticos",
        "Notificar professores e alunos",
        "Otimizar uso de salas",
        "Gerar relatórios detalhados",
      ],
      examples: ["Como fazer um remanejamento?", "Quais professores estão disponíveis?", "Qual sala está livre agora?"],
    })

    this.knowledgeBase.set("professores", {
      description: "Gestão de professores",
      data: [
        { nome: "João Silva", disciplina: "Matemática", disponibilidade: "Segunda a Sexta" },
        { nome: "Maria Santos", disciplina: "Português", disponibilidade: "Segunda a Quinta" },
        { nome: "Pedro Costa", disciplina: "História", disponibilidade: "Terça a Sexta" },
      ],
    })

    this.knowledgeBase.set("salas", {
      description: "Informações sobre salas",
      data: [
        { numero: "101", capacidade: 30, equipamentos: ["Projetor", "Ar condicionado"] },
        { numero: "102", capacidade: 25, equipamentos: ["Quadro digital"] },
        { numero: "103", capacidade: 35, equipamentos: ["Laboratório de informática"] },
      ],
    })
  }

  async processMessage(userId: string, message: string, sessionId?: string): Promise<ConversationMessage> {
    const contextKey = sessionId || userId
    let context = this.contexts.get(contextKey)

    if (!context) {
      context = {
        userId,
        sessionId: contextKey,
        conversationHistory: [],
      }
      this.contexts.set(contextKey, context)
    }

    // Adicionar mensagem do usuário ao histórico
    const userMessage: ConversationMessage = {
      id: `msg_${Date.now()}_user`,
      role: "user",
      content: message,
      timestamp: new Date(),
    }

    context.conversationHistory.push(userMessage)

    // Processar intenção e entidades
    const intent = await this.detectIntent(message)
    const entities = await this.extractEntities(message)

    // Gerar resposta
    const response = await this.generateResponse(message, intent, entities, context)

    const assistantMessage: ConversationMessage = {
      id: `msg_${Date.now()}_assistant`,
      role: "assistant",
      content: response.content,
      timestamp: new Date(),
      metadata: {
        intent: intent.name,
        confidence: intent.confidence,
        entities,
        suggestions: response.suggestions,
      },
    }

    context.conversationHistory.push(assistantMessage)

    // Manter apenas últimas 50 mensagens
    if (context.conversationHistory.length > 50) {
      context.conversationHistory = context.conversationHistory.slice(-50)
    }

    return assistantMessage
  }

  private async detectIntent(message: string): Promise<{ name: string; confidence: number }> {
    const lowerMessage = message.toLowerCase()

    // Intenções básicas com padrões
    const intents = [
      {
        name: "remanejamento_criar",
        patterns: ["criar remanejamento", "fazer remanejamento", "remanejamento", "trocar aula"],
        confidence: 0.9,
      },
      {
        name: "professor_consultar",
        patterns: ["professor", "docente", "quem dá aula", "disponibilidade"],
        confidence: 0.85,
      },
      {
        name: "sala_consultar",
        patterns: ["sala", "classroom", "onde", "local", "disponível"],
        confidence: 0.8,
      },
      {
        name: "horario_consultar",
        patterns: ["horário", "quando", "que horas", "agenda"],
        confidence: 0.8,
      },
      {
        name: "relatorio_gerar",
        patterns: ["relatório", "report", "dados", "estatística"],
        confidence: 0.75,
      },
      {
        name: "ajuda",
        patterns: ["ajuda", "help", "como", "tutorial", "não sei"],
        confidence: 0.7,
      },
      {
        name: "saudacao",
        patterns: ["oi", "olá", "bom dia", "boa tarde", "boa noite"],
        confidence: 0.9,
      },
    ]

    for (const intent of intents) {
      for (const pattern of intent.patterns) {
        if (lowerMessage.includes(pattern)) {
          return { name: intent.name, confidence: intent.confidence }
        }
      }
    }

    return { name: "unknown", confidence: 0.3 }
  }

  private async extractEntities(message: string): Promise<any[]> {
    const entities = []
    const lowerMessage = message.toLowerCase()

    // Extrair números (possíveis salas)
    const numbers = message.match(/\d+/g)
    if (numbers) {
      numbers.forEach((num) => {
        entities.push({
          type: "number",
          value: Number.parseInt(num),
          text: num,
        })
      })
    }

    // Extrair dias da semana
    const days = ["segunda", "terça", "quarta", "quinta", "sexta", "sábado", "domingo"]
    days.forEach((day) => {
      if (lowerMessage.includes(day)) {
        entities.push({
          type: "day",
          value: day,
          text: day,
        })
      }
    })

    // Extrair horários
    const timePattern = /(\d{1,2}):(\d{2})/g
    const times = message.match(timePattern)
    if (times) {
      times.forEach((time) => {
        entities.push({
          type: "time",
          value: time,
          text: time,
        })
      })
    }

    return entities
  }

  private async generateResponse(
    message: string,
    intent: { name: string; confidence: number },
    entities: any[],
    context: ConversationContext,
  ): Promise<{ content: string; suggestions: string[] }> {
    switch (intent.name) {
      case "saudacao":
        return {
          content: `Olá! 👋 Sou a IA do sistema de gestão escolar. Posso ajudar você com:

• 📅 Remanejamento de aulas
• 👨‍🏫 Consulta de professores
• 🏫 Informações sobre salas
• 📊 Relatórios e estatísticas
• ⏰ Consulta de horários

Como posso ajudar você hoje?`,
          suggestions: [
            "Criar um remanejamento",
            "Ver professores disponíveis",
            "Consultar salas livres",
            "Gerar relatório",
          ],
        }

      case "remanejamento_criar":
        return {
          content: `🔄 **Criação de Remanejamento**

Para criar um remanejamento, preciso de algumas informações:

1. **Professor afetado** - Quem não poderá dar a aula?
2. **Data e horário** - Quando seria a aula original?
3. **Disciplina** - Qual matéria?
4. **Turma** - Qual turma seria afetada?

Você pode me fornecer essas informações? Por exemplo:
"O professor João Silva não pode dar aula de Matemática na terça-feira às 14:00 para o 9º A"`,
          suggestions: [
            "Professor João Silva não pode dar aula",
            "Remanejamento para amanhã",
            "Ver professores substitutos",
            "Cancelar aula",
          ],
        }

      case "professor_consultar":
        const professores = this.knowledgeBase.get("professores")?.data || []
        return {
          content: `👨‍🏫 **Professores Disponíveis**

${professores.map((prof: any) => `• **${prof.nome}** - ${prof.disciplina}\n  📅 ${prof.disponibilidade}`).join("\n\n")}

Quer saber mais sobre algum professor específico ou verificar disponibilidade para um horário?`,
          suggestions: [
            "Disponibilidade do João Silva",
            "Professores de Matemática",
            "Quem pode substituir?",
            "Horários livres",
          ],
        }

      case "sala_consultar":
        const salas = this.knowledgeBase.get("salas")?.data || []
        return {
          content: `🏫 **Salas Disponíveis**

${salas
  .map(
    (sala: any) =>
      `• **Sala ${sala.numero}** - Capacidade: ${sala.capacidade} alunos\n  🔧 ${sala.equipamentos.join(", ")}`,
  )
  .join("\n\n")}

Precisa de uma sala específica ou com equipamentos especiais?`,
          suggestions: ["Sala com projetor", "Maior capacidade", "Laboratório disponível", "Sala 101 está livre?"],
        }

      case "relatorio_gerar":
        return {
          content: `📊 **Relatórios Disponíveis**

Posso gerar os seguintes relatórios para você:

• 📈 **Estatísticas de Remanejamento** - Frequência e motivos
• 👥 **Utilização de Professores** - Carga horária e substituições
• 🏫 **Ocupação de Salas** - Taxa de uso e otimização
• ⏰ **Análise de Horários** - Conflitos e disponibilidade
• 💰 **Impacto Financeiro** - Custos de remanejamentos

Qual relatório você gostaria de ver?`,
          suggestions: [
            "Relatório de remanejamentos",
            "Estatísticas do mês",
            "Professores mais solicitados",
            "Salas mais usadas",
          ],
        }

      case "ajuda":
        return {
          content: `🤖 **Como posso ajudar**

Sou uma IA especializada em gestão escolar. Posso:

**📋 Remanejamentos:**
• Criar remanejamentos automáticos
• Encontrar professores substitutos
• Sugerir horários alternativos

**📊 Consultas:**
• Verificar disponibilidade de professores
• Consultar salas livres
• Mostrar horários de turmas

**📈 Relatórios:**
• Gerar estatísticas detalhadas
• Analisar padrões de uso
• Calcular impactos financeiros

**💡 Dicas:**
• Use linguagem natural: "O professor João não pode dar aula amanhã"
• Seja específico com datas e horários
• Pergunte sobre qualquer funcionalidade

Experimente perguntar algo!`,
          suggestions: [
            "Como criar um remanejamento?",
            "Mostrar tutorial",
            "Funcionalidades disponíveis",
            "Exemplos de comandos",
          ],
        }

      default:
        return {
          content: `🤔 Desculpe, não entendi completamente sua solicitação. 

Você pode tentar:
• Ser mais específico sobre o que precisa
• Usar palavras-chave como "remanejamento", "professor", "sala"
• Perguntar "ajuda" para ver todas as funcionalidades

Ou escolha uma das sugestões abaixo:`,
          suggestions: ["Ajuda", "Criar remanejamento", "Ver professores", "Consultar salas"],
        }
    }
  }

  getConversationHistory(userId: string, sessionId?: string): ConversationMessage[] {
    const contextKey = sessionId || userId
    const context = this.contexts.get(contextKey)
    return context?.conversationHistory || []
  }

  clearConversation(userId: string, sessionId?: string): void {
    const contextKey = sessionId || userId
    this.contexts.delete(contextKey)
  }

  getCapabilities(): AICapability[] {
    return [
      {
        name: "Remanejamento Inteligente",
        description: "Criação automática de remanejamentos com IA",
        examples: [
          "Criar remanejamento para professor ausente",
          "Encontrar substituto automático",
          "Otimizar horários conflitantes",
        ],
        confidence: 0.95,
      },
      {
        name: "Consultas Naturais",
        description: "Responder perguntas em linguagem natural",
        examples: [
          "Quais professores estão livres agora?",
          "Qual sala tem projetor disponível?",
          "Quantos remanejamentos tivemos este mês?",
        ],
        confidence: 0.9,
      },
      {
        name: "Análise Preditiva",
        description: "Prever padrões e sugerir otimizações",
        examples: [
          "Prever ausências de professores",
          "Sugerir melhor distribuição de salas",
          "Identificar horários problemáticos",
        ],
        confidence: 0.85,
      },
      {
        name: "Relatórios Inteligentes",
        description: "Gerar insights automáticos dos dados",
        examples: ["Análise de eficiência operacional", "Identificação de gargalos", "Sugestões de melhoria"],
        confidence: 0.88,
      },
    ]
  }

  async trainWithFeedback(messageId: string, feedback: "positive" | "negative", correction?: string): Promise<void> {
    // Simulação de treinamento com feedback
    console.log(`Feedback recebido para ${messageId}: ${feedback}`)
    if (correction) {
      console.log(`Correção sugerida: ${correction}`)
    }

    // Em um sistema real, isso atualizaria o modelo de ML
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
}

export const conversationalAI = new ConversationalAI()
