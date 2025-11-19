import { type NextRequest, NextResponse } from "next/server"
import { llmService } from "@/lib/ai/llm-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, conversation, context, settings } = body

    // Analisar contexto da conversa
    const analysis = await llmService.analyzeContext(conversation, context)

    // Gerar resposta baseada no contexto
    const response = await llmService.generateKnowledgeBaseResponse(message, analysis.category, {
      ...context,
      priority: analysis.priority,
      sentiment: analysis.sentiment,
    })

    return NextResponse.json({
      content: response,
      category: analysis.category,
      confidence: analysis.confidence,
      sentiment: analysis.sentiment,
      priority: analysis.priority,
      suggestedActions: analysis.suggestedActions,
      tokens: response.length / 4, // Estimativa
      model: settings.model || "gpt-4",
    })
  } catch (error) {
    console.error("Error in AI chat API:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
