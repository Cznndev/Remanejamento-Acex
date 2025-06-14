"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, CheckCircle, XCircle, RefreshCw, Plus, ExternalLink } from "lucide-react"
import { GoogleCalendarService } from "@/lib/integrations/google-calendar"
import type { CalendarEvent, CalendarIntegration } from "@/lib/integrations/google-calendar"
import { useToast } from "@/hooks/use-toast"

export function GoogleCalendarIntegration() {
  const [integration, setIntegration] = useState<CalendarIntegration>({ isConnected: false, syncEnabled: false })
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [email, setEmail] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isCreatingEvent, setIsCreatingEvent] = useState(false)
  const calendarService = GoogleCalendarService.getInstance()
  const { toast } = useToast()

  useEffect(() => {
    loadIntegrationStatus()
  }, [])

  const loadIntegrationStatus = () => {
    const status = calendarService.getIntegrationStatus()
    setIntegration(status)
    if (status.accountEmail) {
      setEmail(status.accountEmail)
    }
  }

  const handleConnect = async () => {
    if (!email.trim()) {
      toast({
        title: "Email obrigatório",
        description: "Digite seu email do Google para conectar.",
        variant: "destructive",
      })
      return
    }

    setIsConnecting(true)
    try {
      await calendarService.connect(email)
      loadIntegrationStatus()

      toast({
        title: "Google Calendar conectado!",
        description: "Integração configurada com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro na conexão",
        description: "Não foi possível conectar ao Google Calendar.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      await calendarService.disconnect()
      setEvents([])
      loadIntegrationStatus()

      toast({
        title: "Desconectado",
        description: "Google Calendar desconectado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao desconectar.",
        variant: "destructive",
      })
    }
  }

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      const syncedEvents = await calendarService.syncEvents()
      setEvents(syncedEvents)
      loadIntegrationStatus()

      toast({
        title: "Sincronização concluída",
        description: `${syncedEvents.length} eventos sincronizados.`,
      })
    } catch (error) {
      toast({
        title: "Erro na sincronização",
        description: "Não foi possível sincronizar os eventos.",
        variant: "destructive",
      })
    } finally {
      setIsSyncing(false)
    }
  }

  const handleCreateTestEvent = async () => {
    setIsCreatingEvent(true)
    try {
      const eventId = await calendarService.createRemanejamentoEvent({
        professor: "Maria Silva",
        disciplina: "Matemática",
        turma: "9º Ano A",
        data: "2025-01-10",
        horario: "08:00-09:00",
        sala: "Sala 12",
        motivo: "Teste de integração",
      })

      toast({
        title: "Evento criado!",
        description: `Evento de teste criado no Google Calendar (ID: ${eventId})`,
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar o evento.",
        variant: "destructive",
      })
    } finally {
      setIsCreatingEvent(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default"
      case "tentative":
        return "secondary"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmado"
      case "tentative":
        return "Tentativo"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Integração Google Calendar
          </CardTitle>
          <CardDescription>Conecte sua conta do Google para sincronizar eventos e remanejamentos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!integration.isConnected ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="google-email">Email do Google</Label>
                <Input
                  id="google-email"
                  type="email"
                  placeholder="seu.email@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button onClick={handleConnect} disabled={isConnecting} className="w-full">
                {isConnecting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <Calendar className="mr-2 h-4 w-4" />
                    Conectar Google Calendar
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Conectado com sucesso</p>
                    <p className="text-sm text-muted-foreground">{integration.accountEmail}</p>
                    {integration.lastSync && (
                      <p className="text-xs text-muted-foreground">
                        Última sincronização: {integration.lastSync.toLocaleString("pt-BR")}
                      </p>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleDisconnect}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Desconectar
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Sincronização automática</Label>
                  <p className="text-sm text-muted-foreground">Sincronizar eventos automaticamente</p>
                </div>
                <Switch checked={integration.syncEnabled} />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSync} disabled={isSyncing} variant="outline">
                  {isSyncing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Sincronizando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Sincronizar Agora
                    </>
                  )}
                </Button>
                <Button onClick={handleCreateTestEvent} disabled={isCreatingEvent} variant="outline">
                  {isCreatingEvent ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Criar Evento Teste
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {integration.isConnected && events.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Eventos Sincronizados</CardTitle>
            <CardDescription>Eventos do Google Calendar relacionados à escola</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Evento</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Local</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{event.title}</div>
                        {event.description && (
                          <div className="text-sm text-muted-foreground line-clamp-1">{event.description}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{event.start.toLocaleDateString("pt-BR")}</div>
                        <div className="text-muted-foreground">
                          {event.start.toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          -{" "}
                          {event.end.toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{event.location || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(event.status)}>{getStatusLabel(event.status)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
