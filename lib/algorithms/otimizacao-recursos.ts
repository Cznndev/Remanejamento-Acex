import type { Conflito, Professor, Sala, Horario, SolucaoRemanejamento, ResultadoAlgoritmo } from "./types"

export class AlgoritmoOtimizacaoRecursos {
  private professores: Professor[]
  private salas: Sala[]
  private horarios: Horario[]

  constructor(professores: Professor[], salas: Sala[], horarios: Horario[]) {
    this.professores = professores
    this.salas = salas
    this.horarios = horarios
  }

  async executar(conflitos: Conflito[]): Promise<ResultadoAlgoritmo> {
    const inicioTempo = Date.now()
    const solucoes: SolucaoRemanejamento[] = []

    // Ordena conflitos por prioridade (maior prioridade primeiro)
    const conflitosOrdenados = conflitos
      .filter((c) => c.status === "Pendente")
      .sort((a, b) => b.prioridade - a.prioridade)

    for (const conflito of conflitosOrdenados) {
      const solucao = await this.resolverConflito(conflito)
      if (solucao) {
        solucoes.push(solucao)
      }
    }

    const tempoExecucao = Date.now() - inicioTempo
    const scoreTotal = solucoes.reduce((acc, sol) => acc + sol.score, 0)

    return {
      solucoes,
      tempoExecucao,
      scoreTotal,
      conflitosResolvidos: solucoes.length,
      algoritmoUtilizado: "Otimização de Recursos",
    }
  }

  private async resolverConflito(conflito: Conflito): Promise<SolucaoRemanejamento | null> {
    // Simula tempo de processamento
    await new Promise((resolve) => setTimeout(resolve, 100))

    // 1. Tenta encontrar professor substituto da mesma disciplina
    const professoresDisponiveis = this.professores.filter(
      (prof) => prof.disciplinas.includes(conflito.disciplina) && prof.nome !== conflito.professor,
    )

    if (professoresDisponiveis.length > 0) {
      const melhorProfessor = this.selecionarMelhorProfessor(professoresDisponiveis, conflito)
      return {
        conflito,
        novoProfessor: melhorProfessor,
        score: 85,
        justificativa: `Professor substituto encontrado: ${melhorProfessor.nome} (mesma disciplina)`,
      }
    }

    // 2. Tenta encontrar sala alternativa
    const salasDisponiveis = this.salas.filter((sala) => sala.status === "Disponível" && sala.nome !== conflito.sala)

    if (salasDisponiveis.length > 0) {
      const melhorSala = this.selecionarMelhorSala(salasDisponiveis, conflito)
      return {
        conflito,
        novaSala: melhorSala,
        score: 70,
        justificativa: `Sala alternativa encontrada: ${melhorSala.nome}`,
      }
    }

    // 3. Tenta encontrar horário alternativo
    const horariosDisponiveis = this.horarios.filter(
      (horario) => horario.turno === conflito.horario.turno && horario.id !== conflito.horario.id,
    )

    if (horariosDisponiveis.length > 0) {
      const melhorHorario = this.selecionarMelhorHorario(horariosDisponiveis, conflito)
      return {
        conflito,
        novoHorario: melhorHorario,
        score: 60,
        justificativa: `Horário alternativo encontrado: ${melhorHorario.periodo}`,
      }
    }

    return null
  }

  private selecionarMelhorProfessor(professores: Professor[], conflito: Conflito): Professor {
    // Prioriza professor com menor carga horária
    return professores.reduce((melhor, atual) => (atual.cargaHoraria < melhor.cargaHoraria ? atual : melhor))
  }

  private selecionarMelhorSala(salas: Sala[], conflito: Conflito): Sala {
    // Prioriza sala com recursos similares
    return salas.reduce((melhor, atual) => (atual.recursos.length > melhor.recursos.length ? atual : melhor))
  }

  private selecionarMelhorHorario(horarios: Horario[], conflito: Conflito): Horario {
    // Prioriza horário mais próximo ao original
    return horarios[0] // Simplificado para o exemplo
  }
}
