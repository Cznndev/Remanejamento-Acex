export interface CalendarioEscolar {
  id: string
  titulo: string
  descricao?: string
  dataInicio: Date
  dataFim: Date
  tipo: "feriado" | "evento" | "prova" | "reuniao" | "formatura" | "recesso"
  turmas?: string[]
  professores?: string[]
  cor: string
  recorrente?: boolean
  notificar?: boolean
  criadoPor: string
  criadoEm: Date
}

export interface Ausencia {
  id: string
  professorId: string
  professorNome: string
  dataInicio: Date
  dataFim: Date
  motivo: "doenca" | "licenca" | "falta" | "capacitacao" | "outro"
  descricao?: string
  status: "pendente" | "aprovada" | "rejeitada"
  substitutoId?: string
  substitutoNome?: string
  aulasAfetadas: string[]
  documentoAnexo?: string
  aprovadoPor?: string
  aprovadoEm?: Date
}

export interface Substituicao {
  id: string
  ausenciaId: string
  professorOriginalId: string
  professorSubstitutoId: string
  dataSubstituicao: Date
  horarioInicio: string
  horarioFim: string
  disciplina: string
  turma: string
  sala: string
  status: "agendada" | "confirmada" | "cancelada" | "realizada"
  observacoes?: string
  conteudoPlanejado?: string
}

export interface PlanejamentoAula {
  id: string
  professorId: string
  disciplinaId: string
  turmaId: string
  data: Date
  horarioInicio: string
  horarioFim: string
  tema: string
  objetivos: string[]
  conteudo: string
  metodologia: string
  recursos: string[]
  avaliacao?: string
  observacoes?: string
  status: "planejada" | "em-andamento" | "concluida" | "cancelada"
  anexos?: string[]
}

export interface Avaliacao {
  id: string
  titulo: string
  disciplinaId: string
  turmaId: string
  professorId: string
  tipo: "prova" | "trabalho" | "seminario" | "projeto" | "participacao"
  data: Date
  peso: number
  pontuacaoMaxima: number
  descricao?: string
  criterios: string[]
  status: "agendada" | "aplicada" | "corrigida" | "publicada"
  resultados?: AvaliacaoResultado[]
}

export interface AvaliacaoResultado {
  id: string
  avaliacaoId: string
  alunoId: string
  alunoNome: string
  pontuacao: number
  observacoes?: string
  dataCorrecao: Date
}

export interface Comunicacao {
  id: string
  remetenteId: string
  remetenteNome: string
  destinatarios: string[]
  assunto: string
  mensagem: string
  tipo: "aviso" | "urgente" | "informativo" | "solicitacao"
  anexos?: string[]
  dataEnvio: Date
  lida: boolean
  respondida?: boolean
  respostas?: ComunicacaoResposta[]
}

export interface ComunicacaoResposta {
  id: string
  comunicacaoId: string
  autorId: string
  autorNome: string
  mensagem: string
  dataResposta: Date
}
