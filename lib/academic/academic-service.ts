import type { CalendarioEscolar, Ausencia, Substituicao, PlanejamentoAula, Avaliacao, Comunicacao } from "./types"

export class AcademicService {
  private static instance: AcademicService

  static getInstance(): AcademicService {
    if (!AcademicService.instance) {
      AcademicService.instance = new AcademicService()
    }
    return AcademicService.instance
  }

  // Calendário Escolar
  async getEventosCalendario(mes?: number, ano?: number): Promise<CalendarioEscolar[]> {
    // Simulação de dados
    return [
      {
        id: "1",
        titulo: "Início do Semestre",
        descricao: "Primeiro dia de aulas do semestre",
        dataInicio: new Date("2024-02-05"),
        dataFim: new Date("2024-02-05"),
        tipo: "evento",
        cor: "#3b82f6",
        criadoPor: "admin",
        criadoEm: new Date(),
        notificar: true,
      },
      {
        id: "2",
        titulo: "Carnaval",
        dataInicio: new Date("2024-02-12"),
        dataFim: new Date("2024-02-14"),
        tipo: "feriado",
        cor: "#f59e0b",
        criadoPor: "admin",
        criadoEm: new Date(),
      },
      {
        id: "3",
        titulo: "Prova de Matemática - 9º Ano",
        dataInicio: new Date("2024-02-20"),
        dataFim: new Date("2024-02-20"),
        tipo: "prova",
        turmas: ["9A", "9B"],
        cor: "#ef4444",
        criadoPor: "prof001",
        criadoEm: new Date(),
        notificar: true,
      },
    ]
  }

  async criarEventoCalendario(evento: Omit<CalendarioEscolar, "id" | "criadoEm">): Promise<CalendarioEscolar> {
    const novoEvento: CalendarioEscolar = {
      ...evento,
      id: Math.random().toString(36).substr(2, 9),
      criadoEm: new Date(),
    }
    return novoEvento
  }

  // Gestão de Ausências
  async getAusencias(professorId?: string): Promise<Ausencia[]> {
    return [
      {
        id: "1",
        professorId: "prof001",
        professorNome: "Maria Silva",
        dataInicio: new Date("2024-02-15"),
        dataFim: new Date("2024-02-16"),
        motivo: "doenca",
        descricao: "Gripe",
        status: "aprovada",
        substitutoId: "prof002",
        substitutoNome: "João Santos",
        aulasAfetadas: ["MAT-9A-08:00", "MAT-9B-10:00"],
        aprovadoPor: "coord001",
        aprovadoEm: new Date("2024-02-14"),
      },
    ]
  }

  async solicitarAusencia(ausencia: Omit<Ausencia, "id" | "status">): Promise<Ausencia> {
    const novaAusencia: Ausencia = {
      ...ausencia,
      id: Math.random().toString(36).substr(2, 9),
      status: "pendente",
    }
    return novaAusencia
  }

  // Sistema de Substituições
  async getSubstituicoes(data?: Date): Promise<Substituicao[]> {
    return [
      {
        id: "1",
        ausenciaId: "1",
        professorOriginalId: "prof001",
        professorSubstitutoId: "prof002",
        dataSubstituicao: new Date("2024-02-15"),
        horarioInicio: "08:00",
        horarioFim: "08:50",
        disciplina: "Matemática",
        turma: "9º A",
        sala: "Sala 101",
        status: "confirmada",
        conteudoPlanejado: "Equações do 2º grau - exercícios",
      },
    ]
  }

  async agendarSubstituicao(substituicao: Omit<Substituicao, "id">): Promise<Substituicao> {
    const novaSubstituicao: Substituicao = {
      ...substituicao,
      id: Math.random().toString(36).substr(2, 9),
    }
    return novaSubstituicao
  }

  // Planejamento de Aulas
  async getPlanejamentosAula(professorId?: string, data?: Date): Promise<PlanejamentoAula[]> {
    return [
      {
        id: "1",
        professorId: "prof001",
        disciplinaId: "mat001",
        turmaId: "9a",
        data: new Date("2024-02-20"),
        horarioInicio: "08:00",
        horarioFim: "08:50",
        tema: "Equações do 2º Grau",
        objetivos: ["Compreender o conceito de equação quadrática", "Resolver equações usando fórmula de Bhaskara"],
        conteudo: "Introdução às equações do segundo grau, discriminante e fórmula de Bhaskara",
        metodologia: "Aula expositiva com exercícios práticos",
        recursos: ["Quadro", "Projetor", "Lista de exercícios"],
        status: "planejada",
      },
    ]
  }

  // Sistema de Avaliações
  async getAvaliacoes(professorId?: string, turmaId?: string): Promise<Avaliacao[]> {
    return [
      {
        id: "1",
        titulo: "Prova Bimestral - Matemática",
        disciplinaId: "mat001",
        turmaId: "9a",
        professorId: "prof001",
        tipo: "prova",
        data: new Date("2024-02-25"),
        peso: 8,
        pontuacaoMaxima: 10,
        descricao: "Avaliação sobre equações e funções",
        criterios: [
          "Resolução correta dos exercícios",
          "Organização e clareza na apresentação",
          "Uso adequado das fórmulas",
        ],
        status: "agendada",
      },
    ]
  }

  // Sistema de Comunicação
  async getComunicacoes(usuarioId: string): Promise<Comunicacao[]> {
    return [
      {
        id: "1",
        remetenteId: "coord001",
        remetenteNome: "Ana Coordenadora",
        destinatarios: ["prof001", "prof002"],
        assunto: "Reunião Pedagógica",
        mensagem: "Reunião marcada para sexta-feira às 14h na sala de coordenação.",
        tipo: "aviso",
        dataEnvio: new Date("2024-02-10"),
        lida: false,
      },
    ]
  }

  async enviarComunicacao(comunicacao: Omit<Comunicacao, "id" | "dataEnvio" | "lida">): Promise<Comunicacao> {
    const novaComunicacao: Comunicacao = {
      ...comunicacao,
      id: Math.random().toString(36).substr(2, 9),
      dataEnvio: new Date(),
      lida: false,
    }
    return novaComunicacao
  }
}
