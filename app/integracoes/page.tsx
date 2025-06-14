"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GoogleCalendarIntegration } from "@/components/integrations/google-calendar-integration"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MessageSquare, Mail, Smartphone } from "lucide-react"
import { WhatsAppIntegration } from "@/components/integrations/whatsapp-integration"

export default function Integracoes() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Integrações</h1>
        <Badge variant="secondary">Fase 1 - Essencial</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Google Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Ativo</div>
            <p className="text-xs text-muted-foreground">Sincronização automática</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              WhatsApp Business
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">Em Breve</div>
            <p className="text-xs text-muted-foreground">Notificações automáticas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email SMTP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Configurado</div>
            <p className="text-xs text-muted-foreground">Emails automáticos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              App Mobile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">Em Breve</div>
            <p className="text-xs text-muted-foreground">iOS e Android</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="calendar">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calendar">Google Calendar</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="mobile">Mobile</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <GoogleCalendarIntegration />
        </TabsContent>

        <TabsContent value="whatsapp">
          <WhatsAppIntegration />
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Configuração de Email
              </CardTitle>
              <CardDescription>Configure o servidor SMTP para envio de emails automáticos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <Mail className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-lg font-medium mb-2">Email Configurado</h3>
                <p className="text-muted-foreground">O sistema de emails está funcionando corretamente.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mobile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Aplicativo Mobile
              </CardTitle>
              <CardDescription>App nativo para iOS e Android com notificações push</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <Smartphone className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Em Desenvolvimento</h3>
                <p className="text-muted-foreground">
                  O aplicativo mobile será lançado em breve com todas as funcionalidades principais.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
