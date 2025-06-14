import { AlgoritmoOtimizacaoRecursos } from "./otimizacao-recursos"
import { AlgoritmoPrioridadeDisciplinas } from "./prioridade-disciplinas"
import { AlgoritmoBalanceamentoCarga } from "./balanceamento-carga"
import { AlgoritmoGenetico } from "./algoritmo-genetico"
import type { Professor, Sala, Horario, Disciplina } from "./types"

export class AlgorithmFactory {
  static criarAlgoritmo(
    tipo: string,
    professores: Professor[],
    salas: Sala[],
    horarios: Horario[],
    disciplinas: Disciplina[],
  ) {
    switch (tipo) {
      case "otimizacao":
        return new AlgoritmoOtimizacaoRecursos(professores, salas, horarios)
      case "prioridade":
        return new AlgoritmoPrioridadeDisciplinas(professores, disciplinas)
      case "balanceamento":
        return new AlgoritmoBalanceamentoCarga(professores)
      case "genetico":
        return new AlgoritmoGenetico(professores)
      default:
        return new AlgoritmoOtimizacaoRecursos(professores, salas, horarios)
    }
  }
}
