// Serviço para integração com diferentes provedores de LLM

export interface LLMProvider {
  name: string
  apiKey: string
  baseUrl?: string
  models: string[]
}

export interface LLMRequest {
  model: string
  messages: Array<{
    role: "system" | "user" | "assistant"
    content: string
  }>
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

export interface LLMResponse {
  content: string
  tokens: {
    prompt: number
    completion: number
    total: number
  }
  model: string
  finishReason: string
}

export class LLMService {
  private providers: Map<string, LLMProvider> = new Map()

  constructor() {
    // Configurar provedores padrão
    this.addProvider({
      name: "openai",
      apiKey: process.env.OPENAI_API_KEY || "",
      baseUrl: "https://api.openai.com/v1",
      models: ["gpt-4", "gpt-3.5-turbo", "gpt-4-turbo"],
    })

    this.addProvider({
      name: "anthropic",
      apiKey: process.env.ANTHROPIC_API_KEY || "",
      baseUrl: "https://api.anthropic.com/v1",
      models: ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"],
    })

    this.addProvider({
      name: "groq",
      apiKey: process.env.GROQ_API_KEY || "",
      baseUrl: "https://api.groq.com/openai/v1",
      models: ["llama2-70b-4096", "mixtral-8x7b-32768"],
    })
  }

  addProvider(provider: LLMProvider) {
    this.providers.set(provider.name, provider)
  }

  async generateResponse(request: LLMRequest): Promise<LLMResponse> {
    const modelParts = request.model.split(":")
    const providerName = modelParts[0] || "openai"
    const modelName = modelParts[1] || request.model

    const provider = this.providers.get(providerName)
    if (!provider) {
      throw new Error(`Provider ${providerName} not found`)
    }

    if (!provider.models.includes(modelName)) {
      throw new Error(`Model ${modelName} not supported by provider ${providerName}`)
    }

    try {
      const response = await this.callProvider(provider, {
        ...request,
        model: modelName,
      })

      return response
    } catch (error) {
      console.error(`Error calling LLM provider ${providerName}:`, error)
      throw error
    }
  }

  private async callProvider(provider: LLMProvider, request: LLMRequest): Promise<LLMResponse> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    // Configurar headers específicos do provedor
    switch (provider.name) {
      case "openai":
      case "groq":
        headers["Authorization"] = `Bearer ${provider.apiKey}`
        break
      case "anthropic":
        headers["x-api-key"] = provider.apiKey
        headers["anthropic-version"] = "2023-06-01"
        break
    }

    const body = this.formatRequestBody(provider.name, request)

    const response = await fetch(`${provider.baseUrl}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return this.parseResponse(provider.name, data)
  }

  private formatRequestBody(providerName: string, request: LLMRequest): any {
    const baseBody = {
      model: request.model,
      messages: request.messages,
      temperature: request.temperature || 0.7,
      max_tokens: request.maxTokens || 500,
      stream: request.stream || false,
    }

    switch (providerName) {
      case "anthropic":
        return {
          ...baseBody,
          max_tokens: request.maxTokens || 500,
        }
      default:
        return baseBody
    }
  }

  private parseResponse(providerName: string, data: any): LLMResponse {
    switch (providerName) {
      case "openai":
      case "groq":
        return {
          content: data.choices[0].message.content,
          tokens: {
            prompt: data.usage.prompt_tokens,
            completion: data.usage.completion_tokens,
            total: data.usage.total_tokens,
          },
          model: data.model,
          finishReason: data.choices[0].finish_reason,
        }
      case "anthropic":
        return {
          content: data.content[0].text,
          tokens: {
            prompt: data.usage.input_tokens,
            completion: data.usage.output_tokens,
            total: data.usage.input_tokens + data.usage.output_tokens,
          },
          model: data.model,
          finishReason: data.stop_reason,
        }
      default:
        throw new Error(`Unknown provider: ${providerName}`)
    }
  }

  async analyzeContext(
    conversation: any[],
    userProfile: any,
  ): Promise<{
    category: string
    priority: "low" | "medium" | "high" | "critical"
    sentiment: "positive" | "negative" | "neutral"
    confidence: number
    suggestedActions: string[]
  }> {
    const contextPrompt = `
Analise a seguinte conversa de suporte técnico e forneça:

1. Categoria do problema (authentication, hardware, software, network, database, other)
2. Prioridade (low, medium, high, critical)
3. Sentimento do usuário (positive, negative, neutral)
4. Nível de confiança na análise (0-1)
5. Ações sugeridas

Perfil do usuário: ${JSON.stringify(userProfile)}
Conversa: ${JSON.stringify(conversation.slice(-5))} // Últimas 5 mensagens

Responda em formato JSON.
`

    try {
      const response = await this.generateResponse({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Você é um especialista em análise de suporte técnico. Responda sempre em JSON válido.",
          },
          {
            role: "user",
            content: contextPrompt,
          },
        ],
        temperature: 0.3,
        maxTokens: 300,
      })

      return JSON.parse(response.content)
    } catch (error) {
      console.error("Error analyzing context:", error)
      return {
        category: "other",
        priority: "medium",
        sentiment: "neutral",
        confidence: 0.5,
        suggestedActions: ["Coletar mais informações"],
      }
    }
  }

  async generateKnowledgeBaseResponse(query: string, category: string, context: any): Promise<string> {
    const systemPrompt = `
Você é um assistente especializado em TI da empresa ET & WICCA. 

Características:
- Sempre profissional e prestativo
- Fornece soluções práticas e detalhadas
- Considera o contexto do usuário (departamento, histórico, etc.)
- Escala problemas quando necessário
- Usa linguagem clara e acessível

Categoria do problema: ${category}
Contexto do usuário: ${JSON.stringify(context)}

Base de conhecimento:
- Problemas de autenticação: verificar AD, resetar senhas, políticas de grupo
- Hardware: diagnósticos, logs, manutenção preventiva
- Software: atualizações, reinstalação, compatibilidade
- Rede: conectividade, firewall, infraestrutura
- Banco de dados: performance, backup, integridade

Responda de forma estruturada com:
1. Análise do problema
2. Plano de ação passo a passo
3. Próximos passos ou escalação se necessário
`

    const response = await this.generateResponse({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: query,
        },
      ],
      temperature: 0.7,
      maxTokens: 600,
    })

    return response.content
  }
}

// Instância singleton
export const llmService = new LLMService()
