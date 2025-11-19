"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Users, UserPlus, Edit, Trash2, Shield, Key, Search, Download, UserCheck, UserX } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: "admin" | "ti" | "gestor" | "usuario"
  department: string
  position: string
  status: "active" | "inactive" | "suspended"
  lastLogin: string
  createdAt: string
  permissions: {
    hardware: { read: boolean; write: boolean; delete: boolean }
    software: { read: boolean; write: boolean; delete: boolean }
    network: { read: boolean; write: boolean; delete: boolean }
    database: { read: boolean; write: boolean; delete: boolean }
    monitoring: { read: boolean; write: boolean; delete: boolean }
    reports: { read: boolean; write: boolean; delete: boolean }
    users: { read: boolean; write: boolean; delete: boolean }
    settings: { read: boolean; write: boolean; delete: boolean }
    alerts: { read: boolean; write: boolean; delete: boolean }
    automation: { read: boolean; write: boolean; delete: boolean }
  }
  twoFactorEnabled: boolean
  passwordLastChanged: string
  loginAttempts: number
  avatar?: string
}

interface Role {
  id: string
  name: string
  description: string
  permissions: User["permissions"]
  color: string
}

const defaultRoles: Role[] = [
  {
    id: "admin",
    name: "Administrador",
    description: "Acesso completo ao sistema",
    color: "bg-red-500",
    permissions: {
      hardware: { read: true, write: true, delete: true },
      software: { read: true, write: true, delete: true },
      network: { read: true, write: true, delete: true },
      database: { read: true, write: true, delete: true },
      monitoring: { read: true, write: true, delete: true },
      reports: { read: true, write: true, delete: true },
      users: { read: true, write: true, delete: true },
      settings: { read: true, write: true, delete: true },
      alerts: { read: true, write: true, delete: true },
      automation: { read: true, write: true, delete: true },
    },
  },
  {
    id: "ti",
    name: "Técnico de TI",
    description: "Acesso técnico aos recursos de TI",
    color: "bg-blue-500",
    permissions: {
      hardware: { read: true, write: true, delete: true },
      software: { read: true, write: true, delete: true },
      network: { read: true, write: true, delete: true },
      database: { read: true, write: true, delete: true },
      monitoring: { read: true, write: true, delete: false },
      reports: { read: true, write: true, delete: false },
      users: { read: true, write: false, delete: false },
      settings: { read: true, write: false, delete: false },
      alerts: { read: true, write: true, delete: false },
      automation: { read: true, write: true, delete: false },
    },
  },
  {
    id: "gestor",
    name: "Gestor",
    description: "Acesso a relatórios e visão geral",
    color: "bg-green-500",
    permissions: {
      hardware: { read: true, write: false, delete: false },
      software: { read: true, write: false, delete: false },
      network: { read: true, write: false, delete: false },
      database: { read: true, write: false, delete: false },
      monitoring: { read: true, write: false, delete: false },
      reports: { read: true, write: true, delete: false },
      users: { read: false, write: false, delete: false },
      settings: { read: false, write: false, delete: false },
      alerts: { read: true, write: false, delete: false },
      automation: { read: true, write: false, delete: false },
    },
  },
  {
    id: "usuario",
    name: "Usuário",
    description: "Acesso básico apenas para visualização",
    color: "bg-gray-500",
    permissions: {
      hardware: { read: true, write: false, delete: false },
      software: { read: true, write: false, delete: false },
      network: { read: false, write: false, delete: false },
      database: { read: false, write: false, delete: false },
      monitoring: { read: true, write: false, delete: false },
      reports: { read: true, write: false, delete: false },
      users: { read: false, write: false, delete: false },
      settings: { read: false, write: false, delete: false },
      alerts: { read: false, write: false, delete: false },
      automation: { read: false, write: false, delete: false },
    },
  },
]

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>(defaultRoles)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showPassword, setShowPassword] = useState(false)

  // Dados de exemplo
  useEffect(() => {
    const sampleUsers: User[] = [
      {
        id: "1",
        name: "Caio Higino",
        email: "caio.higino@etwicca.com",
        phone: "(11) 99999-9999",
        role: "admin",
        department: "TI",
        position: "Diretor de TI",
        status: "active",
        lastLogin: "2024-01-15T10:30:00Z",
        createdAt: "2023-06-01T09:00:00Z",
        twoFactorEnabled: true,
        passwordLastChanged: "2024-01-01T00:00:00Z",
        loginAttempts: 0,
        permissions: defaultRoles.find((r) => r.id === "admin")!.permissions,
      },
      {
        id: "2",
        name: "Guilherme Cardoso",
        email: "guilherme.cardoso@etwicca.com",
        phone: "(11) 88888-8888",
        role: "ti",
        department: "TI",
        position: "Analista de Sistemas",
        status: "active",
        lastLogin: "2024-01-15T08:15:00Z",
        createdAt: "2023-08-15T14:30:00Z",
        twoFactorEnabled: true,
        passwordLastChanged: "2023-12-15T00:00:00Z",
        loginAttempts: 0,
        permissions: defaultRoles.find((r) => r.id === "ti")!.permissions,
      },
      {
        id: "3",
        name: "Danilo Peres",
        email: "danilo.peres@etwicca.com",
        phone: "(11) 77777-7777",
        role: "gestor",
        department: "Financeiro",
        position: "Gerente Financeiro",
        status: "active",
        lastLogin: "2024-01-14T16:45:00Z",
        createdAt: "2023-09-01T11:00:00Z",
        twoFactorEnabled: false,
        passwordLastChanged: "2023-11-01T00:00:00Z",
        loginAttempts: 0,
        permissions: defaultRoles.find((r) => r.id === "gestor")!.permissions,
      },
      {
        id: "4",
        name: "Higor Nascimento",
        email: "higor.nascimento@etwicca.com",
        phone: "(11) 66666-6666",
        role: "usuario",
        department: "RH",
        position: "Assistente de RH",
        status: "inactive",
        lastLogin: "2024-01-10T12:00:00Z",
        createdAt: "2023-10-15T13:20:00Z",
        twoFactorEnabled: false,
        passwordLastChanged: "2023-10-15T00:00:00Z",
        loginAttempts: 2,
        permissions: defaultRoles.find((r) => r.id === "usuario")!.permissions,
      },
      {
        id: "5",
        name: "Giovani Santos",
        email: "giovani.santos@etwicca.com",
        phone: "(11) 55555-5555",
        role: "ti",
        department: "TI",
        position: "Técnico de Suporte",
        status: "suspended",
        lastLogin: "2024-01-05T09:30:00Z",
        createdAt: "2023-11-01T10:15:00Z",
        twoFactorEnabled: false,
        passwordLastChanged: "2023-11-01T00:00:00Z",
        loginAttempts: 5,
        permissions: defaultRoles.find((r) => r.id === "ti")!.permissions,
      },
    ]

    setUsers(sampleUsers)
  }, [])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || user.role === filterRole
    const matchesStatus = filterStatus === "all" || user.status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const getStatusBadge = (status: User["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Ativo</Badge>
      case "inactive":
        return <Badge variant="secondary">Inativo</Badge>
      case "suspended":
        return <Badge variant="destructive">Suspenso</Badge>
    }
  }

  const getRoleBadge = (role: User["role"]) => {
    const roleData = roles.find((r) => r.id === role)
    if (!roleData) return <Badge variant="outline">{role}</Badge>

    return <Badge className={`${roleData.color} hover:opacity-80 text-white`}>{roleData.name}</Badge>
  }

  const createUser = (userData: Partial<User>) => {
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name || "",
      email: userData.email || "",
      phone: userData.phone || "",
      role: userData.role || "usuario",
      department: userData.department || "",
      position: userData.position || "",
      status: "active",
      lastLogin: "",
      createdAt: new Date().toISOString(),
      twoFactorEnabled: false,
      passwordLastChanged: new Date().toISOString(),
      loginAttempts: 0,
      permissions: defaultRoles.find((r) => r.id === userData.role)?.permissions || defaultRoles[3].permissions,
    }

    setUsers((prev) => [...prev, newUser])
    setIsCreateDialogOpen(false)

    toast({
      title: "Usuário Criado",
      description: `${newUser.name} foi adicionado ao sistema.`,
    })
  }

  const updateUser = (userId: string, userData: Partial<User>) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              ...userData,
              permissions: userData.role
                ? defaultRoles.find((r) => r.id === userData.role)?.permissions || user.permissions
                : user.permissions,
            }
          : user,
      ),
    )
    setIsEditDialogOpen(false)
    setSelectedUser(null)

    toast({
      title: "Usuário Atualizado",
      description: "As informações do usuário foram atualizadas.",
    })
  }

  const deleteUser = (userId: string) => {
    if (confirm("Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.")) {
      setUsers((prev) => prev.filter((user) => user.id !== userId))

      toast({
        title: "Usuário Excluído",
        description: "O usuário foi removido do sistema.",
      })
    }
  }

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === "active" ? "inactive" : "active",
            }
          : user,
      ),
    )

    toast({
      title: "Status Alterado",
      description: "O status do usuário foi atualizado.",
    })
  }

  const resetPassword = (userId: string) => {
    if (confirm("Tem certeza que deseja resetar a senha deste usuário?")) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? {
                ...user,
                passwordLastChanged: new Date().toISOString(),
                loginAttempts: 0,
              }
            : user,
        ),
      )

      toast({
        title: "Senha Resetada",
        description: "Uma nova senha temporária foi enviada por email.",
      })
    }
  }

  const exportUsers = () => {
    const csvContent = [
      ["Nome", "Email", "Telefone", "Cargo", "Departamento", "Status", "Último Login"].join(","),
      ...filteredUsers.map((user) =>
        [
          user.name,
          user.email,
          user.phone,
          roles.find((r) => r.id === user.role)?.name || user.role,
          user.department,
          user.status,
          user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Nunca",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "usuarios-et-wicca.csv"
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Exportação Concluída",
      description: "Lista de usuários exportada com sucesso.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-blue-800">Gerenciamento de Usuários - ET & WICCA</CardTitle>
                <CardDescription>Gerencie usuários, permissões e acessos do sistema</CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportUsers} className="border-blue-200 text-blue-600">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Novo Usuário
                  </Button>
                </DialogTrigger>
                <CreateUserDialog onCreateUser={createUser} roles={roles} />
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Total de Usuários</p>
                <p className="text-2xl font-bold text-blue-600">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Usuários Ativos</p>
                <p className="text-2xl font-bold text-green-600">{users.filter((u) => u.status === "active").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                <UserX className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Usuários Inativos</p>
                <p className="text-2xl font-bold text-amber-600">{users.filter((u) => u.status !== "active").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">2FA Habilitado</p>
                <p className="text-2xl font-bold text-purple-600">{users.filter((u) => u.twoFactorEnabled).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <Card className="border-blue-200">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-blue-200"
                />
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-40 border-blue-200">
                  <SelectValue placeholder="Filtrar por cargo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os cargos</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40 border-blue-200">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="suspended">Suspenso</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Usuários */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Lista de Usuários</CardTitle>
          <CardDescription>{filteredUsers.length} usuário(s) encontrado(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Último Login</TableHead>
                  <TableHead>2FA</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                          <span className="text-sm font-medium text-blue-600">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-blue-800">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.department}</p>
                        <p className="text-sm text-gray-600">{user.position}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>
                      {user.lastLogin ? (
                        <div>
                          <p className="text-sm">{new Date(user.lastLogin).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-600">{new Date(user.lastLogin).toLocaleTimeString()}</p>
                        </div>
                      ) : (
                        <span className="text-gray-400">Nunca</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.twoFactorEnabled ? (
                        <Badge className="bg-green-500 hover:bg-green-600">
                          <Shield className="h-3 w-3 mr-1" />
                          Ativo
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          <Shield className="h-3 w-3 mr-1" />
                          Inativo
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user)
                            setIsPermissionsDialogOpen(true)
                          }}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user)
                            setIsEditDialogOpen(true)
                          }}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleUserStatus(user.id)}
                          className="text-amber-600 hover:text-amber-700"
                        >
                          {user.status === "active" ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => resetPassword(user.id)}
                          className="text-purple-600 hover:text-purple-700"
                        >
                          <Key className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteUser(user.id)}
                          className="text-red-600 hover:text-red-700"
                        >
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
      </Card>

      {/* Diálogos */}
      {selectedUser && (
        <>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <EditUserDialog user={selectedUser} onUpdateUser={updateUser} roles={roles} />
          </Dialog>

          <Dialog open={isPermissionsDialogOpen} onOpenChange={setIsPermissionsDialogOpen}>
            <PermissionsDialog user={selectedUser} onUpdateUser={updateUser} />
          </Dialog>
        </>
      )}
    </div>
  )
}

// Componente para criar usuário
function CreateUserDialog({ onCreateUser, roles }: { onCreateUser: (user: Partial<User>) => void; roles: Role[] }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "usuario" as User["role"],
    department: "",
    position: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreateUser(formData)
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "usuario",
      department: "",
      position: "",
    })
  }

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="text-blue-800">Novo Usuário</DialogTitle>
        <DialogDescription>Adicione um novo usuário ao sistema ET & WICCA</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome Completo</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="border-blue-200"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            className="border-blue-200"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
            className="border-blue-200"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Cargo</Label>
          <Select
            value={formData.role}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value as User["role"] }))}
          >
            <SelectTrigger className="border-blue-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Departamento</Label>
          <Input
            id="department"
            value={formData.department}
            onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
            className="border-blue-200"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="position">Posição</Label>
          <Input
            id="position"
            value={formData.position}
            onChange={(e) => setFormData((prev) => ({ ...prev, position: e.target.value }))}
            className="border-blue-200"
          />
        </div>
        <DialogFooter>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Criar Usuário
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

// Componente para editar usuário
function EditUserDialog({
  user,
  onUpdateUser,
  roles,
}: { user: User; onUpdateUser: (id: string, user: Partial<User>) => void; roles: Role[] }) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    department: user.department,
    position: user.position,
    twoFactorEnabled: user.twoFactorEnabled,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdateUser(user.id, formData)
  }

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="text-blue-800">Editar Usuário</DialogTitle>
        <DialogDescription>Atualize as informações de {user.name}</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="edit-name">Nome Completo</Label>
          <Input
            id="edit-name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="border-blue-200"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-email">Email</Label>
          <Input
            id="edit-email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            className="border-blue-200"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-phone">Telefone</Label>
          <Input
            id="edit-phone"
            value={formData.phone}
            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
            className="border-blue-200"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-role">Cargo</Label>
          <Select
            value={formData.role}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value as User["role"] }))}
          >
            <SelectTrigger className="border-blue-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-department">Departamento</Label>
          <Input
            id="edit-department"
            value={formData.department}
            onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
            className="border-blue-200"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-position">Posição</Label>
          <Input
            id="edit-position"
            value={formData.position}
            onChange={(e) => setFormData((prev) => ({ ...prev, position: e.target.value }))}
            className="border-blue-200"
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="edit-2fa">Autenticação de Dois Fatores</Label>
          <Switch
            id="edit-2fa"
            checked={formData.twoFactorEnabled}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, twoFactorEnabled: checked }))}
          />
        </div>
        <DialogFooter>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Salvar Alterações
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

// Componente para gerenciar permissões
function PermissionsDialog({
  user,
  onUpdateUser,
}: { user: User; onUpdateUser: (id: string, user: Partial<User>) => void }) {
  const [permissions, setPermissions] = useState(user.permissions)

  const modules = [
    { key: "hardware", name: "Hardware", icon: "💻" },
    { key: "software", name: "Software", icon: "📱" },
    { key: "network", name: "Rede", icon: "🌐" },
    { key: "database", name: "Banco de Dados", icon: "🗄️" },
    { key: "monitoring", name: "Monitoramento", icon: "📊" },
    { key: "reports", name: "Relatórios", icon: "📋" },
    { key: "users", name: "Usuários", icon: "👥" },
    { key: "settings", name: "Configurações", icon: "⚙️" },
    { key: "alerts", name: "Alertas", icon: "🔔" },
    { key: "automation", name: "Automação & IA", icon: "🤖" },
  ]

  const handlePermissionChange = (module: string, action: string, value: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: value,
      },
    }))
  }

  const handleSubmit = () => {
    onUpdateUser(user.id, { permissions })
  }

  return (
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-blue-800">Permissões de {user.name}</DialogTitle>
        <DialogDescription>Configure as permissões específicas para cada módulo do sistema</DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {modules.map((module) => (
          <Card key={module.key} className="border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <span>{module.icon}</span>
                {module.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`${module.key}-read`}
                    checked={permissions[module.key]?.read || false}
                    onCheckedChange={(checked) => handlePermissionChange(module.key, "read", checked as boolean)}
                  />
                  <Label htmlFor={`${module.key}-read`} className="text-sm">
                    Visualizar
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`${module.key}-write`}
                    checked={permissions[module.key]?.write || false}
                    onCheckedChange={(checked) => handlePermissionChange(module.key, "write", checked as boolean)}
                  />
                  <Label htmlFor={`${module.key}-write`} className="text-sm">
                    Editar
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`${module.key}-delete`}
                    checked={permissions[module.key]?.delete || false}
                    onCheckedChange={(checked) => handlePermissionChange(module.key, "delete", checked as boolean)}
                  />
                  <Label htmlFor={`${module.key}-delete`} className="text-sm">
                    Excluir
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <DialogFooter>
        <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
          Salvar Permissões
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
