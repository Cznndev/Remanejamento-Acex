"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { AuthService } from "@/lib/auth/auth-service"
import { useToast } from "@/hooks/use-toast"
import { User, Calendar, Clock, Camera, Save, ArrowLeft, Shield, Bell, Eye, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function PerfilPage() {
  const router = useRouter()
  const { toast } = useToast()
  const authService = AuthService.getInstance()
  const currentUser = authService.getCurrentUser()

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    nome: currentUser?.nome || "",
    email: currentUser?.email || "",
    telefone: currentUser?.telefone || "",
    departamento: currentUser?.departamento || "",
    bio: "Profissional dedicado à educação com foco em excelência acadêmica.",
  })

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
  })

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    contactVisible: false,
  })

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Usuário não encontrado</p>
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleLabel = (role: string) => {
    const roleLabels: Record<string, string> = {
      admin: "Administrador",
      diretor: "Diretor",
      coordenador: "Coordenador",
      professor: "Professor",
      secretaria: "Secretária",
    }
    return roleLabels[role] || role
  }

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: "bg-red-100 text-red-800",
      diretor: "bg-purple-100 text-purple-800",
      coordenador: "bg-blue-100 text-blue-800",
      professor: "bg-green-100 text-green-800",
      secretaria: "bg-yellow-100 text-yellow-800",
    }
    return colors[role] || "bg-gray-100 text-gray-800"
  }

  const handleSave = () => {
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso.",
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      nome: currentUser?.nome || "",
      email: currentUser?.email || "",
      telefone: currentUser?.telefone || "",
      departamento: currentUser?.departamento || "",
      bio: "Profissional dedicado à educação com foco em excelência acadêmica.",
    })
    setIsEditing(false)
  }

  const handleAvatarUpload = () => {
    toast({
      title: "Upload de foto",
      description: "Funcionalidade de upload será implementada em breve.",
    })
  }

  const handleDeleteAccount = () => {
    toast({
      title: "Exclusão de conta",
      description: "Esta ação requer confirmação adicional.",
      variant: "destructive",
    })
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Meu Perfil</h1>
            <p className="text-muted-foreground">Gerencie suas informações pessoais e configurações</p>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Editar Perfil</Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Suas informações básicas e de contato</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.nome} />
                    <AvatarFallback className="bg-brand-500 text-white text-lg">
                      {getInitials(currentUser.nome)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                      onClick={handleAvatarUpload}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold">{currentUser.nome}</h3>
                    <Badge className={getRoleBadgeColor(currentUser.role)}>{getRoleLabel(currentUser.role)}</Badge>
                  </div>
                  <p className="text-muted-foreground">{currentUser.email}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departamento">Departamento</Label>
                  <Input
                    id="departamento"
                    value={formData.departamento}
                    onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Configurações de Notificação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificações
              </CardTitle>
              <CardDescription>Configure como você deseja receber notificações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificações por Email</p>
                  <p className="text-sm text-muted-foreground">Receba atualizações importantes por email</p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificações Push</p>
                  <p className="text-sm text-muted-foreground">Receba notificações no navegador</p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificações por SMS</p>
                  <p className="text-sm text-muted-foreground">Receba alertas urgentes por SMS</p>
                </div>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Configurações de Privacidade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Privacidade
              </CardTitle>
              <CardDescription>Controle a visibilidade das suas informações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Perfil Visível</p>
                  <p className="text-sm text-muted-foreground">Outros usuários podem ver seu perfil</p>
                </div>
                <Switch
                  checked={privacy.profileVisible}
                  onCheckedChange={(checked) => setPrivacy({ ...privacy, profileVisible: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Contato Visível</p>
                  <p className="text-sm text-muted-foreground">Mostrar informações de contato para outros</p>
                </div>
                <Switch
                  checked={privacy.contactVisible}
                  onCheckedChange={(checked) => setPrivacy({ ...privacy, contactVisible: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Estatísticas */}
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Membro desde</p>
                  <p className="text-sm text-muted-foreground">{currentUser.criadoEm.toLocaleDateString("pt-BR")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Último acesso</p>
                  <p className="text-sm text-muted-foreground">
                    {currentUser.ultimoLogin?.toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Nível de acesso</p>
                  <p className="text-sm text-muted-foreground">{getRoleLabel(currentUser.role)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ações da Conta */}
          <Card>
            <CardHeader>
              <CardTitle>Ações da Conta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Alterar Senha
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Exportar Dados
              </Button>
              <Separator />
              <Button variant="destructive" className="w-full justify-start" onClick={handleDeleteAccount}>
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir Conta
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
