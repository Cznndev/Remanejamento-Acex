export interface Professor {
  id: number
  nome: string
  disciplinas: string[]
  disponibilidade: string[]
  cargaHoraria: number
  preferencias?: {
    turnos: string[]
    salas: string[]
  }
}

export interface Turma {
  id: number
  nome: string
  turno: string
  sala: string
  qtdAlunos: number
  anoLetivo: string
}

export interface Disciplina {
  id: number
  nome: string
  cargaHoraria: number
  area: string
  prioridade: number
  series: string[]
}

export interface Sala {
  id: number
  nome: string
  capacidade: number
  tipo: string
  recursos: string[]
  status: string
}

export interface Horario {
  id: number
  inicio: string
  fim: string
  periodo: string
  turno: string
  diaSemana: string
}

export interface Conflito {
  id: number
  professor: string
  turma: string
  disciplina: string
  motivo: string
  data: string
  status: string
  prioridade: number
  horario: Horario
  sala: string
}

export interface SolucaoRemanejamento {
  conflito: Conflito
  novoProfessor?: Professor
  novoHorario?: Horario
  novaSala?: Sala
  score: number
  justificativa: string
}

export interface ResultadoAlgoritmo {
  solucoes: SolucaoRemanejamento[]
  tempoExecucao: number
  scoreTotal: number
  conflitosResolvidos: number
  algoritmoUtilizado: string
}
