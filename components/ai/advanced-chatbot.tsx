"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Bot,
  User,
  Send,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Trash2,
  Brain,
  Settings,
  Zap,
  Target,
  TrendingUp,
  Shield,
  Lightbulb,
  FileText,
  Code,
  Database,
} from "lucide-react"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  category?: string
  confidence?: number
  sentiment?: "positive" | "negative" | "neutral"
  tokens?: number
  model?: string
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  status: "active" | "resolved" | "escalated"
  createdAt: Date
  lastActivity: Date
  context: ConversationContext
}

interface ConversationContext {
  userDepartment?: string
  userRole?: string
  currentIssue?: string
  priority?: "low" | "medium" | "high" | "critical"
  relatedSystems?: string[]
  previousIssues?: string[]
}

interface AISettings {
  model: string
  temperature: number
  maxTokens: number
  enableContextMemory: boolean
  enableSentimentAnalysis: boolean
  enableAutoEscalation: boolean
  confidenceThreshold: number
}

export function AdvancedChatbot() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "Problema de Autenticação - Sistema ERP",
      status: "resolved",
      createdAt: new Date(Date.now() - 86400000),
      lastActivity: new Date(Date.now() - 3600000),
      context: {
        userDepartment: "Financeiro",
        userRole: "Analista",
        currentIssue: "Login ERP",
        priority: "high",
        relatedSystems: ["ERP", "Active Directory"],
        previousIssues: ["Senha expirada", "Conta bloqueada"],
      },
      messages: [
        {
          id: "1",
          type: "user",
          content: "Não consigo acessar o sistema ERP, aparece erro de autenticação",
          timestamp: new Date(Date.now() - 86400000),
        },
        {
          id: "2",
          type: "bot",
          content:
            "Entendo que você está enfrentando problemas de autenticação no sistema ERP. Com base no seu histórico, vejo que você já teve problemas similares relacionados a senhas expiradas. Vou ajudá-lo a resolver isso de forma eficiente.\n\nPrimeiro, vamos verificar:\n1. Sua senha foi alterada recentemente?\n2. Você está recebendo alguma mensagem específica de erro?\n3. Consegue acessar outros sistemas corporativos normalmente?\n\nEnquanto isso, já estou verificando o status da sua conta no Active Directory.",
          timestamp: new Date(Date.now() - 86400000 + 30000),
          category: "authentication",
          confidence: 0.95,
          sentiment: "neutral",
          tokens: 156,
          model: "gpt-4",
        },
      ],
    },
  ])

  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [aiSettings, setAISettings] = useState<AISettings>({
    model: "gpt-4",
    temperature: 0.7,
    maxTokens: 500,
    enableContextMemory: true,
    enableSentimentAnalysis: true,
    enableAutoEscalation: true,
    confidenceThreshold: 0.8,
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversations, activeConversation])

  // Sistema de conhecimento avançado com contexto
  const advancedKnowledgeBase = {
    authentication: {
      keywords: ["login", "senha", "acesso", "entrar", "autenticação", "bloqueado", "expirado"],
      context:
        "Problemas de autenticação são críticos e podem impactar a produtividade. Sempre verificar histórico do usuário.",
      solutions: [
        "Verificar status da conta no Active Directory",
        "Resetar senha se necessário",
        "Verificar políticas de grupo aplicadas",
        "Confirmar se não há bloqueios de segurança",
      ],
      escalationTriggers: ["múltiplas tentativas", "erro de sistema", "conta comprometida"],
    },
    hardware: {
      keywords: ["computador", "pc", "hardware", "lento", "travando", "monitor", "teclado", "mouse", "impressora"],
      context:
        "Problemas de hardware podem indicar necessidade de manutenção ou substituição. Considerar idade do equipamento.",
      solutions: [
        "Executar diagnósticos de hardware",
        "Verificar logs de sistema",
        "Testar componentes individualmente",
        "Agendar manutenção preventiva",
      ],
      escalationTriggers: ["falha crítica", "equipamento antigo", "múltiplos problemas"],
    },
    software: {
      keywords: ["software", "programa", "aplicativo", "instalação", "erro", "bug", "atualização", "licença"],
      context:
        "Problemas de software podem ser resolvidos com atualizações ou reinstalação. Verificar compatibilidade.",
      solutions: [
        "Verificar versão atual do software",
        "Aplicar atualizações disponíveis",
        "Reinstalar se necessário",
        "Verificar compatibilidade do sistema",
      ],
      escalationTriggers: ["erro crítico", "perda de dados", "software não licenciado"],
    },
    network: {
      keywords: ["internet", "rede", "wifi", "conexão", "lento", "sem acesso", "vpn", "firewall"],
      context: "Problemas de rede podem afetar múltiplos usuários. Priorizar soluções que impactem menos pessoas.",
      solutions: [
        "Verificar status da infraestrutura de rede",
        "Testar conectividade em diferentes pontos",
        "Verificar configurações de firewall",
        "Reiniciar equipamentos de rede se necessário",
      ],
      escalationTriggers: ["falha generalizada", "problema de segurança", "perda de conectividade crítica"],
    },
    database: {
      keywords: ["banco", "dados", "database", "sql", "backup", "lento", "erro", "consulta"],
      context:
        "Problemas de banco de dados são críticos e podem afetar sistemas essenciais. Sempre fazer backup antes de alterações.",
      solutions: [
        "Verificar performance das consultas",
        "Analisar logs de erro do banco",
        "Verificar espaço em disco",
        "Otimizar índices se necessário",
      ],
      escalationTriggers: ["corrupção de dados", "falha de backup", "performance crítica"],
    },
  }

  // Simulação de chamada para LLM (em produção, seria uma chamada real para OpenAI, Anthropic, etc.)
  const generateLLMResponse = async (
    userMessage: string,
    context: ConversationContext,
    conversationHistory: Message[],
  ): Promise<{ content: string; category: string; confidence: number; sentiment: string; tokens: number }> => {
    // Simular delay de processamento
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 2000))

    // Análise de contexto e categoria
    let category = "general"
    let confidence = 0.7
    const message = userMessage.toLowerCase()

    // Determinar categoria com base no conhecimento avançado
    for (const [cat, data] of Object.entries(advancedKnowledgeBase)) {
      if (data.keywords.some((keyword) => message.includes(keyword))) {
        category = cat
        confidence = 0.85 + Math.random() * 0.1
        break
      }
    }

    // Análise de sentimento simulada
    const sentimentWords = {
      positive: ["obrigado", "ótimo", "excelente", "funcionou", "resolvido", "perfeito"],
      negative: ["problema", "erro", "não funciona", "travando", "lento", "ruim", "péssimo"],
      neutral: ["como", "quando", "onde", "preciso", "gostaria", "pode"],
    }

    let sentiment = "neutral"
    for (const [sent, words] of Object.entries(sentimentWords)) {
      if (words.some((word) => message.includes(word))) {
        sentiment = sent
        break
      }
    }

    // Gerar resposta contextual baseada no LLM
    let response = ""
    const knowledgeData = advancedKnowledgeBase[category as keyof typeof advancedKnowledgeBase]

    if (knowledgeData) {
      // Resposta contextual inteligente
      response = `Entendo que você está enfrentando ${
        category === "authentication"
          ? "problemas de autenticação"
          : category === "hardware"
            ? "problemas de hardware"
            : category === "software"
              ? "problemas de software"
              : category === "network"
                ? "problemas de rede"
                : category === "database"
                  ? "problemas de banco de dados"
                  : "uma questão técnica"
      }.

${context.userDepartment ? `Como você trabalha no departamento de ${context.userDepartment}, ` : ""}${context.previousIssues?.length ? `e considerando que você já teve problemas similares (${context.previousIssues.join(", ")}), ` : ""}vou priorizar uma solução eficiente.

**Análise da Situação:**
${knowledgeData.context}

**Plano de Ação:**
${knowledgeData.solutions.map((solution, index) => `${index + 1}. ${solution}`).join("\n")}

${
  context.priority === "high" || context.priority === "critical"
    ? "⚠️ **Prioridade Alta Detectada** - Vou monitorar este caso de perto e, se necessário, escalar para o suporte especializado."
    : ""
}

Pode me informar mais detalhes sobre o problema específico que está enfrentando? Isso me ajudará a fornecer uma solução mais precisa.`
    } else {
      // Resposta genérica inteligente
      response = `Obrigado por entrar em contato! Analisei sua mensagem e, ${context.userRole ? `como ${context.userRole}` : "baseado no contexto"}, vou fazer o possível para ajudá-lo de forma eficiente.

Para fornecer a melhor assistência possível, preciso entender melhor:

1. **Contexto específico:** Qual sistema ou ferramenta está sendo afetado?
2. **Impacto:** Como isso está afetando seu trabalho?
3. **Urgência:** Precisa de uma solução imediata?

${conversationHistory.length > 2 ? "Baseado em nossa conversa anterior, " : ""}estou aqui para resolver sua questão rapidamente.`
    }

    // Calcular tokens simulados
    const tokens = Math.floor(response.length / 4) + Math.floor(Math.random() * 50)

    return {
      content: response,
      category,
      confidence,
      sentiment,
      tokens,
    }
  }

  const createNewConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: "Nova Conversa",
      status: "active",
      createdAt: new Date(),
      lastActivity: new Date(),
      context: {
        priority: "medium",
        relatedSystems: [],
        previousIssues: [],
      },
      messages: [
        {
          id: "welcome",
          type: "bot",
          content: `🤖 **Assistente IA Avançado - ET & WICCA**

Olá! Sou seu assistente de TI com inteligência artificial avançada. Estou equipado com:

✨ **Capacidades Avançadas:**
• 🧠 Análise contextual inteligente
• 📊 Análise de sentimento em tempo real  
• 🎯 Soluções personalizadas por departamento
• 🔄 Memória de conversas anteriores
• ⚡ Escalação automática para casos críticos

**Como posso ajudá-lo hoje?** 
Descreva seu problema e eu fornecerei uma solução personalizada baseada no seu perfil e histórico.`,
          timestamp: new Date(),
          category: "welcome",
          confidence: 1.0,
          sentiment: "positive",
          tokens: 95,
          model: aiSettings.model,
        },
      ],
    }

    setConversations((prev) => [newConv, ...prev])
    setActiveConversation(newConv.id)
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return

    const activeConv = conversations.find((conv) => conv.id === activeConversation)
    if (!activeConv) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: newMessage,
      timestamp: new Date(),
    }

    // Adicionar mensagem do usuário
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConversation
          ? {
              ...conv,
              messages: [...conv.messages, userMessage],
              lastActivity: new Date(),
              title: conv.title === "Nova Conversa" ? newMessage.slice(0, 40) + "..." : conv.title,
            }
          : conv,
      ),
    )

    setNewMessage("")
    setIsTyping(true)

    try {
      // Gerar resposta usando LLM
      const llmResponse = await generateLLMResponse(newMessage, activeConv.context, activeConv.messages)

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: llmResponse.content,
        timestamp: new Date(),
        category: llmResponse.category,
        confidence: llmResponse.confidence,
        sentiment: llmResponse.sentiment as any,
        tokens: llmResponse.tokens,
        model: aiSettings.model,
      }

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeConversation
            ? {
                ...conv,
                messages: [...conv.messages, botMessage],
                lastActivity: new Date(),
                // Atualizar contexto baseado na conversa
                context: {
                  ...conv.context,
                  currentIssue: llmResponse.category,
                  priority: llmResponse.confidence < aiSettings.confidenceThreshold ? "high" : conv.context.priority,
                },
              }
            : conv,
        ),
      )

      // Auto-escalação se necessário
      if (aiSettings.enableAutoEscalation && llmResponse.confidence < aiSettings.confidenceThreshold) {
        setTimeout(() => {
          const escalationMessage: Message = {
            id: (Date.now() + 2).toString(),
            type: "bot",
            content:
              "🚨 **Escalação Automática Ativada**\n\nDetectei que este problema pode precisar de atenção especializada. Estou escalando automaticamente para o suporte técnico de nível 2.\n\n**Motivo:** Baixa confiança na solução automática\n**Próximos passos:** Um técnico especializado entrará em contato em breve.",
            timestamp: new Date(),
            category: "escalation",
            confidence: 1.0,
            sentiment: "neutral",
            tokens: 45,
            model: aiSettings.model,
          }

          setConversations((prev) =>
            prev.map((conv) =>
              conv.id === activeConversation
                ? {
                    ...conv,
                    messages: [...conv.messages, escalationMessage],
                    status: "escalated",
                  }
                : conv,
            ),
          )
        }, 2000)
      }
    } catch (error) {
      console.error("Erro ao gerar resposta:", error)

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content:
          "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente ou entre em contato com o suporte técnico.",
        timestamp: new Date(),
        category: "error",
        confidence: 0.0,
        sentiment: "negative",
        tokens: 25,
        model: aiSettings.model,
      }

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeConversation
            ? {
                ...conv,
                messages: [...conv.messages, errorMessage],
                lastActivity: new Date(),
              }
            : conv,
        ),
      )
    } finally {
      setIsTyping(false)
    }
  }

  const deleteConversation = (convId: string) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== convId))
    if (activeConversation === convId) {
      setActiveConversation(null)
    }
  }

  const exportConversation = (convId: string) => {
    const conversation = conversations.find((conv) => conv.id === convId)
    if (!conversation) return

    const content = `CONVERSA EXPORTADA - ${conversation.title}
Data: ${conversation.createdAt.toLocaleString()}
Status: ${conversation.status}
Contexto: ${JSON.stringify(conversation.context, null, 2)}

MENSAGENS:
${conversation.messages
  .map(
    (msg) => `
[${msg.timestamp.toLocaleString()}] ${msg.type.toUpperCase()}
${msg.category ? `Categoria: ${msg.category}` : ""}
${msg.confidence ? `Confiança: ${(msg.confidence * 100).toFixed(1)}%` : ""}
${msg.sentiment ? `Sentimento: ${msg.sentiment}` : ""}
${msg.tokens ? `Tokens: ${msg.tokens}` : ""}
${msg.model ? `Modelo: ${msg.model}` : ""}

${msg.content}
${"=".repeat(50)}`,
  )
  .join("\n")}`

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `conversa-ai-${conversation.title.replace(/[^a-zA-Z0-9]/g, "-")}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const escalateToSupport = (convId: string) => {
    setConversations((prev) => prev.map((conv) => (conv.id === convId ? { ...conv, status: "escalated" } : conv)))
  }

  const activeConv = conversations.find((conv) => conv.id === activeConversation)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "escalated":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "authentication":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "hardware":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "software":
        return "bg-green-100 text-green-800 border-green-200"
      case "network":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "database":
        return "bg-red-100 text-red-800 border-red-200"
      case "escalation":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "welcome":
        return "bg-indigo-100 text-indigo-800 border-indigo-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case "authentication":
        return <Shield className="h-3 w-3" />
      case "hardware":
        return <Code className="h-3 w-3" />
      case "software":
        return <FileText className="h-3 w-3" />
      case "network":
        return <Zap className="h-3 w-3" />
      case "database":
        return <Database className="h-3 w-3" />
      case "escalation":
        return <Target className="h-3 w-3" />
      case "welcome":
        return <Lightbulb className="h-3 w-3" />
      default:
        return <MessageSquare className="h-3 w-3" />
    }
  }

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600"
      case "negative":
        return "text-red-600"
      case "neutral":
        return "text-gray-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[900px]">
      {/* Lista de Conversas */}
      <Card className="border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-blue-800">IA Conversas</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="border-blue-200 text-blue-600"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button onClick={createNewConversation} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Nova
              </Button>
            </div>
          </div>
          <CardDescription>Conversas com IA avançada e análise contextual</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {showSettings && (
            <div className="p-4 border-b border-blue-100 bg-blue-50">
              <h4 className="font-medium text-blue-800 mb-3">Configurações da IA</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-blue-700">Modelo</Label>
                  <Select
                    value={aiSettings.model}
                    onValueChange={(value) => setAISettings((prev) => ({ ...prev, model: value }))}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4 (Mais inteligente)</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Mais rápido)</SelectItem>
                      <SelectItem value="claude-3">Claude 3 (Analítico)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-blue-700">Memória Contextual</Label>
                  <Switch
                    checked={aiSettings.enableContextMemory}
                    onCheckedChange={(checked) => setAISettings((prev) => ({ ...prev, enableContextMemory: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-blue-700">Análise de Sentimento</Label>
                  <Switch
                    checked={aiSettings.enableSentimentAnalysis}
                    onCheckedChange={(checked) =>
                      setAISettings((prev) => ({ ...prev, enableSentimentAnalysis: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-blue-700">Auto-Escalação</Label>
                  <Switch
                    checked={aiSettings.enableAutoEscalation}
                    onCheckedChange={(checked) => setAISettings((prev) => ({ ...prev, enableAutoEscalation: checked }))}
                  />
                </div>
              </div>
            </div>
          )}
          <ScrollArea className="h-[600px]">
            <div className="space-y-2 p-4">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    activeConversation === conv.id ? "border-blue-300 bg-blue-50" : "border-blue-100 hover:bg-blue-50"
                  }`}
                  onClick={() => setActiveConversation(conv.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(conv.status)}
                      <span className="font-medium text-blue-800 text-sm truncate">{conv.title}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          exportConversation(conv.id)
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteConversation(conv.id)
                        }}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-blue-600 mb-1">{conv.lastActivity.toLocaleString()}</div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-blue-500">{conv.messages.length} mensagens</div>
                    {conv.context.priority && (
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          conv.context.priority === "critical"
                            ? "border-red-300 text-red-700"
                            : conv.context.priority === "high"
                              ? "border-orange-300 text-orange-700"
                              : conv.context.priority === "medium"
                                ? "border-yellow-300 text-yellow-700"
                                : "border-green-300 text-green-700"
                        }`}
                      >
                        {conv.context.priority}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="lg:col-span-2 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <Brain className="h-5 w-5" />
                {activeConv ? activeConv.title : "Assistente IA Avançado"}
              </CardTitle>
              <CardDescription className="flex items-center gap-4">
                {activeConv ? (
                  <>
                    <span>Status: {activeConv.status}</span>
                    <span>Modelo: {aiSettings.model}</span>
                    {activeConv.context.userDepartment && <span>Depto: {activeConv.context.userDepartment}</span>}
                  </>
                ) : (
                  "Escolha uma conversa ou crie uma nova"
                )}
              </CardDescription>
            </div>
            {activeConv && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => escalateToSupport(activeConv.id)}
                  className="border-blue-200 text-blue-600"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Escalar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportConversation(activeConv.id)}
                  className="border-blue-200 text-blue-600"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {activeConv ? (
            <>
              <ScrollArea className="h-[600px] p-4">
                <div className="space-y-4">
                  {activeConv.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg p-4 ${
                          message.type === "user" ? "bg-blue-600 text-white" : "bg-blue-50 border border-blue-200"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {message.type === "user" ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4 text-blue-600" />
                          )}
                          <span className="text-xs opacity-70">{message.timestamp.toLocaleTimeString()}</span>
                          {message.category && (
                            <Badge className={`text-xs border ${getCategoryColor(message.category)}`}>
                              {getCategoryIcon(message.category)}
                              <span className="ml-1">{message.category}</span>
                            </Badge>
                          )}
                        </div>
                        <div
                          className={`whitespace-pre-wrap ${message.type === "user" ? "text-white" : "text-blue-800"}`}
                        >
                          {message.content}
                        </div>
                        {message.type === "bot" && (
                          <div className="flex items-center gap-4 mt-3 pt-2 border-t border-blue-100">
                            {message.confidence && (
                              <div className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3 text-blue-500" />
                                <span className="text-xs text-blue-600">{(message.confidence * 100).toFixed(0)}%</span>
                              </div>
                            )}
                            {message.sentiment && aiSettings.enableSentimentAnalysis && (
                              <div className={`flex items-center gap-1 ${getSentimentColor(message.sentiment)}`}>
                                <span className="text-xs">
                                  {message.sentiment === "positive"
                                    ? "😊"
                                    : message.sentiment === "negative"
                                      ? "😟"
                                      : "😐"}
                                </span>
                                <span className="text-xs">{message.sentiment}</span>
                              </div>
                            )}
                            {message.tokens && (
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-blue-500">{message.tokens} tokens</span>
                              </div>
                            )}
                            {message.model && (
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-blue-500">{message.model}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Bot className="h-4 w-4 text-blue-600" />
                          <span className="text-xs text-blue-600">IA processando...</span>
                        </div>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              <Separator />
              <div className="p-4">
                <div className="flex gap-2">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Descreva seu problema em detalhes para uma resposta mais precisa..."
                    onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
                    className="border-blue-200 focus:border-blue-400 min-h-[60px] resize-none"
                    rows={2}
                  />
                  <Button
                    onClick={sendMessage}
                    className="bg-blue-600 hover:bg-blue-700 self-end"
                    disabled={isTyping || !newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2 text-xs text-blue-600 flex items-center gap-4">
                  <span>Shift + Enter para nova linha • Enter para enviar</span>
                  <span className="flex items-center gap-1">
                    <Brain className="h-3 w-3" />
                    IA com análise contextual ativa
                  </span>
                  {aiSettings.enableAutoEscalation && (
                    <span className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      Auto-escalação ativa
                    </span>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[700px]">
              <div className="text-center">
                <Brain className="h-20 w-20 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-blue-800 mb-2">Assistente IA Avançado</h3>
                <p className="text-blue-600 mb-6 max-w-md">
                  Powered by LLM com análise contextual, memória de conversas e escalação automática
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-blue-700">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    <span>Análise Contextual</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Análise de Sentimento</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    <span>Auto-Escalação</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span>Respostas Inteligentes</span>
                  </div>
                </div>
                <Button onClick={createNewConversation} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Iniciar Conversa com IA
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
