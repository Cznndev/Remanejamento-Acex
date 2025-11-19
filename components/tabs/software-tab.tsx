"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Calendar, Edit, FileText, Filter, Plus, Search, Trash2 } from "lucide-react"

// Dados de exemplo
const softwareData = [
  {
    id: 1,
    nome: "Microsoft Office 365",
    tipo: "Produtividade",
    licenca: "Assinatura",
    validade: "31/12/2023",
    usuarios: 50,
    status: "Ativo",
  },
  {
    id: 2,
    nome: "Adobe Creative Cloud",
    tipo: "Design",
    licenca: "Assinatura",
    validade: "15/06/2023",
    usuarios: 10,
    status: "Expirado",
  },
  {
    id: 3,
    nome: "Windows 11 Pro",
    tipo: "Sistema Operacional",
    licenca: "Perpétua",
    validade: "N/A",
    usuarios: 75,
    status: "Ativo",
  },
  {
    id: 4,
    nome: "AutoCAD 2023",
    tipo: "Design",
    licenca: "Anual",
    validade: "22/09/2023",
    usuarios: 5,
    status: "Ativo",
  },
  {
    id: 5,
    nome: "Antivírus Corporativo",
    tipo: "Segurança",
    licenca: "Anual",
    validade: "10/03/2023",
    usuarios: 100,
    status: "A vencer",
  },
  {
    id: 6,
    nome: "SQL Server 2022",
    tipo: "Banco de Dados",
    licenca: "Perpétua",
    validade: "N/A",
    usuarios: 3,
    status: "Ativo",
  },
  {
    id: 7,
    nome: "Slack",
    tipo: "Comunicação",
    licenca: "Assinatura",
    validade: "05/08/2023",
    usuarios: 80,
    status: "Ativo",
  },
  {
    id: 8,
    nome: "Jira",
    tipo: "Gerenciamento",
    licenca: "Assinatura",
    validade: "15/11/2023",
    usuarios: 25,
    status: "Ativo",
  },
]

export function SoftwareTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [openDialog, setOpenDialog] = useState(false)
  const [detailsDialog, setDetailsDialog] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  // Filtrar dados com base na pesquisa e filtro
  const filteredData = softwareData.filter((item) => {
    const matchesSearch =
      item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tipo.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "todos" || item.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  // Função para renderizar o badge de status
  const renderStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "ativo":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Ativo
          </Badge>
        )
      case "expirado":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Expirado
          </Badge>
        )
      case "a vencer":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            A vencer
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Função para abrir detalhes do item
  const handleViewDetails = (item) => {
    setSelectedItem(item)
    setDetailsDialog(true)
  }

  return (
    <>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Gerenciamento de Software</CardTitle>
          <CardDescription>Gerencie licenças de software, aplicativos e sistemas operacionais.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por nome ou tipo..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="expirado">Expirado</SelectItem>
                  <SelectItem value="a vencer">A vencer</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Software
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Software</DialogTitle>
                    <DialogDescription>Preencha os detalhes da nova licença de software.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="nome" className="text-right">
                        Nome
                      </Label>
                      <Input id="nome" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="tipo" className="text-right">
                        Tipo
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="produtividade">Produtividade</SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="sistema">Sistema Operacional</SelectItem>
                          <SelectItem value="seguranca">Segurança</SelectItem>
                          <SelectItem value="banco-dados">Banco de Dados</SelectItem>
                          <SelectItem value="comunicacao">Comunicação</SelectItem>
                          <SelectItem value="gerenciamento">Gerenciamento</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="licenca" className="text-right">
                        Tipo de Licença
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Selecione o tipo de licença" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="assinatura">Assinatura</SelectItem>
                          <SelectItem value="anual">Anual</SelectItem>
                          <SelectItem value="perpetua">Perpétua</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="validade" className="text-right">
                        Data de Validade
                      </Label>
                      <Input id="validade" type="date" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="usuarios" className="text-right">
                        Nº de Usuários
                      </Label>
                      <Input id="usuarios" type="number" className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Salvar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Licença</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Usuários</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <button
                        onClick={() => handleViewDetails(item)}
                        className="text-left hover:text-primary transition-colors"
                      >
                        {item.nome}
                      </button>
                    </TableCell>
                    <TableCell>{item.tipo}</TableCell>
                    <TableCell>{item.licenca}</TableCell>
                    <TableCell>{item.validade}</TableCell>
                    <TableCell>{item.usuarios}</TableCell>
                    <TableCell>{renderStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {filteredData.length} de {softwareData.length} itens
          </div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>
              Anterior
            </Button>
            <Button variant="outline" size="sm">
              Próximo
            </Button>
          </div>
        </CardFooter>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Licenças a Vencer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg border p-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Antivírus Corporativo</p>
                  <p className="text-xs text-muted-foreground">Vence em 10/03/2023</p>
                </div>
                <Button variant="ghost" size="sm">
                  Renovar
                </Button>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Adobe Creative Cloud</p>
                  <p className="text-xs text-muted-foreground">Expirado em 15/06/2023</p>
                </div>
                <Button variant="ghost" size="sm">
                  Renovar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Distribuição por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Produtividade</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">25%</span>
                  <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary w-[25%]" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Design</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">18%</span>
                  <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary w-[18%]" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sistema Operacional</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">22%</span>
                  <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary w-[22%]" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Segurança</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">15%</span>
                  <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary w-[15%]" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Outros</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">20%</span>
                  <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary w-[20%]" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Documentos Importantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg border p-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Política de Licenciamento</p>
                  <p className="text-xs text-muted-foreground">Atualizado em 05/01/2023</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Calendário de Renovações</p>
                  <p className="text-xs text-muted-foreground">Próxima revisão: 15/07/2023</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Contratos de Manutenção</p>
                  <p className="text-xs text-muted-foreground">Atualizado em 22/03/2023</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog de Detalhes do Software */}
      <Dialog open={detailsDialog} onOpenChange={setDetailsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Software</DialogTitle>
            <DialogDescription>Informações completas da licença de software selecionada.</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-6 py-4">
              {/* Informações da Licença */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Informações da Licença</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Nome do Software</Label>
                    <p className="text-sm font-medium">{selectedItem.nome}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Tipo</Label>
                    <p className="text-sm">{selectedItem.tipo}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Tipo de Licença</Label>
                    <p className="text-sm">{selectedItem.licenca}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                    <div className="mt-1">{renderStatusBadge(selectedItem.status)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Data de Validade</Label>
                    <p className="text-sm">{selectedItem.validade}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Número de Usuários</Label>
                    <p className="text-sm">{selectedItem.usuarios} usuários</p>
                  </div>
                </div>
              </div>

              {/* Detalhes Técnicos */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Detalhes Técnicos</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Versão</Label>
                    <p className="text-sm">2023.1.0</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Fornecedor</Label>
                    <p className="text-sm">Microsoft Corporation</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Chave de Produto</Label>
                    <p className="text-sm font-mono">XXXXX-XXXXX-XXXXX-XXXXX</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Suporte Técnico</Label>
                    <p className="text-sm">Até {selectedItem.validade}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Custo Anual</Label>
                    <p className="text-sm">R$ 2.500,00</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Responsável</Label>
                    <p className="text-sm">Departamento de TI</p>
                  </div>
                </div>
              </div>

              {/* Usuários Ativos */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Usuários Ativos</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <div>
                      <p className="text-sm font-medium">João Silva</p>
                      <p className="text-xs text-muted-foreground">joao.silva@etwicca.com</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Ativo
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <div>
                      <p className="text-sm font-medium">Maria Santos</p>
                      <p className="text-xs text-muted-foreground">maria.santos@etwicca.com</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Ativo
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsDialog(false)}>
              Fechar
            </Button>
            <Button>Renovar Licença</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
