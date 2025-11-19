"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Monitor,
  RefreshCw,
  AlertTriangle,
  Lock,
  UserX,
  FileText,
} from "lucide-react"
import { PasswordPolicyManager } from "./password-policy-manager"
import { EnterpriseMFAManager } from "./enterprise-mfa-manager"

// Definição de tipos para os dados de segurança
interface SecurityMetrics {
  overallScore: number
  threatLevel: string
  activeThreats: number
  blockedAttacks: number
  vulnerabilities: number
  lastScan: string
  uptime: string
  encryptionStatus: boolean
  backupStatus: boolean
  complianceScore: number
}

interface SecurityEvent {
  id: string
  timestamp: string
  type: string
  severity: string
  source?: string
  target?: string
  description: string
  status?: string
  location?: string
  userAgent?: string
}

interface LoginAttempt {
  id: number
  user: string
  timestamp: string
  status: string
  ip: string
  location: string
  device: string
  mfaUsed: boolean
}

interface BlockedIP {
  ip: string
  reason: string
  timestamp: string
  count: number
}

export function LoginSecurityDashboard() {
  const [securityScore, setSecurityScore] = useState(87)
  const [isLoading, setIsLoading] = useState(true)
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([])
  const [blockedIPs, setBlockedIPs] = useState<BlockedIP[]>([])
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])

  // Simular carregamento de dados
  useEffect(() => {
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Substituir os dados simulados por valores realistas
      const sampleMetrics: SecurityMetrics = {
        overallScore: 87,
        threatLevel: "medium",
        activeThreats: 4,
        blockedAttacks: 2847,
        vulnerabilities: 12,
        lastScan: new Date(Date.now() - 7200000).toISOString(), // 2 horas atrás
        uptime: "99.7%",
        encryptionStatus: true,
        backupStatus: true,
        complianceScore: 91,
      }

      const sampleEvents: SecurityEvent[] = [
        {
          id: "1",
          timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 min atrás
          type: "threat_detected",
          severity: "high",
          source: "203.0.113.45",
          target: "api_endpoint",
          description: "Tentativa de SQL injection detectada no endpoint de login",
          status: "resolved",
          location: "Origem Externa - Rússia",
          userAgent: "Mozilla/5.0 (compatible; Baiduspider/2.0)",
        },
        {
          id: "2",
          timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hora atrás
          type: "login_attempt",
          severity: "medium",
          source: "192.168.1.157",
          target: "admin_portal",
          description: "5 tentativas de login falhadas para conta administrativa",
          status: "investigating",
          location: "São Paulo, SP - Brasil",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        {
          id: "3",
          timestamp: new Date(Date.now() - 5400000).toISOString(), // 1.5 horas atrás
          type: "vulnerability",
          severity: "medium",
          source: "security_scanner",
          target: "web_server",
          description: "Versão desatualizada do Apache detectada (CVE-2023-25690)",
          status: "active",
        },
        {
          id: "4",
          timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 horas atrás
          type: "data_access",
          severity: "low",
          source: "192.168.1.89",
          target: "customer_database",
          description: "Acesso a dados de clientes durante horário não comercial",
          status: "resolved",
          location: "São Paulo, SP - Brasil",
        },
        {
          id: "5",
          timestamp: new Date(Date.now() - 10800000).toISOString(), // 3 horas atrás
          type: "config_change",
          severity: "low",
          source: "admin@etwicca.com",
          target: "firewall_rules",
          description: "Atualização de regras de firewall para permitir novo serviço",
          status: "resolved",
        },
      ]

      // Atualizar dados de login
      setLoginAttempts([
        {
          id: 1,
          user: "carlos.silva@etwicca.com",
          timestamp: "2025-06-13T14:22:15",
          status: "success",
          ip: "192.168.1.105",
          location: "São Paulo, SP - Brasil",
          device: "Windows 11 / Chrome 120.0",
          mfaUsed: true,
        },
        {
          id: 2,
          user: "ana.santos@etwicca.com",
          timestamp: "2025-06-13T13:45:33",
          status: "success",
          ip: "192.168.1.120",
          location: "São Paulo, SP - Brasil",
          device: "macOS Sonoma / Safari 17.2",
          mfaUsed: true,
        },
        {
          id: 3,
          user: "desconhecido",
          timestamp: "2025-06-13T12:18:44",
          status: "failed",
          ip: "185.220.101.182",
          location: "Frankfurt, Alemanha",
          device: "Linux / Tor Browser",
          mfaUsed: false,
        },
        {
          id: 4,
          user: "marcos.oliveira@etwicca.com",
          timestamp: "2025-06-13T11:30:22",
          status: "success",
          ip: "192.168.1.110",
          location: "São Paulo, SP - Brasil",
          device: "iPhone 15 / Safari Mobile",
          mfaUsed: true,
        },
        {
          id: 5,
          user: "admin",
          timestamp: "2025-06-13T10:05:17",
          status: "blocked",
          ip: "45.227.135.89",
          location: "Kiev, Ucrânia",
          device: "Android / Chrome Mobile",
          mfaUsed: false,
        },
        {
          id: 6,
          user: "patricia.costa@etwicca.com",
          timestamp: "2025-06-13T09:15:08",
          status: "success",
          ip: "192.168.1.95",
          location: "São Paulo, SP - Brasil",
          device: "Windows 11 / Edge 120.0",
          mfaUsed: true,
        },
      ])

      setBlockedIPs([
        {
          ip: "185.220.101.182",
          reason: "Múltiplas tentativas de força bruta",
          timestamp: "2025-06-13T12:18:44",
          count: 47,
        },
        {
          ip: "45.227.135.89",
          reason: "Tentativa de acesso com credenciais padrão",
          timestamp: "2025-06-13T10:05:17",
          count: 23,
        },
        {
          ip: "103.74.19.104",
          reason: "Scanning de portas detectado",
          timestamp: "2025-06-13T08:22:33",
          count: 156,
        },
        {
          ip: "91.108.23.57",
          reason: "Tentativa de exploração de vulnerabilidade",
          timestamp: "2025-06-12T22:45:12",
          count: 89,
        },
      ])

      setSecurityEvents([
        {
          id: 1,
          type: "policy_change",
          description: "Política de MFA obrigatório ativada para todos os usuários",
          user: "admin@etwicca.com",
          timestamp: "2025-06-13T09:30:15",
        },
        {
          id: 2,
          type: "account_locked",
          description: "Conta bloqueada após 5 tentativas de login falhadas",
          user: "temp.user@etwicca.com",
          timestamp: "2025-06-13T08:45:22",
        },
        {
          id: 3,
          type: "mfa_enabled",
          description: "Autenticação de dois fatores configurada com sucesso",
          user: "joao.pereira@etwicca.com",
          timestamp: "2025-06-12T16:20:45",
        },
        {
          id: 4,
          type: "suspicious_login",
          description: "Login de localização incomum detectado e bloqueado",
          user: "maria.fernandes@etwicca.com",
          timestamp: "2025-06-12T14:15:30",
        },
        {
          id: 5,
          type: "password_reset",
          description: "Senha redefinida após solicitação de recuperação",
          user: "suporte@etwicca.com",
          timestamp: "2025-06-12T11:30:18",
        },
      ])

      setIsLoading(false)
    }

    loadData()
  }, [])

  const getStatusBadge = (status) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-500">Sucesso</Badge>
      case "failed":
        return <Badge className="bg-amber-500">Falha</Badge>
      case "blocked":
        return <Badge className="bg-red-500">Bloqueado</Badge>
      default:
        return <Badge className="bg-gray-500">Desconhecido</Badge>
    }
  }

  const getEventIcon = (type) => {
    switch (type) {
      case "policy_change":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "account_locked":
        return <Lock className="h-5 w-5 text-red-500" />
      case "mfa_enabled":
        return <Shield className="h-5 w-5 text-green-500" />
      case "suspicious_login":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "password_reset":
        return <RefreshCw className="h-5 w-5 text-purple-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-blue-800">Dashboard de Segurança de Login</CardTitle>
                <CardDescription>Monitore e configure a segurança de autenticação do sistema</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-gray-500">Pontuação de Segurança</p>
                <p className="text-2xl font-bold text-blue-600">{securityScore}/100</p>
              </div>
              <div
                className="h-16 w-16 rounded-full border-4 border-blue-600 flex items-center justify-center"
                style={{
                  background: `conic-gradient(#3b82f6 ${securityScore * 3.6}deg, #e5e7eb 0deg)`,
                }}
              >
                <div className="h-12 w-12 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-lg font-bold text-blue-600">
                  {securityScore}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-blue-800">Tentativas de Login</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Sucesso</span>
                  </div>
                  <span className="font-medium">{loginAttempts.filter((a) => a.status === "success").length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm">Falha</span>
                  </div>
                  <span className="font-medium">{loginAttempts.filter((a) => a.status === "failed").length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <span className="text-sm">Bloqueado</span>
                  </div>
                  <span className="font-medium">{loginAttempts.filter((a) => a.status === "blocked").length}</span>
                </div>
                <div className="pt-2">
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-700">
                      {blockedIPs.length} endereços IP bloqueados nas últimas 24h
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-blue-800">Status MFA</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Usuários com MFA</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">87%</span>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Usuários sem MFA</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">13%</span>
                    <XCircle className="h-5 w-5 text-red-500" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Admins com MFA</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">100%</span>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </div>
                <div className="pt-2">
                  <Button variant="outline" className="w-full border-blue-200 text-blue-600">
                    Ver Relatório Detalhado
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-blue-800">Recomendações</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Exigir MFA para todos os usuários</p>
                    <p className="text-xs text-gray-500">13% dos usuários ainda não têm MFA ativado</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Aumentar complexidade de senhas</p>
                    <p className="text-xs text-gray-500">Política atual abaixo das recomendações NIST</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Revisar IPs bloqueados</p>
                    <p className="text-xs text-gray-500">4 IPs bloqueados nas últimas 24h</p>
                  </div>
                </div>
                <div className="pt-2">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Aplicar Recomendações</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activity">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="activity" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Atividade Recente</span>
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center gap-1">
            <Lock className="h-4 w-4" />
            <span>Política de Senhas</span>
          </TabsTrigger>
          <TabsTrigger value="mfa" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            <span>Configuração MFA</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-6 pt-6">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Tentativas de Login Recentes</CardTitle>
              <CardDescription>Últimas 5 tentativas de login no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {loginAttempts.map((attempt) => (
                    <div key={attempt.id} className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-center gap-3">
                        {attempt.status === "success" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : attempt.status === "blocked" ? (
                          <UserX className="h-5 w-5 text-red-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-amber-500" />
                        )}
                        <div>
                          <p className="font-medium">{attempt.user}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(attempt.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(attempt.status)}
                          {attempt.mfaUsed && (
                            <Badge variant="outline" className="border-green-200 text-green-700">
                              <Shield className="h-3 w-3 mr-1" />
                              MFA
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{attempt.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Monitor className="h-3 w-3 mr-1" />
                            <span>{attempt.device}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">IPs Bloqueados</CardTitle>
                <CardDescription>Endereços IP bloqueados por atividade suspeita</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {blockedIPs.map((ip, index) => (
                      <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0">
                        <div>
                          <p className="font-medium">{ip.ip}</p>
                          <p className="text-sm text-gray-500">{ip.reason}</p>
                          <p className="text-xs text-gray-500">{new Date(ip.timestamp).toLocaleString()}</p>
                        </div>
                        <Badge className="bg-red-500">{ip.count} tentativas</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Eventos de Segurança</CardTitle>
                <CardDescription>Alterações recentes nas configurações de segurança</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {securityEvents.map((event) => (
                      <div key={event.id} className="flex items-start gap-3 border-b pb-3 last:border-0">
                        {getEventIcon(event.type)}
                        <div>
                          <p className="font-medium">{event.description}</p>
                          <p className="text-sm text-gray-500">Por: {event.user}</p>
                          <p className="text-xs text-gray-500">{new Date(event.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="password" className="pt-6">
          <PasswordPolicyManager />
        </TabsContent>

        <TabsContent value="mfa" className="pt-6">
          <EnterpriseMFAManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
