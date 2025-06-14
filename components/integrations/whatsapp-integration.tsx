"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Send, CheckCircle, Clock, XCircle } from "lucide-react"
import { WhatsAppBusinessService } from "@/lib/integrations/whatsapp-business"
import type { WhatsAppContact, WhatsAppMessage, WhatsAppTemplate } from "@/lib/integrations/whatsapp-business"
import { useToast } from "@/hooks/use-toast"

export function WhatsAppIntegration() {
  const [isConnected, setIsConnected] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [phoneNumberId, setPhoneNumberId] = useState("")
  const [contacts, setContacts] = useState<WhatsAppContact[]>([])
  const [messages, setMessages] = useState<WhatsAppMessage[]>([])
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([])
  const [stats, setStats] = useState<any>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const whatsappService = WhatsAppBusinessService.getInstance()
  const { toast } = useToast()

  useEffect(() => {
    loadStatus()
  }, [])

  const loadStatus = () => {
    const status = whatsappService.getConnectionStatus()
    setIsConnected(status.isConnected)

    if (status.isConnected) {
      setContacts(whatsappService.getContacts())
      setMessages(whatsappService.getMessages())
      setTemplates(whatsappService.getTemplates())
      setStats(whatsappService.getMessageStats())
    }
  }

  const handleConnect = async () => {
    if (!apiKey.trim() || !phoneNumberId.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha a API Key e Phone Number ID",
        variant: "destructive",
      })
      return
    }

    setIsConnecting(true)
    try {
      await whatsappService.connect(apiKey, phoneNumberId)
      loadStatus()
      toast({
        title: "WhatsApp Business conectado!",
        description: "Integração configurada com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro na conexão",
        description: "Não foi possível conectar ao WhatsApp Business",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      await whatsappService.disconnect()
      setIsConnected(false)
      setContacts([])
      setMessages([])
      setStats(null)
      toast({
        title: "Desconectado",
        description: "WhatsApp Business desconectado com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao desconectar",
        variant: "destructive",
      })
    }
  }

  const sendTestMessage = async () => {
    try {
      await whatsappService.sendRemanejamentoNotification({
        professor: "Maria Silva",
        disciplina: "Matemática",
        turma: "9º Ano A",
        data: "2025-01-10",
        horario: "08:00-09:00",
        sala: "Sala 12",
        motivo: "Teste de integração",
        professorSubstituto: "Ana Costa",
      })

      loadStatus()
      toast({
        title: "Mensagem enviada!",
        description: "Notificação de teste enviada via WhatsApp",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem",
        variant: "destructive",
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <Send className="h-4 w-4 text-blue-600" />
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "read":
        return <CheckCircle className="h-4 w-4 text-green-700" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "secondary"
      case "delivered":
        return "default"
      case "read":
        return "default"
      case "failed":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "professor":
        return "default"
      case "coordenador":
        return "secondary"
      case "diretor":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">WhatsApp Business</h2>
          <p className="text-muted-foreground">Notificações automáticas via WhatsApp</p>
        </div>
        {isConnected && (
          <Button onClick={sendTestMessage} variant="outline">
            <Send className="mr-2 h-4 w-4" />
            Enviar Teste
          </Button>
        )}
      </div>

      {/* Status da Conexão */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Status da Conexão
          </CardTitle>
          <CardDescription>Configure sua conta do WhatsApp Business</CardDescription>
        </CardHeader>
        <CardContent>
          {!isConnected ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="Sua API Key do WhatsApp Business"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone-id">Phone Number ID</Label>
                  <Input
                    id="phone-id"
                    placeholder="ID do número de telefone"
                    value={phoneNumberId}
                    onChange={(e) => setPhoneNumberId(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleConnect} disabled={isConnecting} className="w-full">
                {isConnecting ? "Conectando..." : "Conectar WhatsApp Business"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Conectado com sucesso</p>
                    <p className="text-sm text-muted-foreground">Phone ID: {phoneNumberId}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleDisconnect}>
                  Desconectar
                </Button>
              </div>

              {stats && (
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="text-center p-3 border rounded">
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <div className="text-sm text-muted-foreground">Total Enviadas</div>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <div className="text-2xl font-bold text-green-600">{stats.deliveryRate.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Taxa Entrega</div>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <div className="text-2xl font-bold text-blue-600">{stats.readRate.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Taxa Leitura</div>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
                    <div className="text-sm text-muted-foreground">Falhas</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {isConnected && (
        <Tabs defaultValue="messages">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="messages">Mensagens</TabsTrigger>
            <TabsTrigger value="contacts">Contatos</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Mensagens</CardTitle>
                <CardDescription>Últimas mensagens enviadas via WhatsApp</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Para</TableHead>
                      <TableHead>Conteúdo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Enviado em</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.map((message) => (
                      <TableRow key={message.id}>
                        <TableCell>{message.to}</TableCell>
                        <TableCell className="max-w-xs truncate">{message.content}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(message.status)} className="flex items-center gap-1 w-fit">
                            {getStatusIcon(message.status)}
                            {message.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{message.sentAt?.toLocaleString("pt-BR")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <CardTitle>Contatos</CardTitle>
                <CardDescription>Lista de contatos cadastrados</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Função</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((contact, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{contact.name}</TableCell>
                        <TableCell>{contact.phone}</TableCell>
                        <TableCell>
                          <Badge variant={getRoleColor(contact.role)}>{contact.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={contact.active ? "default" : "secondary"}>
                            {contact.active ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <CardTitle>Templates de Mensagem</CardTitle>
                <CardDescription>Templates aprovados para envio automático</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {templates.map((template) => (
                    <div key={template.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{template.name}</h4>
                        <div className="flex gap-2">
                          <Badge variant="outline">{template.category}</Badge>
                          <Badge variant={template.approved ? "default" : "secondary"}>
                            {template.approved ? "Aprovado" : "Pendente"}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground bg-gray-50 p-3 rounded whitespace-pre-line">
                        {template.content}
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Variáveis: {template.variables.join(", ")}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
