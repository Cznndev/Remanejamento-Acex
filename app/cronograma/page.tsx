"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Download, Printer, Plus } from "lucide-react"
import { AddEventoModal } from "@/components/modals/add-evento-modal"

// Dados de exemplo
const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"]
const periodos = ["1º", "2º", "3º", "4º", "5º"]
const turmas = ["6º Ano A", "7º Ano B", "8º Ano C", "9º Ano A", "1º Ano EM"]

// Gera dados aleatórios para o cronograma
const gerarCronograma = () => {
  const disciplinas = ["Matemática", "Português", "História", "Geografia", "Ciências", "Inglês", "Ed. Física", "Artes"]
  const professores = ["Maria S.", "João P.", "Ana C.", "Carlos S.", "Fernanda L."]
  const salas = ["Sala 1", "Sala 2", "Sala 3", "Sala 4", "Sala 5"]

  const cronograma: Record<string, any> = {}

  turmas.forEach((turma) => {
    cronograma[turma] = {}
    diasSemana.forEach((dia) => {
      cronograma[turma][dia] = {}
      periodos.forEach((periodo) => {
        const randomIndex = Math.floor(Math.random() * disciplinas.length)
        const randomProfIndex = Math.floor(Math.random() * professores.length)
        const randomSalaIndex = Math.floor(Math.random() * salas.length)

        cronograma[turma][dia][periodo] = {
          disciplina: disciplinas[randomIndex],
          professor: professores[randomProfIndex],
          sala: salas[randomSalaIndex],
        }
      })
    })
  })

  return cronograma
}

export default function Cronograma() {
  const [turmaSelecionada, setTurmaSelecionada] = useState(turmas[0])
  const [isAddEventoModalOpen, setIsAddEventoModalOpen] = useState(false)
  const cronograma = gerarCronograma()

  const handleImprimir = () => {
    window.print()
  }

  const handleExportar = () => {
    alert("Exportando cronograma...")
  }

  const handleVisualizarCalendario = () => {
    setIsAddEventoModalOpen(true)
  }

  const handleAdicionarEvento = () => {
    setIsAddEventoModalOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Cronograma</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleImprimir}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button variant="outline" onClick={handleExportar}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline" onClick={handleAdicionarEvento}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Evento
          </Button>
          <Button onClick={handleVisualizarCalendario}>
            <Calendar className="mr-2 h-4 w-4" />
            Visualizar Calendário
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cronograma de Aulas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Select value={turmaSelecionada} onValueChange={setTurmaSelecionada}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione a turma" />
              </SelectTrigger>
              <SelectContent>
                {turmas.map((turma) => (
                  <SelectItem key={turma} value={turma}>
                    {turma}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="semanal">
            <TabsList>
              <TabsTrigger value="semanal">Semanal</TabsTrigger>
              <TabsTrigger value="diario">Diário</TabsTrigger>
            </TabsList>
            <TabsContent value="semanal">
              <div className="border rounded-md overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted">
                      <th className="p-2 border-r text-left">Horário</th>
                      {diasSemana.map((dia) => (
                        <th key={dia} className="p-2 border-r text-center">
                          {dia}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {periodos.map((periodo) => (
                      <tr key={periodo} className="border-t">
                        <td className="p-2 border-r font-medium">{periodo}º Período</td>
                        {diasSemana.map((dia) => {
                          const aula = cronograma[turmaSelecionada][dia][periodo]
                          return (
                            <td key={dia} className="p-2 border-r">
                              <div className="text-sm">
                                <div className="font-medium">{aula.disciplina}</div>
                                <div className="text-muted-foreground">{aula.professor}</div>
                                <div className="text-xs text-muted-foreground">{aula.sala}</div>
                              </div>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            <TabsContent value="diario">
              <div className="text-center p-6 text-muted-foreground">
                Selecione uma data específica para visualizar o cronograma diário.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AddEventoModal open={isAddEventoModalOpen} onOpenChange={setIsAddEventoModalOpen} />
    </div>
  )
}
