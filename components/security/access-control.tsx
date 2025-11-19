"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import {
  Shield,
  Users,
  Lock,
  Clock,
  MapPin,
  Smartphone,
  Fingerprint,
  UserCheck,
  UserX,
  Settings,
  AlertTriangle,
  CheckCircle,
  Plus,
  Edit,
  Trash2,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface AccessRule {
  id: string
  name: string
  type: "ip_whitelist" | "geo_restriction" | "time_based" | "device_based" | "role_based"
  status: "active" | "inactive"
  description: string
  conditions: string[]
  actions: string[]
  priority: number
  createdAt: string
  lastModified: string
}

interface SessionInfo {
  id: string
  userId: string
  userName: string
  ipAddress: string
  location: string
  device: string
  loginTime: string
  lastActivity: string
  status: "active" | "idle" | "expired"
  mfaEnabled: boolean
  riskScore: number
}

interface SecurityPolicy {
  id: string
  name: string
  description: string
  rules: {
    passwordComplexity: boolean
    mfaRequired: boolean
    sessionTimeout: number
    maxLoginAttempts: number
    ipWhitelisting: boolean
    geoRestrictions: boolean
    deviceTrust: boolean
  }
  appliedTo: string[]
  isDefault: boolean
}

export function AccessControl() {
  const [accessRules, setAccessRules] = useState<AccessRule[]>([])
  const [activeSessions, setActiveSessions] = useState<SessionInfo[]>([])
  const [securityPolicies, setSecurityPolicies] = useState<SecurityPolicy[]>([])
  const [selectedRule, setSelectedRule] = useState<AccessRule | null>(null)
  const [isCreateRuleOpen, setIsCreateRuleOpen] = useState(false)
  const [isEditRuleOpen, setIsEditRuleOpen] = useState(false)

  // Dados de exemplo
  useEffect(() => {
    const sampleRules: AccessRule[] = [
      {
        id: "1",
        name: "Whitelist IPs Corporativos",
        type: "ip_whitelist",
        status: "active",
        description: "Permitir acesso apenas de IPs da rede corporativa",
        conditions: ["192.168.1.0/24", "10.0.0.0/8"],
        actions: ["allow_access", "log_activity"],
        priority: 1,
        createdAt: "2024-01-01T09:00:00Z",
        lastModified: "2024-01-15T10:30:00Z",
      },
      {
        id: "2",
        name: "Restrição Geográfica",
        type: "geo_restriction",
        status: "active",
        description: "Bloquear acesso de países de alto risco",
        conditions: ["block_countries: RU, CN, KP"],
        actions: ["deny_access", "alert_admin", "log_attempt"],
        priority: 2,
        createdAt: "2024-01-05T14:20:00Z",
        lastModified: "2024-01-10T16:45:00Z",
      },
      {
        id: "3",
        name: "Horário Comercial",
        type: "time_based",
        status: "active",
        description: "Permitir acesso apenas em horário comercial",
        conditions: ["weekdays: 08:00-18:00", "timezone: America/Sao_Paulo"],
        actions: ["allow_access", "require_justification_after_hours"],
        priority: 3,
        createdAt: "2024-01-03T11:15:00Z",
        lastModified: "2024-01-12T09:30:00Z",
      },
      {
        id: "4",
        name: "Dispositivos Confiáveis",
        type: "device_based",
        status: "active",
        description: "Exigir dispositivos registrados e confiáveis",
        conditions: ["device_registered", "device_encrypted", "antivirus_active"],
        actions: ["allow_access", "monitor_device"],
        priority: 4,
        createdAt: "2024-01-07T13:45:00Z",
        lastModified: "2024-01-14T15:20:00Z",
      },
      {
        id: "5",
        name: "Acesso Administrativo",
        type: "role_based",
        status: "active",
        description: "Controle rigoroso para usuários administrativos",
        conditions: ["role: admin", "mfa_required", "approval_required"],
        actions: ["allow_access", "log_all_actions", "notify_security_team"],
        priority: 5,
        createdAt: "2024-01-02T10:00:00Z",
        lastModified: "2024-01-13T12:15:00Z",
      },
    ]

    const sampleSessions: SessionInfo[] = [
      {
        id: "sess_1",
        userId: "1",
        userName: "Caio Higino",
        ipAddress: "192.168.1.100",
        location: "São Paulo, SP",
        device: "Windows 11 - Chrome",
        loginTime: new Date(Date.now() - 3600000).toISOString(),
        lastActivity: new Date(Date.now() - 300000).toISOString(),
        status: "active",
        mfaEnabled: true,
        riskScore: 15,
      },
      {
        id: "sess_2",
        userId: "2",
        userName: "Guilherme Cardoso",
        ipAddress: "192.168.1.101",
        location: "São Paulo, SP",
        device: "macOS - Safari",
        loginTime: new Date(Date.now() - 7200000).toISOString(),
        lastActivity: new Date(Date.now() - 600000).toISOString(),
        status: "active",
        mfaEnabled: true,
        riskScore: 20,
      },
      {
        id: "sess_3",
        userId: "3",
        userName: "Danilo Peres",
        ipAddress: "192.168.1.102",
        location: "São Paulo, SP",
        device: "Android - Chrome Mobile",
        loginTime: new Date(Date.now() - 1800000).toISOString(),
        lastActivity: new Date(Date.now() - 1200000).toISOString(),
        status: "idle",
        mfaEnabled: false,
        riskScore: 45,
      },
      {
        id: "sess_4",
        userId: "4",
        userName: "Higor Nascimento",
        ipAddress: "203.0.113.45",
        location: "Rio de Janeiro, RJ",
        device: "Windows 10 - Edge",
        loginTime: new Date(Date.now() - 10800000).toISOString(),
        lastActivity: new Date(Date.now() - 3600000).toISOString(),
        status: "idle",
        mfaEnabled: false,
        riskScore: 75,
      },
    ]

    const samplePolicies: SecurityPolicy[] = [
      {
        id: "1",
        name: "Política Padrão",
        description: "Política de segurança padrão para todos os usuários",
        rules: {
          passwordComplexity: true,
          mfaRequired: false,
          sessionTimeout: 480,
          maxLoginAttempts: 5,
          ipWhitelisting: false,
          geoRestrictions: true,
          deviceTrust: false,
        },
        appliedTo: ["all_users"],
        isDefault: true,
      },
      {
        id: "2",
        name: "Política Administrativa",
        description: "Política rigorosa para usuários administrativos",
        rules: {
          passwordComplexity: true,
          mfaRequired: true,
          sessionTimeout: 240,
          maxLoginAttempts: 3,
          ipWhitelisting: true,
          geoRestrictions: true,
          deviceTrust: true,
        },
        appliedTo: ["admin", "ti"],
        isDefault: false,
      },
      {
        id: "3",
        name: "Política de Gestores",
        description: "Política balanceada para gestores",
        rules: {
          passwordComplexity: true,
          mfaRequired: true,
          sessionTimeout: 360,
          maxLoginAttempts: 4,
          ipWhitelisting: false,
          geoRestrictions: true,
          deviceTrust: false,
        },
        appliedTo: ["gestor"],
        isDefault: false,
      },
    ]

    setAccessRules(sampleRules)
    setActiveSessions(sampleSessions)
    setSecurityPolicies(samplePolicies)
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-600">Ativo</Badge>
      case "inactive":
        return <Badge variant="secondary">Inativo</Badge>
      case "idle":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Inativo</Badge>
      case "expired":
        return <Badge variant="destructive">Expirado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getRiskBadge = (score: number) => {
    if (score < 30) return <Badge className="bg-green-500 hover:bg-green-600">Baixo</Badge>
    if (score < 60) return <Badge className="bg-amber-500 hover:bg-amber-600">Médio</Badge>
    if (score < 80) return <Badge className="bg-orange-500 hover:bg-orange-600">Alto</Badge>
    return <Badge className="bg-red-500 hover:bg-red-600">Crítico</Badge>
  }

  const getRuleTypeIcon = (type: string) => {
    switch (type) {
      case "ip_whitelist":
        return <Shield className="h-4 w-4 text-blue-500" />
      case "geo_restriction":
        return <MapPin className="h-4 w-4 text-red-500" />
      case "time_based":
        return <Clock className="h-4 w-4 text-purple-500" />
      case "device_based":
        return <Smartphone className="h-4 w-4 text-green-500" />
      case "role_based":
        return <Users className="h-4 w-4 text-orange-500" />
      default:
        return <Settings className="h-4 w-4 text-gray-500" />
    }
  }

  const terminateSession = (sessionId: string) => {
    setActiveSessions((prev) => prev.filter((session) => session.id !== sessionId))
    toast({
      title: "Sessão Terminada",
      description: "A sessão foi encerrada com sucesso.",
    })
  }

  const toggleRule = (ruleId: string) => {
    setAccessRules((prev) =>
      prev.map((rule) =>
        rule.id === ruleId ? { ...rule, status: rule.status === "active" ? "inactive" : "active" } : rule,
      ),
    )
    toast({
      title: "Regra Atualizada",
      description: "O status da regra foi alterado.",
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
                <Lock className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-blue-800">Controle de Acesso - ET & WICCA</CardTitle>
                <CardDescription>Gerenciamento avançado de permissões e sessões</CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Dialog open={isCreateRuleOpen} onOpenChange={setIsCreateRuleOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Regra
                  </Button>
                </DialogTrigger>
                <CreateRuleDialog onClose={() => setIsCreateRuleOpen(false)} />
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
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Sessões Ativas</p>
                <p className="text-2xl font-bold text-green-600">
                  {activeSessions.filter((s) => s.status === "active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Regras Ativas</p>
                <p className="text-2xl font-bold text-blue-600">
                  {accessRules.filter((r) => r.status === "active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <Fingerprint className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">MFA Habilitado</p>
                <p className="text-2xl font-bold text-purple-600">
                  {activeSessions.filter((s) => s.mfaEnabled).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Alto Risco</p>
                <p className="text-2xl font-bold text-red-600">
                  {activeSessions.filter((s) => s.riskScore >= 60).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="sessions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sessions">Sessões Ativas</TabsTrigger>
          <TabsTrigger value="rules">Regras de Acesso</TabsTrigger>
          <TabsTrigger value="policies">Políticas</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
        </TabsList>

        {/* Sessões Ativas */}
        <TabsContent value="sessions">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Sessões de Usuários Ativas</CardTitle>
              <CardDescription>Monitoramento em tempo real das sessões ativas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Dispositivo</TableHead>
                      <TableHead>Login</TableHead>
                      <TableHead>Última Atividade</TableHead>
                      <TableHead>MFA</TableHead>
                      <TableHead>Risco</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-blue-800">{session.userName}</p>
                            <p className="text-sm text-gray-600 font-mono">{session.ipAddress}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">{session.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Smartphone className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">{session.device}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">{new Date(session.loginTime).toLocaleString()}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{new Date(session.lastActivity).toLocaleString()}</span>
                        </TableCell>
                        <TableCell>
                          {session.mfaEnabled ? (
                            <Badge className="bg-green-500 hover:bg-green-600">
                              <Fingerprint className="h-3 w-3 mr-1" />
                              Ativo
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              <Fingerprint className="h-3 w-3 mr-1" />
                              Inativo
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{getRiskBadge(session.riskScore)}</TableCell>
                        <TableCell>{getStatusBadge(session.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => terminateSession(session.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Regras de Acesso */}
        <TabsContent value="rules">
          <div className="space-y-4">
            {accessRules.map((rule) => (
              <Card key={rule.id} className="border-blue-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getRuleTypeIcon(rule.type)}
                      <div>
                        <CardTitle className="text-base text-blue-800">{rule.name}</CardTitle>
                        <CardDescription>{rule.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {rule.type.replace("_", " ")}
                      </Badge>
                      {getStatusBadge(rule.status)}
                      <Switch checked={rule.status === "active"} onCheckedChange={() => toggleRule(rule.id)} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Condições</h4>
                      <div className="space-y-1">
                        {rule.conditions.map((condition, index) => (
                          <div key={index} className="text-xs bg-blue-50 px-2 py-1 rounded border">
                            {condition}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2">Ações</h4>
                      <div className="space-y-1">
                        {rule.actions.map((action, index) => (
                          <div key={index} className="text-xs bg-green-50 px-2 py-1 rounded border">
                            {action}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t">
                    <div className="text-xs text-gray-600">
                      Prioridade: {rule.priority} | Criado: {new Date(rule.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedRule(rule)
                          setIsEditRuleOpen(true)
                        }}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setAccessRules((prev) => prev.filter((r) => r.id !== rule.id))
                          toast({
                            title: "Regra Removida",
                            description: "A regra foi removida com sucesso.",
                          })
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Políticas de Segurança */}
        <TabsContent value="policies">
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {securityPolicies.map((policy) => (
              <Card key={policy.id} className="border-blue-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-blue-800">{policy.name}</CardTitle>
                    {policy.isDefault && <Badge className="bg-blue-500 hover:bg-blue-600">Padrão</Badge>}
                  </div>
                  <CardDescription>{policy.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Complexidade de Senha</span>
                      {policy.rules.passwordComplexity ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">MFA Obrigatório</span>
                      {policy.rules.mfaRequired ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Timeout de Sessão</span>
                      <span className="text-sm font-medium">{policy.rules.sessionTimeout} min</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Máx. Tentativas de Login</span>
                      <span className="text-sm font-medium">{policy.rules.maxLoginAttempts}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Whitelist de IPs</span>
                      {policy.rules.ipWhitelisting ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Restrições Geográficas</span>
                      {policy.rules.geoRestrictions ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t">
                    <p className="text-xs text-gray-600">Aplicado a: {policy.appliedTo.join(", ")}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Monitoramento */}
        <TabsContent value="monitoring">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Tentativas de Acesso</CardTitle>
                <CardDescription>Monitoramento de tentativas de login nas últimas 24h</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {Array.from({ length: 24 }).map((_, i) => {
                    const height = Math.max(10, Math.random() * 100)
                    const isHigh = height > 70
                    return (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div
                          className={`w-3 rounded-t ${isHigh ? "bg-red-500" : "bg-blue-500"}`}
                          style={{ height: `${height}%` }}
                        />
                        <span className="text-xs text-gray-600">{i.toString().padStart(2, "0")}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Distribuição Geográfica</CardTitle>
                <CardDescription>Origem dos acessos por localização</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                      <span className="text-sm">São Paulo, SP</span>
                    </div>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-blue-500" />
                      <span className="text-sm">Rio de Janeiro, RJ</span>
                    </div>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-amber-500" />
                      <span className="text-sm">Belo Horizonte, MG</span>
                    </div>
                    <span className="text-sm font-medium">5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <span className="text-sm">Outros/Suspeitos</span>
                    </div>
                    <span className="text-sm font-medium">2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog para editar regra */}
      {selectedRule && (
        <Dialog open={isEditRuleOpen} onOpenChange={setIsEditRuleOpen}>
          <EditRuleDialog rule={selectedRule} onClose={() => setIsEditRuleOpen(false)} />
        </Dialog>
      )}
    </div>
  )
}

// Componente para criar nova regra
function CreateRuleDialog({ onClose }: { onClose: () => void }) {
  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="text-blue-800">Nova Regra de Acesso</DialogTitle>
        <DialogDescription>Criar uma nova regra de controle de acesso</DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="rule-name">Nome da Regra</Label>
          <Input id="rule-name" placeholder="Digite o nome da regra" className="border-blue-200" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rule-type">Tipo de Regra</Label>
          <Select>
            <SelectTrigger className="border-blue-200">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ip_whitelist">Whitelist de IPs</SelectItem>
              <SelectItem value="geo_restriction">Restrição Geográfica</SelectItem>
              <SelectItem value="time_based">Baseada em Tempo</SelectItem>
              <SelectItem value="device_based">Baseada em Dispositivo</SelectItem>
              <SelectItem value="role_based">Baseada em Função</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="rule-description">Descrição</Label>
          <Input id="rule-description" placeholder="Descreva a regra" className="border-blue-200" />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={onClose}>
          Criar Regra
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

// Componente para editar regra
function EditRuleDialog({ rule, onClose }: { rule: AccessRule; onClose: () => void }) {
  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="text-blue-800">Editar Regra de Acesso</DialogTitle>
        <DialogDescription>Modificar a regra: {rule.name}</DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="edit-rule-name">Nome da Regra</Label>
          <Input id="edit-rule-name" defaultValue={rule.name} className="border-blue-200" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-rule-description">Descrição</Label>
          <Input id="edit-rule-description" defaultValue={rule.description} className="border-blue-200" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-rule-priority">Prioridade</Label>
          <Input id="edit-rule-priority" type="number" defaultValue={rule.priority} className="border-blue-200" />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={onClose}>
          Salvar Alterações
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
