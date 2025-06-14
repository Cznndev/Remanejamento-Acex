"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Users, MapPin } from "lucide-react"
import { AddTurmaModal } from "@/components/modals/add-turma-modal"

interface Turma {
  id: number
  nome: string
  serie: string
  turno: string
  sala: string
  qtdAlunos: number
  anoLetivo: string
  status: string
}

const turmasIniciais: Turma[] = [
  {
    id: 1,
    nome: "6º Ano A",
    serie: "6º Ano",
    turno: "Manhã",
    sala: "Sala 1",
    qtdAlunos: 28,
    anoLetivo: "2024",
    status: "Ativa",
  },
  {
    id: 2,
    nome: "7º Ano B",
    serie: "7º Ano",
    turno: "Tarde",
    sala: "Sala 3",
    qtdAlunos: 30,
    anoLetivo: "2024",
    status: "Ativa",
  },
  {
    id: 3,
    nome: "8º Ano C",
    serie: "8º Ano",
    turno: "Manhã",
    sala: "Sala 5",
    qtdAlunos: 25,
    anoLetivo: "2024",
    status: "Ativa",
  },
  {
    id: 4,
    nome: "9º Ano A",
    serie: "9º Ano",
    turno: "Tarde",
    sala: "Sala 7",
    qtdAlunos: 32,
    anoLetivo: "2024",
    status: "Ativa",
  },
]

export default function TurmasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [turmas, setTurmas] = useState<Turma[]>(turmasIniciais)

  const filteredTurmas = turmas.filter(
    (turma) =>
      turma.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      turma.serie.toLowerCase().includes(searchTerm.toLowerCase()) ||
      turma.turno.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddTurma = (novaTurma: Omit<Turma, "id">) => {
    const turmaComId: Turma = {
      ...novaTurma,
      id: Math.max(...turmas.map((t) => t.id), 0) + 1,
    }
    setTurmas((prev) => [...prev, turmaComId])
  }

  const handleEdit = (turma: Turma) => {
    console.log("Editando turma:", turma.nome)
    alert(`Funcionalidade de edição será implementada para: ${turma.nome}`)
  }

  const handleDelete = (turma: Turma) => {
    if (confirm(`Tem certeza que deseja excluir a turma "${turma.nome}"?`)) {
      setTurmas((prev) => prev.filter((t) => t.id !== turma.id))
      alert(`Turma "${turma.nome}" excluída com sucesso!`)
    }
  }

  // Estatísticas calculadas
  const totalAlunos = turmas.reduce((acc, turma) => acc + turma.qtdAlunos, 0)
  const turmasAtivas = turmas.filter((t) => t.status === "Ativa").length

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-600">Turmas</h1>
          <p className="text-muted-foreground">Gerencie as turmas da escola</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Turma
        </Button>
      </div>

      {/* Estatísticas Dinâmicas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Turmas</p>
                <p className="text-2xl font-bold text-blue-600">{turmas.length}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-bold">{turmas.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Turmas Ativas</p>
                <p className="text-2xl font-bold text-green-600">{turmasAtivas}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-bold">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Alunos</p>
                <p className="text-2xl font-bold text-purple-600">{totalAlunos}</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Média por Turma</p>
                <p className="text-2xl font-bold text-orange-600">
                  {turmas.length > 0 ? Math.round(totalAlunos / turmas.length) : 0}
                </p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-sm font-bold">📊</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar turmas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {filteredTurmas.length === 0 && searchTerm ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhuma turma encontrada para "{searchTerm}".</p>
        </div>
      ) : filteredTurmas.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Users className="w-12 h-12 text-orange-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma turma cadastrada</h3>
          <p className="text-gray-600 mb-4">Comece adicionando a primeira turma da escola.</p>
          <Button onClick={() => setIsAddModalOpen(true)} className="bg-orange-500 hover:bg-orange-600">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Primeira Turma
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTurmas.map((turma) => (
            <Card key={turma.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{turma.nome}</CardTitle>
                    <CardDescription>
                      {turma.serie} - {turma.turno}
                    </CardDescription>
                  </div>
                  <Badge variant="default" className="bg-orange-500">
                    {turma.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">{turma.qtdAlunos} alunos</p>
                      <p className="text-xs text-muted-foreground">Matriculados</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-red-500" />
                    <div>
                      <p className="text-sm font-medium">{turma.sala}</p>
                      <p className="text-xs text-muted-foreground">Localização</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-sm">
                    <span className="font-medium">Ano Letivo:</span> {turma.anoLetivo}
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(turma)}>
                    <Edit className="mr-1 h-3 w-3" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(turma)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddTurmaModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} onAdd={handleAddTurma} />
    </div>
  )
}
