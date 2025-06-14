"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, BookOpen, Clock, Users } from "lucide-react"
import { AddDisciplinaModal } from "@/components/modals/add-disciplina-modal"

interface Disciplina {
  id: number
  nome: string
  codigo: string
  cargaHoraria: number
  professores: string[]
  turmas: string[]
  descricao: string
  status: string
}

const disciplinasMockIniciais: Disciplina[] = [
  {
    id: 1,
    nome: "Matemática",
    codigo: "MAT001",
    cargaHoraria: 5,
    professores: ["Maria Silva", "João Santos"],
    turmas: ["6º Ano A", "7º Ano B", "8º Ano C"],
    descricao: "Disciplina fundamental focada em álgebra, geometria e aritmética",
    status: "Ativa",
  },
  {
    id: 2,
    nome: "Português",
    codigo: "POR001",
    cargaHoraria: 4,
    professores: ["Ana Costa"],
    turmas: ["6º Ano A", "7º Ano B"],
    descricao: "Língua portuguesa, literatura e redação",
    status: "Ativa",
  },
  {
    id: 3,
    nome: "História",
    codigo: "HIS001",
    cargaHoraria: 3,
    professores: ["João Pereira"],
    turmas: ["8º Ano C", "9º Ano A"],
    descricao: "História do Brasil e história geral",
    status: "Ativa",
  },
  {
    id: 4,
    nome: "Educação Física",
    codigo: "EDF001",
    cargaHoraria: 2,
    professores: ["Carlos Lima"],
    turmas: ["6º Ano A", "7º Ano B", "8º Ano C", "9º Ano A"],
    descricao: "Atividades físicas e esportivas",
    status: "Ativa",
  },
]

export default function DisciplinasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>(disciplinasMockIniciais)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const filteredDisciplinas = disciplinas.filter(
    (disciplina) =>
      disciplina.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disciplina.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disciplina.professores.some((p) => p.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleAddDisciplina = () => {
    setIsAddModalOpen(true)
  }

  const handleDisciplinaAdded = (novaDisciplina: Disciplina) => {
    setDisciplinas((prev) => [...prev, novaDisciplina])
  }

  const handleEditDisciplina = (id: number) => {
    const disciplina = disciplinas.find((d) => d.id === id)
    alert(`Editar disciplina: ${disciplina?.nome}`)
  }

  const handleDeleteDisciplina = (id: number) => {
    const disciplina = disciplinas.find((d) => d.id === id)
    if (confirm(`Tem certeza que deseja excluir a disciplina "${disciplina?.nome}"?`)) {
      setDisciplinas((prev) => prev.filter((d) => d.id !== id))
      alert(`Disciplina "${disciplina?.nome}" excluída com sucesso!`)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold brand-text-gradient">Disciplinas</h1>
          <p className="text-muted-foreground">
            Gerencie as disciplinas do currículo escolar ({disciplinas.length} disciplinas)
          </p>
        </div>
        <Button className="bg-brand-red-500 hover:bg-brand-red-600" onClick={handleAddDisciplina}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Disciplina
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar disciplinas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Badge variant="secondary">
          {filteredDisciplinas.length} de {disciplinas.length}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredDisciplinas.map((disciplina) => (
          <Card key={disciplina.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-brand-blue-500" />
                  <div>
                    <CardTitle className="text-lg">{disciplina.nome}</CardTitle>
                    <CardDescription>{disciplina.codigo}</CardDescription>
                  </div>
                </div>
                <Badge className={disciplina.status === "Ativa" ? "bg-brand-red-500" : "bg-gray-500"}>
                  {disciplina.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{disciplina.descricao}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-brand-orange-500" />
                  <div>
                    <p className="text-sm font-medium">{disciplina.cargaHoraria}h</p>
                    <p className="text-xs text-muted-foreground">por semana</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-brand-blue-500" />
                  <div>
                    <p className="text-sm font-medium">{disciplina.turmas.length}</p>
                    <p className="text-xs text-muted-foreground">turmas</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Professores:</p>
                <div className="flex flex-wrap gap-1">
                  {disciplina.professores.map((professor) => (
                    <Badge key={professor} variant="outline" className="text-xs">
                      {professor}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Turmas:</p>
                <div className="flex flex-wrap gap-1">
                  {disciplina.turmas.slice(0, 3).map((turma) => (
                    <Badge key={turma} variant="secondary" className="text-xs">
                      {turma}
                    </Badge>
                  ))}
                  {disciplina.turmas.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{disciplina.turmas.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEditDisciplina(disciplina.id)}
                >
                  <Edit className="mr-1 h-3 w-3" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDeleteDisciplina(disciplina.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDisciplinas.length === 0 && (
        <div className="text-center py-8">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-muted-foreground">
            {searchTerm ? "Nenhuma disciplina encontrada para sua busca." : "Nenhuma disciplina cadastrada."}
          </p>
          {!searchTerm && (
            <Button className="mt-4" onClick={handleAddDisciplina}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar primeira disciplina
            </Button>
          )}
        </div>
      )}

      <AddDisciplinaModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} onAdd={handleDisciplinaAdded} />
    </div>
  )
}
