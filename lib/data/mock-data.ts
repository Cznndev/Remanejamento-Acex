import type { Professor, Sala, Horario, Disciplina } from "../algorithms/types"

export const professoresMock: Professor[] = [
  {
    id: 1,
    nome: "Maria Silva",
    disciplinas: ["Matemática", "Física"],
    disponibilidade: ["Manhã", "Tarde"],
    cargaHoraria: 40,
    preferencias: {
      turnos: ["Manhã"],
      salas: ["Sala 1", "Sala 2"],
    },
  },
  {
    id: 2,
    nome: "João Pereira",
    disciplinas: ["História", "Geografia"],
    disponibilidade: ["Tarde"],
    cargaHoraria: 30,
    preferencias: {
      turnos: ["Tarde"],
      salas: ["Sala 3", "Sala 4"],
    },
  },
  {
    id: 3,
    nome: "Ana Costa",
    disciplinas: ["Ciências", "Biologia"],
    disponibilidade: ["Manhã", "Tarde"],
    cargaHoraria: 35,
    preferencias: {
      turnos: ["Manhã", "Tarde"],
      salas: ["Laboratório"],
    },
  },
  {
    id: 4,
    nome: "Carlos Santos",
    disciplinas: ["Português", "Literatura"],
    disponibilidade: ["Noite"],
    cargaHoraria: 25,
    preferencias: {
      turnos: ["Noite"],
      salas: ["Sala 5"],
    },
  },
  {
    id: 5,
    nome: "Fernanda Lima",
    disciplinas: ["Inglês"],
    disponibilidade: ["Manhã"],
    cargaHoraria: 20,
    preferencias: {
      turnos: ["Manhã"],
      salas: ["Sala 6"],
    },
  },
]

export const salasMock: Sala[] = [
  {
    id: 1,
    nome: "Sala 1",
    capacidade: 35,
    tipo: "Sala de Aula",
    recursos: ["Projetor", "Ar-condicionado"],
    status: "Disponível",
  },
  {
    id: 2,
    nome: "Sala 2",
    capacidade: 30,
    tipo: "Sala de Aula",
    recursos: ["Projetor"],
    status: "Disponível",
  },
  {
    id: 3,
    nome: "Laboratório",
    capacidade: 25,
    tipo: "Laboratório",
    recursos: ["Equipamentos", "Projetor"],
    status: "Disponível",
  },
]

export const horariosMock: Horario[] = [
  {
    id: 1,
    inicio: "07:30",
    fim: "08:20",
    periodo: "1º Período",
    turno: "Manhã",
    diaSemana: "Segunda",
  },
  {
    id: 2,
    inicio: "08:20",
    fim: "09:10",
    periodo: "2º Período",
    turno: "Manhã",
    diaSemana: "Segunda",
  },
  {
    id: 3,
    inicio: "13:00",
    fim: "13:50",
    periodo: "1º Período",
    turno: "Tarde",
    diaSemana: "Segunda",
  },
]

export const disciplinasMock: Disciplina[] = [
  {
    id: 1,
    nome: "Matemática",
    cargaHoraria: 6,
    area: "Exatas",
    prioridade: 9,
    series: ["6º Ano", "7º Ano", "8º Ano", "9º Ano"],
  },
  {
    id: 2,
    nome: "Português",
    cargaHoraria: 6,
    area: "Linguagens",
    prioridade: 9,
    series: ["6º Ano", "7º Ano", "8º Ano", "9º Ano"],
  },
  {
    id: 3,
    nome: "História",
    cargaHoraria: 4,
    area: "Humanas",
    prioridade: 7,
    series: ["6º Ano", "7º Ano", "8º Ano", "9º Ano"],
  },
  {
    id: 4,
    nome: "Ciências",
    cargaHoraria: 4,
    area: "Biológicas",
    prioridade: 8,
    series: ["6º Ano", "7º Ano", "8º Ano", "9º Ano"],
  },
  {
    id: 5,
    nome: "Inglês",
    cargaHoraria: 2,
    area: "Linguagens",
    prioridade: 6,
    series: ["6º Ano", "7º Ano", "8º Ano", "9º Ano"],
  },
]
