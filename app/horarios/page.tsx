"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Clock, Sun, Sunset, Moon, Edit, Trash2 } from "lucide-react"
import { AddHorarioModal } from "@/components/modals/add-horario-modal"

interface Periodo {
  periodo: string
  inicio: string
  fim: string
  duracao: number
}

interface Horario {
  id: number
  turno: string
  periodos: Periodo[]
}

const horariosIniciais: Horario[] = [
  {
    id: 1,
    turno: "Manhã",
    periodos: [
      { periodo: "1º Período", inicio: "07:00", fim: "07:50", duracao: 50 },
      { periodo: "2º Período", inicio: "07:50", fim: "08:40", duracao: 50 },
      { periodo: "Intervalo", inicio: "08:40", fim: "09:00", duracao: 20 },
      { periodo: "3º Período", inicio: "09:00", fim: "09:50", duracao: 50 },
      { periodo: "4º Período", inicio: "09:50", fim: "10:40", duracao: 50 },
      { periodo: "5º Período", inicio: "10:40", fim: "11:30", duracao: 50 },
    ],
  },
  {
    id: 2,
    turno: "Tarde",
    periodos: [
      { periodo: "1º Período", inicio: "13:00", fim: "13:50", duracao: 50 },
      { periodo: "2º Período", inicio: "13:50", fim: "14:40", duracao: 50 },
      { periodo: "Intervalo", inicio: "14:40", fim: "15:00", duracao: 20 },
      { periodo: "3º Período", inicio: "15:00", fim: "15:50", duracao: 50 },
      { periodo: "4º Período", inicio: "15:50", fim: "16:40", duracao: 50 },
      { periodo: "5º Período", inicio: "16:40", fim: "17:30", duracao: 50 },
    ],
  },
  {
    id: 3,
    turno: "Noite",
    periodos: [
      { periodo: "1º Período", inicio: "19:00", fim: "19:50", duracao: 50 },
      { periodo: "2º Período", inicio: "19:50", fim: "20:40", duracao: 50 },
      { periodo: "Intervalo", inicio: "20:40", fim: "21:00", duracao: 20 },
      { periodo: "3º Período", inicio: "21:00", fim: "21:50", duracao: 50 },
      { periodo: "4º Período", inicio: "21:50", fim: "22:40", duracao: 50 },
    ],
  },
]

export default function HorariosPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [horarios, setHorarios] = useState<Horario[]>(horariosIniciais)

  const handleAddHorario = (novoHorario: Omit<Horario, "id">) => {
    const horarioComId: Horario = {
      ...novoHorario,
      id: Math.max(...horarios.map((h) => h.id), 0) + 1,
    }
    setHorarios((prev) => [...prev, horarioComId])
  }

  const handleEditTurno = (horario: Horario) => {
    console.log("Editando turno:", horario.turno)
    alert(`Funcionalidade de edição será implementada para: ${horario.turno}`)
  }

  const handleDeleteTurno = (horario: Horario) => {
    if (confirm(`Tem certeza que deseja excluir o turno "${horario.turno}"?`)) {
      setHorarios((prev) => prev.filter((h) => h.id !== horario.id))
      alert(`Turno "${horario.turno}" excluído com sucesso!`)
    }
  }

  const getTurnoIcon = (turno: string) => {
    switch (turno) {
      case "Manhã":
        return <Sun className="h-5 w-5 text-yellow-500" />
      case "Tarde":
        return <Sunset className="h-5 w-5 text-orange-500" />
      case "Noite":
        return <Moon className="h-5 w-5 text-blue-500" />
      default:
        return <Clock className="h-5 w-5" />
    }
  }

  const getTurnoColor = (turno: string) => {
    switch (turno) {
      case "Manhã":
        return "border-l-yellow-500"
      case "Tarde":
        return "border-l-brand-orange-500"
      case "Noite":
        return "border-l-brand-blue-500"
      default:
        return "border-l-gray-500"
    }
  }

  // Estatísticas calculadas
  const totalPeriodos = horarios.reduce((acc, h) => acc + h.periodos.length, 0)
  const totalTurnos = horarios.length

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold brand-text-gradient">Horários</h1>
          <p className="text-muted-foreground">Gerencie os horários de aula por turno</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-brand-red-500 hover:bg-brand-red-600">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Horário
        </Button>
      </div>

      {/* Estatísticas Dinâmicas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Turnos</p>
                <p className="text-2xl font-bold text-blue-600">{totalTurnos}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Períodos</p>
                <p className="text-2xl font-bold text-green-600">{totalPeriodos}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-bold">P</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Média por Turno</p>
                <p className="text-2xl font-bold text-purple-600">
                  {totalTurnos > 0 ? Math.round(totalPeriodos / totalTurnos) : 0}
                </p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-sm font-bold">📊</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {horarios.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Clock className="w-12 h-12 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum horário configurado</h3>
          <p className="text-gray-600 mb-4">Comece adicionando o primeiro horário da escola.</p>
          <Button onClick={() => setIsAddModalOpen(true)} className="bg-brand-red-500 hover:bg-brand-red-600">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Primeiro Horário
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {horarios.map((horario) => (
            <Card key={horario.id} className={`border-l-4 ${getTurnoColor(horario.turno)}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getTurnoIcon(horario.turno)}
                  {horario.turno}
                </CardTitle>
                <CardDescription>{horario.periodos.length} períodos configurados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {horario.periodos.map((periodo, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-2 rounded-md ${
                        periodo.periodo === "Intervalo"
                          ? "bg-muted/50 border-l-2 border-l-green-500"
                          : "bg-background border"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium">{periodo.periodo}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono">
                          {periodo.inicio} - {periodo.fim}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {periodo.duracao}min
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-4 mt-4 border-t">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditTurno(horario)}>
                    <Edit className="mr-1 h-3 w-3" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteTurno(horario)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddHorarioModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} onAdd={handleAddHorario} />
    </div>
  )
}
