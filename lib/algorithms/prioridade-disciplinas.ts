import type { Conflito, Professor, Disciplina, SolucaoRemanejamento, ResultadoAlgoritmo } from "./types"

export class AlgoritmoPrioridadeDisciplinas {
  private professores: Professor[]
  private disciplinas: Disciplina[]

  constructor(professores: Professor[], disciplinas: Disciplina[]) {
    this.professores = professores
    this.disciplinas = disciplinas
  }

  async executar(conflitos: Conflito[]): Promise<ResultadoAlgoritmo> {
    const inicioTempo = Date.now()
    const solucoes: SolucaoRemanejamento[] = []

    // Ordena conflitos por prioridade da disciplina
    const conflitosOrdenados = conflitos
      .filter((c) => c.status === "Pendente")
      .sort((a, b) => {
        const prioridadeA = this.obterPrioridadeDisciplina(a.disciplina)
        const prioridadeB = this.obterPrioridadeDisciplina(b.disciplina)
        return prioridadeB - prioridadeA
      })

    for (const conflito of conflitosOrdenados) {
      const solucao = await this.resolverConflitoPorPrioridade(conflito)
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
      algoritmoUtilizado: "Prioridade de Disciplinas",
    }
  }

  private async resolverConflitoPorPrioridade(conflito: Conflito): Promise<SolucaoRemanejamento | null> {
    await new Promise((resolve) => setTimeout(resolve, 150))

    const prioridadeDisciplina = this.obterPrioridadeDisciplina(conflito.disciplina)

    // Para disciplinas de alta prioridade, busca soluções mais robustas
    if (prioridadeDisciplina >= 8) {
      const professorEspecialista = this.encontrarProfessorEspecialista(conflito.disciplina)
      if (professorEspecialista) {
        return {
          conflito,
          novoProfessor: professorEspecialista,
          score: 95,
          justificativa: `Professor especialista alocado para disciplina prioritária: ${conflito.disciplina}`,
        }
      }
    }

    // Para disciplinas de média prioridade
    if (prioridadeDisciplina >= 5) {
      const professorDisponivel = this.encontrarProfessorDisponivel(conflito.disciplina)
      if (professorDisponivel) {
        return {
          conflito,
          novoProfessor: professorDisponivel,
          score: 75,
          justificativa: `Professor substituto para disciplina de média prioridade: ${conflito.disciplina}`,
        }
      }
    }

    // Para disciplinas de baixa prioridade, pode reagendar
    return {
      conflito,
      score: 50,
      justificativa: `Aula reagendada - disciplina de baixa prioridade: ${conflito.disciplina}`,
    }
  }

  private obterPrioridadeDisciplina(nomeDisciplina: string): number {
    const disciplina = this.disciplinas.find((d) => d.nome === nomeDisciplina)
    return disciplina?.prioridade || 5
  }

  private encontrarProfessorEspecialista(disciplina: string): Professor | null {
    // Encontra professor que só ensina essa disciplina (especialista)
    return (
      this.professores.find((prof) => prof.disciplinas.length === 1 && prof.disciplinas.includes(disciplina)) || null
    )
  }

  private encontrarProfessorDisponivel(disciplina: string): Professor | null {
    return this.professores.find((prof) => prof.disciplinas.includes(disciplina)) || null
  }
}
