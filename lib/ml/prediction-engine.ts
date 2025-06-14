export interface PredictionData {
  professorId: string
  disciplina: string
  diaSemana: number // 0-6 (domingo-sábado)
  periodo: number // 1-5
  mes: number // 1-12
  temperatura?: number
  feriados: boolean
  eventos: boolean
}

export interface PredictionResult {
  probabilidadeAusencia: number
  confianca: number
  fatoresRisco: string[]
  recomendacoes: string[]
  professorSubstituto?: string
}

export interface HistoricalPattern {
  professorId: string
  padraoAusencias: {
    diaSemana: Record<number, number>
    periodo: Record<number, number>
    mes: Record<number, number>
    clima: Record<string, number>
  }
  totalAulas: number
  totalAusencias: number
  mediaConfiabilidade: number
}

export class MLPredictionEngine {
  private static instance: MLPredictionEngine
  private patterns: HistoricalPattern[] = []
  private isTraining = false

  static getInstance(): MLPredictionEngine {
    if (!MLPredictionEngine.instance) {
      MLPredictionEngine.instance = new MLPredictionEngine()
    }
    return MLPredictionEngine.instance
  }

  constructor() {
    this.initializeMockData()
  }

  private initializeMockData() {
    // Dados históricos simulados para treinamento
    this.patterns = [
      {
        professorId: "1", // Maria Silva
        padraoAusencias: {
          diaSemana: { 1: 0.05, 2: 0.03, 3: 0.04, 4: 0.02, 5: 0.08 }, // Mais ausências na sexta
          periodo: { 1: 0.02, 2: 0.03, 3: 0.04, 4: 0.05, 5: 0.06 }, // Mais ausências no final do dia
          mes: {
            1: 0.08,
            2: 0.06,
            3: 0.04,
            4: 0.03,
            5: 0.03,
            6: 0.02,
            7: 0.02,
            8: 0.03,
            9: 0.04,
            10: 0.05,
            11: 0.06,
            12: 0.09,
          },
          clima: { frio: 0.08, chuva: 0.12, calor: 0.03, normal: 0.02 },
        },
        totalAulas: 800,
        totalAusencias: 32,
        mediaConfiabilidade: 0.96,
      },
      {
        professorId: "2", // João Pereira
        padraoAusencias: {
          diaSemana: { 1: 0.08, 2: 0.04, 3: 0.03, 4: 0.03, 5: 0.05 },
          periodo: { 1: 0.03, 2: 0.02, 3: 0.04, 4: 0.06, 5: 0.08 },
          mes: {
            1: 0.06,
            2: 0.05,
            3: 0.04,
            4: 0.03,
            5: 0.04,
            6: 0.03,
            7: 0.03,
            8: 0.04,
            9: 0.05,
            10: 0.06,
            11: 0.07,
            12: 0.08,
          },
          clima: { frio: 0.06, chuva: 0.09, calor: 0.04, normal: 0.03 },
        },
        totalAulas: 600,
        totalAusencias: 28,
        mediaConfiabilidade: 0.95,
      },
      {
        professorId: "3", // Ana Costa
        padraoAusencias: {
          diaSemana: { 1: 0.02, 2: 0.02, 3: 0.03, 4: 0.02, 5: 0.04 },
          periodo: { 1: 0.01, 2: 0.02, 3: 0.02, 4: 0.03, 5: 0.04 },
          mes: {
            1: 0.03,
            2: 0.03,
            3: 0.02,
            4: 0.02,
            5: 0.02,
            6: 0.01,
            7: 0.01,
            8: 0.02,
            9: 0.03,
            10: 0.03,
            11: 0.04,
            12: 0.05,
          },
          clima: { frio: 0.04, chuva: 0.06, calor: 0.02, normal: 0.01 },
        },
        totalAulas: 700,
        totalAusencias: 18,
        mediaConfiabilidade: 0.97,
      },
    ]
  }

  async trainModel(): Promise<void> {
    this.isTraining = true

    // Simula treinamento do modelo
    await new Promise((resolve) => setTimeout(resolve, 3000))

    console.log("🤖 Modelo ML treinado com sucesso!")
    console.log(`📊 Padrões analisados: ${this.patterns.length} professores`)
    console.log(
      `📈 Precisão média: ${((this.patterns.reduce((acc, p) => acc + p.mediaConfiabilidade, 0) / this.patterns.length) * 100).toFixed(1)}%`,
    )

    this.isTraining = false
  }

  async predictAbsence(data: PredictionData): Promise<PredictionResult> {
    // Simula tempo de processamento da predição
    await new Promise((resolve) => setTimeout(resolve, 500))

    const pattern = this.patterns.find((p) => p.professorId === data.professorId)

    if (!pattern) {
      return {
        probabilidadeAusencia: 0.05, // 5% padrão
        confianca: 0.3,
        fatoresRisco: ["Dados insuficientes"],
        recomendacoes: ["Coletar mais dados históricos"],
      }
    }

    // Calcula probabilidade baseada em múltiplos fatores
    let probabilidade = 0.02 // Base 2%

    // Fator dia da semana
    probabilidade += pattern.padraoAusencias.diaSemana[data.diaSemana] || 0.02

    // Fator período
    probabilidade += pattern.padraoAusencias.periodo[data.periodo] || 0.02

    // Fator mês
    probabilidade += pattern.padraoAusencias.mes[data.mes] || 0.02

    // Fator clima (simulado)
    const climaAtual = this.getClimaSimulado()
    probabilidade += pattern.padraoAusencias.clima[climaAtual] || 0.02

    // Fator eventos especiais
    if (data.eventos) probabilidade += 0.03
    if (data.feriados) probabilidade += 0.05

    // Normaliza probabilidade (máximo 95%)
    probabilidade = Math.min(probabilidade, 0.95)

    const fatoresRisco: string[] = []
    const recomendacoes: string[] = []

    // Análise de fatores de risco
    if (probabilidade > 0.15) {
      fatoresRisco.push("Alta probabilidade de ausência")
      recomendacoes.push("Preparar professor substituto")
    }

    if (data.diaSemana === 1 || data.diaSemana === 5) {
      fatoresRisco.push("Segunda-feira ou sexta-feira")
      recomendacoes.push("Monitorar presença mais de perto")
    }

    if (data.periodo >= 4) {
      fatoresRisco.push("Período final do dia")
      recomendacoes.push("Considerar reagendamento para período anterior")
    }

    if (data.eventos) {
      fatoresRisco.push("Evento escolar no mesmo dia")
      recomendacoes.push("Confirmar presença com antecedência")
    }

    // Sugere professor substituto se probabilidade alta
    let professorSubstituto: string | undefined
    if (probabilidade > 0.12) {
      const substitutos = ["Ana Costa", "Carlos Santos", "Fernanda Lima"]
      professorSubstituto = substitutos[Math.floor(Math.random() * substitutos.length)]
      recomendacoes.push(`Professor substituto sugerido: ${professorSubstituto}`)
    }

    return {
      probabilidadeAusencia: probabilidade,
      confianca: pattern.mediaConfiabilidade,
      fatoresRisco,
      recomendacoes,
      professorSubstituto,
    }
  }

  private getClimaSimulado(): string {
    const climas = ["normal", "frio", "chuva", "calor"]
    const probabilidades = [0.6, 0.2, 0.15, 0.05] // Normal é mais provável

    const random = Math.random()
    let acumulado = 0

    for (let i = 0; i < climas.length; i++) {
      acumulado += probabilidades[i]
      if (random <= acumulado) {
        return climas[i]
      }
    }

    return "normal"
  }

  async generateWeeklyPredictions(): Promise<
    Array<{
      data: string
      professor: string
      disciplina: string
      probabilidade: number
      risco: "baixo" | "medio" | "alto"
    }>
  > {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const predictions = []
    const professores = [
      { id: "1", nome: "Maria Silva", disciplina: "Matemática" },
      { id: "2", nome: "João Pereira", disciplina: "História" },
      { id: "3", nome: "Ana Costa", disciplina: "Ciências" },
    ]

    // Gera predições para os próximos 7 dias
    for (let i = 0; i < 7; i++) {
      const data = new Date()
      data.setDate(data.getDate() + i)

      for (const prof of professores) {
        const predictionData: PredictionData = {
          professorId: prof.id,
          disciplina: prof.disciplina,
          diaSemana: data.getDay(),
          periodo: Math.floor(Math.random() * 5) + 1,
          mes: data.getMonth() + 1,
          feriados: false,
          eventos: Math.random() < 0.1, // 10% chance de evento
        }

        const result = await this.predictAbsence(predictionData)

        let risco: "baixo" | "medio" | "alto" = "baixo"
        if (result.probabilidadeAusencia > 0.15) risco = "alto"
        else if (result.probabilidadeAusencia > 0.08) risco = "medio"

        predictions.push({
          data: data.toLocaleDateString("pt-BR"),
          professor: prof.nome,
          disciplina: prof.disciplina,
          probabilidade: result.probabilidadeAusencia,
          risco,
        })
      }
    }

    return predictions.filter((p) => p.risco !== "baixo").slice(0, 10) // Retorna apenas riscos médios/altos
  }

  getModelStatus() {
    return {
      isTraining: this.isTraining,
      patternsCount: this.patterns.length,
      averageAccuracy: this.patterns.reduce((acc, p) => acc + p.mediaConfiabilidade, 0) / this.patterns.length,
      lastTraining: new Date(),
    }
  }
}
