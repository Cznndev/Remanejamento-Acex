"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye, MapPin } from "lucide-react"
import { AddSalaModal } from "@/components/modals/add-sala-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Sala {
  id: number
  nome: string
  capacidade: number
  tipo: string
  recursos: string[]
  status: string
  localizacao: string
  observacoes?: string
}

// Dados iniciais
const salasIniciais: Sala[] = [
  {
    id: 1,
    nome: "Sala 1",
    capacidade: 35,
    tipo: "Sala de Aula",
    recursos: ["Projetor", "Ar-condicionado"],
    status: "Disponível",
    localizacao: "Bloco A - 1º Andar",
  },
  {
    id: 2,
    nome: "Sala 2",
    capacidade: 30,
    tipo: "Sala de Aula",
    recursos: ["Projetor"],
    status: "Disponível",
    localizacao: "Bloco A - 1º Andar",
  },
  {
    id: 3,
    nome: "Laboratório de Informática",
    capacidade: 25,
    tipo: "Laboratório",
    recursos: ["Computadores", "Projetor", "Ar-condicionado"],
    status: "Ocupada",
    localizacao: "Bloco B - 2º Andar",
  },
  {
    id: 4,
    nome: "Laboratório de Ciências",
    capacidade: 30,
    tipo: "Laboratório",
    recursos: ["Equipamentos de Laboratório", "Projetor"],
    status: "Em Manutenção",
    localizacao: "Bloco C - 1º Andar",
  },
  {
    id: 5,
    nome: "Auditório",
    capacidade: 100,
    tipo: "Auditório",
    recursos: ["Sistema de Som", "Projetor", "Ar-condicionado"],
    status: "Disponível",
    localizacao: "Bloco Principal",
  },
]

export default function SalasPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [salas, setSalas] = useState<Sala[]>(salasIniciais)

  const filteredSalas = salas.filter(
    (sala) =>
      sala.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sala.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sala.localizacao.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddSala = (novaSala: Omit<Sala, "id">) => {
    const salaComId: Sala = {
      ...novaSala,
      id: Math.max(...salas.map((s) => s.id), 0) + 1,
    }
    setSalas((prev) => [...prev, salaComId])
  }

  const handleEdit = (sala: Sala) => {
    console.log("Editando sala:", sala.nome)
    alert(`Funcionalidade de edição será implementada para: ${sala.nome}`)
  }

  const handleDelete = (sala: Sala) => {
    if (confirm(`Tem certeza que deseja excluir a sala "${sala.nome}"?`)) {
      setSalas((prev) => prev.filter((s) => s.id !== sala.id))
      alert(`Sala "${sala.nome}" excluída com sucesso!`)
    }
  }

  const handleView = (sala: Sala) => {
    console.log("Visualizando sala:", sala.nome)
    alert(`Visualizando detalhes da sala: ${sala.nome}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Disponível":
        return "bg-green-500"
      case "Ocupada":
        return "bg-red-500"
      case "Em Manutenção":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  // Estatísticas calculadas
  const salasDisponiveis = salas.filter((s) => s.status === "Disponível").length
  const capacidadeTotal = salas.reduce((acc, s) => acc + s.capacidade, 0)
  const salasManutencao = salas.filter((s) => s.status === "Em Manutenção").length

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Salas</h1>
          <p className="text-gray-600 mt-1">Gerencie os espaços físicos da instituição</p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Sala
        </Button>
      </div>

      {/* Estatísticas Dinâmicas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Salas</p>
                <p className="text-2xl font-bold text-gray-900">{salas.length}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Disponíveis</p>
                <p className="text-2xl font-bold text-green-600">{salasDisponiveis}</p>
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
                <p className="text-sm text-gray-600">Capacidade Total</p>
                <p className="text-2xl font-bold text-purple-600">{capacidadeTotal}</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xs font-bold">👥</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Em Manutenção</p>
                <p className="text-2xl font-bold text-orange-600">{salasManutencao}</p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-sm font-bold">🔧</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Salas ({salas.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar salas..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {filteredSalas.length === 0 && searchTerm ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma sala encontrada para "{searchTerm}".</p>
            </div>
          ) : filteredSalas.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma sala cadastrada</h3>
              <p className="text-gray-600 mb-4">Comece adicionando a primeira sala da escola.</p>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Primeira Sala
              </Button>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Capacidade</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Recursos</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSalas.map((sala) => (
                    <TableRow key={sala.id}>
                      <TableCell className="font-medium">{sala.nome}</TableCell>
                      <TableCell>{sala.capacidade} alunos</TableCell>
                      <TableCell>{sala.tipo}</TableCell>
                      <TableCell className="text-sm text-gray-600">{sala.localizacao}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {sala.recursos.slice(0, 2).map((recurso, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {recurso}
                            </Badge>
                          ))}
                          {sala.recursos.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{sala.recursos.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`${getStatusColor(sala.status)} text-white`}>
                          {sala.status}
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
                            <DropdownMenuItem onClick={() => handleView(sala)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(sala)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(sala)} className="text-red-600">
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

      <AddSalaModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} onAdd={handleAddSala} />
    </div>
  )
}
