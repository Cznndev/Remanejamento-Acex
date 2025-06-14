import type { Conflito, Professor, SolucaoRemanejamento, ResultadoAlgoritmo } from "./types"

export class AlgoritmoBalanceamentoCarga {
  private professores: Professor[]
  private cargaAtual: Map<number, number> = new Map()

  constructor(professores: Professor[]) {
    this.professores = professores
    this.inicializarCarga()
  }

  private inicializarCarga() {
    this.professores.forEach((prof) => {
      this.cargaAtual.set(prof.id, prof.cargaHoraria)
    })
  }

  async executar(conflitos: Conflito[]): Promise<ResultadoAlgoritmo> {
    const inicioTempo = Date.now()
    const solucoes: SolucaoRemanejamento[] = []

    const conflitosOrdenados = conflitos
      .filter((c) => c.status === "Pendente")
      .sort((a, b) => a.prioridade - b.prioridade) // Resolve conflitos menores primeiro

    for (const conflito of conflitosOrdenados) {
      const solucao = await this.resolverComBalanceamento(conflito)
      if (solucao) {
        solucoes.push(solucao)
        this.atualizarCarga(solucao)
      }
    }

    const tempoExecucao = Date.now() - inicioTempo
    const scoreTotal = solucoes.reduce((acc, sol) => acc + sol.score, 0)

    return {
      solucoes,
      tempoExecucao,
      scoreTotal,
      conflitosResolvidos: solucoes.length,
      algoritmoUtilizado: "Balanceamento de Carga",
    }
  }

  private async resolverComBalanceamento(conflito: Conflito): Promise<SolucaoRemanejamento | null> {
    await new Promise((resolve) => setTimeout(resolve, 120))

    // Encontra professor com menor carga que pode ensinar a disciplina
    const professoresAptos = this.professores.filter(
      (prof) => prof.disciplinas.includes(conflito.disciplina) && prof.nome !== conflito.professor,
    )

    if (professoresAptos.length === 0) {
      return {
        conflito,
        score: 30,
        justificativa: "Nenhum professor substituto disponível - aula cancelada",
      }
    }

    // Ordena por menor carga atual
    const professorMenorCarga = professoresAptos.reduce((menor, atual) => {
      const cargaMenor = this.cargaAtual.get(menor.id) || 0
      const cargaAtual = this.cargaAtual.get(atual.id) || 0
      return cargaAtual < cargaMenor ? atual : menor
    })

    const cargaAtualProfessor = this.cargaAtual.get(professorMenorCarga.id) || 0
    const balanceamento = this.calcularBalanceamento(cargaAtualProfessor)

    return {
      conflito,
      novoProfessor: professorMenorCarga,
      score: balanceamento.score,
      justificativa: `Professor com menor carga alocado: ${professorMenorCarga.nome} (${cargaAtualProfessor}h)`,
    }
  }

  private calcularBalanceamento(cargaProfessor: number): { score: number } {
    // Score baseado na carga do professor (menor carga = maior score)
    const cargaMaxima = Math.max(...Array.from(this.cargaAtual.values()))
    const percentualCarga = cargaProfessor / cargaMaxima
    const score = Math.round(90 - percentualCarga * 40)

    return { score: Math.max(score, 40) }
  }

  private atualizarCarga(solucao: SolucaoRemanejamento) {
    if (solucao.novoProfessor) {
      const cargaAtual = this.cargaAtual.get(solucao.novoProfessor.id) || 0
      this.cargaAtual.set(solucao.novoProfessor.id, cargaAtual + 1)
    }
  }
}
