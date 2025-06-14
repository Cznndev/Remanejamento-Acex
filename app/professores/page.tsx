"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { AddProfessorModal } from "@/components/modals/add-professor-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Professor {
  id: number
  nome: string
  email: string
  disciplinas: string[]
  cargaHoraria: number
  disponibilidade: string
  status: string
  telefone?: string
  observacoes?: string
}

// Dados iniciais
const professoresIniciais: Professor[] = [
  {
    id: 1,
    nome: "Maria Silva",
    email: "maria.silva@escola.edu",
    disciplinas: ["Matemática", "Física"],
    cargaHoraria: 40,
    disponibilidade: "Manhã/Tarde",
    status: "Ativo",
  },
  {
    id: 2,
    nome: "João Pereira",
    email: "joao.pereira@escola.edu",
    disciplinas: ["História", "Geografia"],
    cargaHoraria: 30,
    disponibilidade: "Tarde",
    status: "Ativo",
  },
  {
    id: 3,
    nome: "Ana Costa",
    email: "ana.costa@escola.edu",
    disciplinas: ["Ciências", "Biologia"],
    cargaHoraria: 40,
    disponibilidade: "Manhã/Tarde",
    status: "Ativo",
  },
  {
    id: 4,
    nome: "Carlos Santos",
    email: "carlos.santos@escola.edu",
    disciplinas: ["Português", "Literatura"],
    cargaHoraria: 20,
    disponibilidade: "Noite",
    status: "Férias",
  },
  {
    id: 5,
    nome: "Fernanda Lima",
    email: "fernanda.lima@escola.edu",
    disciplinas: ["Inglês"],
    cargaHoraria: 20,
    disponibilidade: "Manhã",
    status: "Ativo",
  },
]

export default function ProfessoresPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [professores, setProfessores] = useState<Professor[]>(professoresIniciais)

  const filteredProfessores = professores.filter(
    (professor) =>
      professor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.disciplinas.some((disciplina) => disciplina.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleAddProfessor = (novoProfessor: Omit<Professor, "id">) => {
    const professorComId: Professor = {
      ...novoProfessor,
      id: Math.max(...professores.map((p) => p.id), 0) + 1,
    }
    setProfessores((prev) => [...prev, professorComId])
  }

  const handleEdit = (professor: Professor) => {
    console.log("Editando professor:", professor.nome)
    alert(`Funcionalidade de edição será implementada para: ${professor.nome}`)
  }

  const handleDelete = (professor: Professor) => {
    if (confirm(`Tem certeza que deseja excluir o professor "${professor.nome}"?`)) {
      setProfessores((prev) => prev.filter((p) => p.id !== professor.id))
      alert(`Professor "${professor.nome}" excluído com sucesso!`)
    }
  }

  const handleView = (professor: Professor) => {
    console.log("Visualizando professor:", professor.nome)
    alert(`Visualizando detalhes de: ${professor.nome}`)
  }

  // Estatísticas calculadas
  const professoresAtivos = professores.filter((p) => p.status === "Ativo").length
  const cargaHorariaTotal = professores.reduce((acc, p) => acc + p.cargaHoraria, 0)
  const disciplinasUnicas = new Set(professores.flatMap((p) => p.disciplinas)).size

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Professores</h1>
          <p className="text-gray-600 mt-1">Gerencie o corpo docente da instituição</p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Professor
        </Button>
      </div>

      {/* Estatísticas Dinâmicas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{professores.length}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-bold">{professores.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ativos</p>
                <p className="text-2xl font-bold text-green-600">{professoresAtivos}</p>
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
                <p className="text-sm text-gray-600">Carga Total</p>
                <p className="text-2xl font-bold text-purple-600">{cargaHorariaTotal}h</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xs font-bold">H</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Disciplinas</p>
                <p className="text-2xl font-bold text-orange-600">{disciplinasUnicas}</p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-sm font-bold">D</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Professores ({professores.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar professores..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {filteredProfessores.length === 0 && searchTerm ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum professor encontrado para "{searchTerm}".</p>
            </div>
          ) : filteredProfessores.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-red-500 text-2xl">👨‍🏫</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum professor cadastrado</h3>
              <p className="text-gray-600 mb-4">Comece adicionando o primeiro professor da escola.</p>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Primeiro Professor
              </Button>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Disciplinas</TableHead>
                    <TableHead>Carga Horária</TableHead>
                    <TableHead>Disponibilidade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfessores.map((professor) => (
                    <TableRow key={professor.id}>
                      <TableCell className="font-medium">{professor.nome}</TableCell>
                      <TableCell>{professor.email}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {professor.disciplinas.map((disciplina, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {disciplina}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{professor.cargaHoraria}h</TableCell>
                      <TableCell>{professor.disponibilidade}</TableCell>
                      <TableCell>
                        <Badge
                          variant={professor.status === "Ativo" ? "default" : "secondary"}
                          className={professor.status === "Ativo" ? "bg-green-500" : "bg-yellow-500"}
                        >
                          {professor.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(professor)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(professor)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(professor)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AddProfessorModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} onAdd={handleAddProfessor} />
    </div>
  )
}
