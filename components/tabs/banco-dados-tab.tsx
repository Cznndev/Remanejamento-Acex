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
import { Database, Edit, Filter, HardDrive, Plus, Search, Trash2 } from "lucide-react"

// Dados de exemplo
const bancoDadosData = [
  {
    id: 1,
    nome: "Banco de Dados Principal",
    tipo: "MySQL",
    servidor: "DB-SERVER-01",
    versao: "8.0.28",
    tamanho: "250 GB",
    status: "Online",
  },
  {
    id: 2,
    nome: "Banco de Dados Backup",
    tipo: "MySQL",
    servidor: "DB-SERVER-02",
    versao: "8.0.28",
    tamanho: "250 GB",
    status: "Online",
  },
  {
    id: 3,
    nome: "Banco de Dados Analytics",
    tipo: "PostgreSQL",
    servidor: "DB-SERVER-03",
    versao: "14.2",
    tamanho: "500 GB",
    status: "Online",
  },
  {
    id: 4,
    nome: "Banco de Dados Desenvolvimento",
    tipo: "MySQL",
    servidor: "DEV-SERVER-01",
    versao: "8.0.28",
    tamanho: "100 GB",
    status: "Online",
  },
  {
    id: 5,
    nome: "Banco de Dados Legado",
    tipo: "Oracle",
    servidor: "LEGACY-SERVER",
    versao: "19c",
    tamanho: "1 TB",
    status: "Manutenção",
  },
  {
    id: 6,
    nome: "Banco de Dados Homologação",
    tipo: "PostgreSQL",
    servidor: "HML-SERVER-01",
    versao: "14.2",
    tamanho: "200 GB",
    status: "Online",
  },
  {
    id: 7,
    nome: "Banco de Dados NoSQL",
    tipo: "MongoDB",
    servidor: "NOSQL-SERVER-01",
    versao: "5.0.6",
    tamanho: "150 GB",
    status: "Online",
  },
  {
    id: 8,
    nome: "Banco de Dados Arquivos",
    tipo: "SQL Server",
    servidor: "FILES-SERVER",
    versao: "2019",
    tamanho: "2 TB",
    status: "Alerta",
  },
]

export function BancoDadosTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [openDialog, setOpenDialog] = useState(false)
  const [detailsDialog, setDetailsDialog] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  // Filtrar dados com base na pesquisa e filtro
  const filteredData = bancoDadosData.filter((item) => {
    const matchesSearch =
      item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.servidor.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "todos" || item.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  // Função para renderizar o badge de status
  const renderStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "online":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Online
          </Badge>
        )
      case "offline":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Offline
          </Badge>
        )
      case "manutenção":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Manutenção
          </Badge>
        )
      case "alerta":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Alerta
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
          <CardTitle>Gerenciamento de Bancos de Dados</CardTitle>
          <CardDescription>Gerencie servidores de banco de dados, instâncias e monitoramento.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por nome, tipo ou servidor..."
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
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="manutenção">Manutenção</SelectItem>
                  <SelectItem value="alerta">Alerta</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Banco de Dados
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Banco de Dados</DialogTitle>
                    <DialogDescription>Preencha os detalhes do novo banco de dados.</DialogDescription>
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
                          <SelectItem value="mysql">MySQL</SelectItem>
                          <SelectItem value="postgresql">PostgreSQL</SelectItem>
                          <SelectItem value="oracle">Oracle</SelectItem>
                          <SelectItem value="sqlserver">SQL Server</SelectItem>
                          <SelectItem value="mongodb">MongoDB</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="servidor" className="text-right">
                        Servidor
                      </Label>
                      <Input id="servidor" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="versao" className="text-right">
                        Versão
                      </Label>
                      <Input id="versao" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="tamanho" className="text-right">
                        Tamanho
                      </Label>
                      <Input id="tamanho" className="col-span-3" />
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
                  <TableHead>Servidor</TableHead>
                  <TableHead>Versão</TableHead>
                  <TableHead>Tamanho</TableHead>
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
                        className="flex items-center gap-2 text-left hover:text-primary transition-colors"
                      >
                        <Database className="h-4 w-4" />
                        {item.nome}
                      </button>
                    </TableCell>
                    <TableCell>{item.tipo}</TableCell>
                    <TableCell>{item.servidor}</TableCell>
                    <TableCell>{item.versao}</TableCell>
                    <TableCell>{item.tamanho}</TableCell>
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
            Mostrando {filteredData.length} de {bancoDadosData.length} itens
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
            <CardTitle className="text-base">Uso de Armazenamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Banco de Dados Principal</span>
                  <span className="text-sm">250 GB / 500 GB</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary w-[50%]" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Banco de Dados Analytics</span>
                  <span className="text-sm">500 GB / 1 TB</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary w-[50%]" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Banco de Dados Legado</span>
                  <span className="text-sm">1 TB / 2 TB</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary w-[50%]" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Banco de Dados Arquivos</span>
                  <span className="text-sm">2 TB / 3 TB</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-amber-500 w-[66%]" />
                </div>
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
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <span className="text-sm">MySQL</span>
                </div>
                <span className="font-medium">38%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-sm">PostgreSQL</span>
                </div>
                <span className="font-medium">25%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <span className="text-sm">Oracle</span>
                </div>
                <span className="font-medium">12%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span className="text-sm">SQL Server</span>
                </div>
                <span className="font-medium">12%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-purple-500" />
                  <span className="text-sm">MongoDB</span>
                </div>
                <span className="font-medium">13%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Últimos Backups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg border p-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <HardDrive className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Banco de Dados Principal</p>
                  <p className="text-xs text-muted-foreground">Hoje, 03:00</p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Sucesso
                </Badge>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <HardDrive className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Banco de Dados Analytics</p>
                  <p className="text-xs text-muted-foreground">Hoje, 02:30</p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Sucesso
                </Badge>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <HardDrive className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Banco de Dados Legado</p>
                  <p className="text-xs text-muted-foreground">Ontem, 23:45</p>
                </div>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  Parcial
                </Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full text-xs">
              Ver histórico completo
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Dialog de Detalhes do Banco de Dados */}
      <Dialog open={detailsDialog} onOpenChange={setDetailsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Detalhes do Banco de Dados
            </DialogTitle>
            <DialogDescription>Configurações e especificações do banco de dados selecionado.</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-6 py-4">
              {/* Informações Básicas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Informações Básicas</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Nome</Label>
                    <p className="text-sm font-medium">{selectedItem.nome}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Tipo</Label>
                    <p className="text-sm">{selectedItem.tipo}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Servidor</Label>
                    <p className="text-sm">{selectedItem.servidor}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                    <div className="mt-1">{renderStatusBadge(selectedItem.status)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Versão</Label>
                    <p className="text-sm">{selectedItem.versao}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Tamanho</Label>
                    <p className="text-sm">{selectedItem.tamanho}</p>
                  </div>
                </div>
              </div>

              {/* Configurações do Servidor */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Configurações do Servidor</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Host</Label>
                    <p className="text-sm font-mono">db-server-01.etwicca.local</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Porta</Label>
                    <p className="text-sm">3306</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Charset</Label>
                    <p className="text-sm">utf8mb4</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Engine</Label>
                    <p className="text-sm">InnoDB</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Max Connections</Label>
                    <p className="text-sm">1000</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Buffer Pool</Label>
                    <p className="text-sm">8 GB</p>
                  </div>
                </div>
              </div>

              {/* Backup e Manutenção */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Backup e Manutenção</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <div>
                      <p className="text-sm font-medium">Backup Completo</p>
                      <p className="text-xs text-muted-foreground">Hoje, 03:00 - 250 GB</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Sucesso
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <div>
                      <p className="text-sm font-medium">Backup Incremental</p>
                      <p className="text-xs text-muted-foreground">Ontem, 23:00 - 15 GB</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Sucesso
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Performance */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Performance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">CPU Usage</Label>
                    <p className="text-sm">15%</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Memory Usage</Label>
                    <p className="text-sm">6.2 GB / 16 GB</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Connections</Label>
                    <p className="text-sm">45 / 1000</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Uptime</Label>
                    <p className="text-sm">30 dias, 5 horas</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsDialog(false)}>
              Fechar
            </Button>
            <Button>Gerenciar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
