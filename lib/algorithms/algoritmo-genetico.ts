import type { Conflito, Professor, SolucaoRemanejamento, ResultadoAlgoritmo } from "./types"

interface Individuo {
  solucoes: SolucaoRemanejamento[]
  fitness: number
}

export class AlgoritmoGenetico {
  private professores: Professor[]
  private populacao: Individuo[] = []
  private tamanhoPopulacao = 20
  private geracoes = 10
  private taxaMutacao = 0.1

  constructor(professores: Professor[]) {
    this.professores = professores
  }

  async executar(conflitos: Conflito[]): Promise<ResultadoAlgoritmo> {
    const inicioTempo = Date.now()

    const conflitosAtivos = conflitos.filter((c) => c.status === "Pendente")

    // Inicializa população
    this.inicializarPopulacao(conflitosAtivos)

    // Evolui por várias gerações
    for (let geracao = 0; geracao < this.geracoes; geracao++) {
      await this.evoluirPopulacao()
    }

    // Seleciona melhor indivíduo
    const melhorIndividuo = this.populacao.reduce((melhor, atual) => (atual.fitness > melhor.fitness ? atual : melhor))

    const tempoExecucao = Date.now() - inicioTempo

    return {
      solucoes: melhorIndividuo.solucoes,
      tempoExecucao,
      scoreTotal: melhorIndividuo.fitness,
      conflitosResolvidos: melhorIndividuo.solucoes.length,
      algoritmoUtilizado: "Algoritmo Genético",
    }
  }

  private inicializarPopulacao(conflitos: Conflito[]) {
    for (let i = 0; i < this.tamanhoPopulacao; i++) {
      const individuo = this.criarIndividuoAleatorio(conflitos)
      this.populacao.push(individuo)
    }
  }

  private criarIndividuoAleatorio(conflitos: Conflito[]): Individuo {
    const solucoes: SolucaoRemanejamento[] = []

    for (const conflito of conflitos) {
      const professoresAptos = this.professores.filter((prof) => prof.disciplinas.includes(conflito.disciplina))

      if (professoresAptos.length > 0) {
        const professorAleatorio = professoresAptos[Math.floor(Math.random() * professoresAptos.length)]
        const score = Math.floor(Math.random() * 50) + 50 // Score entre 50-100

        solucoes.push({
          conflito,
          novoProfessor: professorAleatorio,
          score,
          justificativa: `Solução genética: ${professorAleatorio.nome}`,
        })
      }
    }

    return {
      solucoes,
      fitness: this.calcularFitness(solucoes),
    }
  }

  private calcularFitness(solucoes: SolucaoRemanejamento[]): number {
    const scoreTotal = solucoes.reduce((acc, sol) => acc + sol.score, 0)
    const penalidade = this.calcularPenalidades(solucoes)
    return scoreTotal - penalidade
  }

  private calcularPenalidades(solucoes: SolucaoRemanejamento[]): number {
    let penalidade = 0
    const professoresUsados = new Map<number, number>()

    // Penaliza sobrecarga de professores
    solucoes.forEach((sol) => {
      if (sol.novoProfessor) {
        const count = professoresUsados.get(sol.novoProfessor.id) || 0
        professoresUsados.set(sol.novoProfessor.id, count + 1)

        if (count > 2) {
          // Mais de 2 aulas extras
          penalidade += 20
        }
      }
    })

    return penalidade
  }

  private async evoluirPopulacao() {
    // Simula tempo de evolução
    await new Promise((resolve) => setTimeout(resolve, 50))

    // Seleção por torneio
    const novaPopulacao: Individuo[] = []

    for (let i = 0; i < this.tamanhoPopulacao; i++) {
      const pai1 = this.selecaoTorneio()
      const pai2 = this.selecaoTorneio()
      let filho = this.crossover(pai1, pai2)

      if (Math.random() < this.taxaMutacao) {
        filho = this.mutacao(filho)
      }

      novaPopulacao.push(filho)
    }

    this.populacao = novaPopulacao
  }

  private selecaoTorneio(): Individuo {
    const tamanhoTorneio = 3
    let melhor = this.populacao[Math.floor(Math.random() * this.populacao.length)]

    for (let i = 1; i < tamanhoTorneio; i++) {
      const candidato = this.populacao[Math.floor(Math.random() * this.populacao.length)]
      if (candidato.fitness > melhor.fitness) {
        melhor = candidato
      }
    }

    return melhor
  }

  private crossover(pai1: Individuo, pai2: Individuo): Individuo {
    const pontoCorte = Math.floor(pai1.solucoes.length / 2)
    const novasSolucoes = [...pai1.solucoes.slice(0, pontoCorte), ...pai2.solucoes.slice(pontoCorte)]

    return {
      solucoes: novasSolucoes,
      fitness: this.calcularFitness(novasSolucoes),
    }
  }

  private mutacao(individuo: Individuo): Individuo {
    const novasSolucoes = [...individuo.solucoes]
    const indiceAleatorio = Math.floor(Math.random() * novasSolucoes.length)

    if (novasSolucoes[indiceAleatorio]) {
      // Muta o score
      novasSolucoes[indiceAleatorio].score = Math.floor(Math.random() * 50) + 50
    }

    return {
      solucoes: novasSolucoes,
      fitness: this.calcularFitness(novasSolucoes),
    }
  }
}
