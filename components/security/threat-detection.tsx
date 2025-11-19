"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  AlertTriangle,
  Activity,
  Eye,
  Zap,
  Globe,
  Server,
  Database,
  Network,
  Lock,
  Fingerprint,
  Brain,
  Target,
  AlertCircle,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Threat {
  id: string
  name: string
  type: "malware" | "phishing" | "ddos" | "bruteforce" | "injection" | "xss" | "csrf" | "insider"
  severity: "low" | "medium" | "high" | "critical"
  status: "detected" | "blocked" | "investigating" | "resolved"
  source: string
  target: string
  timestamp: string
  description: string
  indicators: string[]
  mitigation: string[]
  location?: string
  confidence: number
}

interface ThreatIntelligence {
  globalThreats: number
  newSignatures: number
  blockedIPs: number
  quarantinedFiles: number
  lastUpdate: string
  threatSources: { name: string; count: number; severity: string }[]
}

export function ThreatDetection() {
  const [threats, setThreats] = useState<Threat[]>([])
  const [intelligence, setIntelligence] = useState<ThreatIntelligence>({
    globalThreats: 0,
    newSignatures: 0,
    blockedIPs: 0,
    quarantinedFiles: 0,
    lastUpdate: "",
    threatSources: [],
  })
  const [isScanning, setIsScanning] = useState(false)
  const [realTimeMode, setRealTimeMode] = useState(true)

  // Dados de exemplo
  useEffect(() => {
    const sampleThreats: Threat[] = [
      {
        id: "1",
        name: "Tentativa de Força Bruta SSH",
        type: "bruteforce",
        severity: "high",
        status: "blocked",
        source: "203.0.113.45",
        target: "ssh_server:22",
        timestamp: new Date().toISOString(),
        description: "Múltiplas tentativas de login SSH com credenciais inválidas",
        indicators: ["Múltiplos IPs", "Padrão de tentativas", "Dicionário de senhas"],
        mitigation: ["IP bloqueado", "Rate limiting ativado", "Alertas enviados"],
        location: "Rússia",
        confidence: 95,
      },
      {
        id: "2",
        name: "Injeção SQL Detectada",
        type: "injection",
        severity: "critical",
        status: "blocked",
        source: "192.168.1.50",
        target: "web_app/login",
        timestamp: new Date(Date.now() - 300000).toISOString(),
        description: "Tentativa de injeção SQL no formulário de login",
        indicators: ["Caracteres especiais", "Comandos SQL", "Bypass de autenticação"],
        mitigation: ["Requisição bloqueada", "WAF ativado", "Logs registrados"],
        location: "Interno",
        confidence: 98,
      },
      {
        id: "3",
        name: "Phishing por Email",
        type: "phishing",
        severity: "medium",
        status: "investigating",
        source: "email_gateway",
        target: "usuarios@etwicca.com",
        timestamp: new Date(Date.now() - 600000).toISOString(),
        description: "Email suspeito com links maliciosos detectado",
        indicators: ["Domínio suspeito", "Links encurtados", "Urgência artificial"],
        mitigation: ["Email quarentenado", "Usuários notificados", "Análise em andamento"],
        confidence: 87,
      },
      {
        id: "4",
        name: "Malware em Anexo",
        type: "malware",
        severity: "high",
        status: "resolved",
        source: "email_attachment",
        target: "workstation_05",
        timestamp: new Date(Date.now() - 900000).toISOString(),
        description: "Arquivo executável malicioso detectado em anexo de email",
        indicators: ["Assinatura conhecida", "Comportamento suspeito", "Hash malicioso"],
        mitigation: ["Arquivo removido", "Sistema limpo", "Antivírus atualizado"],
        confidence: 99,
      },
      {
        id: "5",
        name: "Tráfego DDoS",
        type: "ddos",
        severity: "medium",
        status: "detected",
        source: "multiple_ips",
        target: "web_server",
        timestamp: new Date(Date.now() - 1200000).toISOString(),
        description: "Aumento anômalo de tráfego detectado",
        indicators: ["Volume alto", "Múltiplas origens", "Padrão repetitivo"],
        mitigation: ["Rate limiting", "CDN ativado", "Monitoramento intensificado"],
        confidence: 82,
      },
    ]

    const sampleIntelligence: ThreatIntelligence = {
      globalThreats: 1247,
      newSignatures: 23,
      blockedIPs: 156,
      quarantinedFiles: 8,
      lastUpdate: new Date().toISOString(),
      threatSources: [
        { name: "Força Bruta", count: 45, severity: "high" },
        { name: "Phishing", count: 23, severity: "medium" },
        { name: "Malware", count: 18, severity: "critical" },
        { name: "DDoS", count: 12, severity: "medium" },
        { name: "Injeção SQL", count: 8, severity: "critical" },
      ],
    }

    setThreats(sampleThreats)
    setIntelligence(sampleIntelligence)
  }, [])

  // Simulação de tempo real
  useEffect(() => {
    if (!realTimeMode) return

    const interval = setInterval(() => {
      // Simular novas ameaças ocasionalmente
      if (Math.random() < 0.1) {
        const newThreat: Threat = {
          id: Date.now().toString(),
          name: "Nova Ameaça Detectada",
          type: "malware",
          severity: "medium",
          status: "detected",
          source: `192.168.1.${Math.floor(Math.random() * 255)}`,
          target: "sistema",
          timestamp: new Date().toISOString(),
          description: "Atividade suspeita detectada pelo sistema de monitoramento",
          indicators: ["Comportamento anômalo"],
          mitigation: ["Análise em andamento"],
          confidence: Math.floor(Math.random() * 30) + 70,
        }

        setThreats((prev) => [newThreat, ...prev.slice(0, 9)])

        toast({
          title: "Nova Ameaça Detectada",
          description: newThreat.description,
        })
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [realTimeMode])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600 bg-red-100 border-red-200"
      case "high":
        return "text-orange-600 bg-orange-100 border-orange-200"
      case "medium":
        return "text-amber-600 bg-amber-100 border-amber-200"
      case "low":
        return "text-blue-600 bg-blue-100 border-blue-200"
      default:
        return "text-gray-600 bg-gray-100 border-gray-200"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "detected":
        return <Badge className="bg-red-500 hover:bg-red-600">Detectado</Badge>
      case "blocked":
        return <Badge className="bg-orange-500 hover:bg-orange-600">Bloqueado</Badge>
      case "investigating":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Investigando</Badge>
      case "resolved":
        return <Badge className="bg-green-500 hover:bg-green-600">Resolvido</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getThreatIcon = (type: string) => {
    switch (type) {
      case "malware":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "phishing":
        return <Target className="h-4 w-4 text-orange-500" />
      case "ddos":
        return <Zap className="h-4 w-4 text-purple-500" />
      case "bruteforce":
        return <Lock className="h-4 w-4 text-red-500" />
      case "injection":
        return <Database className="h-4 w-4 text-red-500" />
      case "xss":
        return <Globe className="h-4 w-4 text-orange-500" />
      case "csrf":
        return <Shield className="h-4 w-4 text-amber-500" />
      case "insider":
        return <Eye className="h-4 w-4 text-purple-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const runThreatScan = () => {
    setIsScanning(true)
    toast({
      title: "Varredura de Ameaças Iniciada",
      description: "Executando análise completa de ameaças...",
    })

    setTimeout(() => {
      setIsScanning(false)
      setIntelligence((prev) => ({
        ...prev,
        lastUpdate: new Date().toISOString(),
        newSignatures: prev.newSignatures + Math.floor(Math.random() * 5),
        blockedIPs: prev.blockedIPs + Math.floor(Math.random() * 10),
      }))

      toast({
        title: "Varredura Concluída",
        description: "Análise de ameaças finalizada com sucesso.",
      })
    }, 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-600">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-blue-800">Detecção de Ameaças - ET & WICCA</CardTitle>
                <CardDescription>Sistema avançado de detecção e resposta a ameaças</CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={realTimeMode ? "default" : "outline"}
                onClick={() => setRealTimeMode(!realTimeMode)}
                className={realTimeMode ? "bg-green-600 hover:bg-green-700" : ""}
              >
                <Activity className="h-4 w-4 mr-2" />
                {realTimeMode ? "Tempo Real Ativo" : "Tempo Real Inativo"}
              </Button>
              <Button onClick={runThreatScan} disabled={isScanning} className="bg-blue-600 hover:bg-blue-700">
                {isScanning ? (
                  <>
                    <Activity className="h-4 w-4 mr-2 animate-spin" />
                    Escaneando...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Executar Varredura
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Métricas de Threat Intelligence */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                <Globe className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Ameaças Globais</p>
                <p className="text-2xl font-bold text-red-600">{intelligence.globalThreats}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Fingerprint className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Novas Assinaturas</p>
                <p className="text-2xl font-bold text-blue-600">{intelligence.newSignatures}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                <Network className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">IPs Bloqueados</p>
                <p className="text-2xl font-bold text-orange-600">{intelligence.blockedIPs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                <Server className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Arquivos Quarentenados</p>
                <p className="text-2xl font-bold text-amber-600">{intelligence.quarantinedFiles}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="threats" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="threats">Ameaças Ativas</TabsTrigger>
          <TabsTrigger value="intelligence">Threat Intelligence</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="response">Resposta</TabsTrigger>
        </TabsList>

        {/* Ameaças Ativas */}
        <TabsContent value="threats">
          <div className="space-y-4">
            {threats.map((threat) => (
              <Card key={threat.id} className={`border-2 ${getSeverityColor(threat.severity)}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getThreatIcon(threat.type)}
                      <div>
                        <CardTitle className="text-base">{threat.name}</CardTitle>
                        <CardDescription>{threat.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="capitalize">
                        {threat.type}
                      </Badge>
                      {getStatusBadge(threat.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Detalhes da Ameaça</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Origem:</span>
                          <span className="font-mono">{threat.source}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Alvo:</span>
                          <span className="font-mono">{threat.target}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Confiança:</span>
                          <span>{threat.confidence}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Detectado:</span>
                          <span>{new Date(threat.timestamp).toLocaleString()}</span>
                        </div>
                        {threat.location && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Localização:</span>
                            <span>{threat.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2">Indicadores</h4>
                      <div className="space-y-1">
                        {threat.indicators.map((indicator, index) => (
                          <div key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {indicator}
                          </div>
                        ))}
                      </div>
                      <h4 className="font-medium text-sm mb-2 mt-3">Mitigação</h4>
                      <div className="space-y-1">
                        {threat.mitigation.map((action, index) => (
                          <div key={index} className="text-xs bg-green-100 px-2 py-1 rounded">
                            {action}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Nível de Confiança</span>
                      <span>{threat.confidence}%</span>
                    </div>
                    <Progress value={threat.confidence} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Threat Intelligence */}
        <TabsContent value="intelligence">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Fontes de Ameaças</CardTitle>
                <CardDescription>Principais tipos de ameaças detectadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {intelligence.threatSources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${getSeverityColor(source.severity).split(" ")[1]}`} />
                        <span className="text-sm font-medium">{source.name}</span>
                      </div>
                      <Badge variant="outline">{source.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Atualizações de Segurança</CardTitle>
                <CardDescription>Status das atualizações de threat intelligence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Base de Assinaturas</span>
                    <Badge className="bg-green-500 hover:bg-green-600">Atualizada</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Feeds de Inteligência</span>
                    <Badge className="bg-green-500 hover:bg-green-600">Sincronizada</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Regras de Detecção</span>
                    <Badge className="bg-amber-500 hover:bg-amber-600">Pendente</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">IOCs Globais</span>
                    <Badge className="bg-green-500 hover:bg-green-600">Atualizada</Badge>
                  </div>
                  <div className="text-xs text-gray-600 mt-4">
                    Última atualização: {new Date(intelligence.lastUpdate).toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Tendências de Ameaças</CardTitle>
                <CardDescription>Análise temporal das ameaças detectadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {Array.from({ length: 7 }).map((_, i) => {
                    const height = Math.max(20, Math.random() * 100)
                    return (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div
                          className="w-8 bg-gradient-to-t from-red-500 to-red-300 rounded-t"
                          style={{ height: `${height}%` }}
                        />
                        <span className="text-xs text-gray-600">
                          {new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR", {
                            weekday: "short",
                          })}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Distribuição por Severidade</CardTitle>
                <CardDescription>Classificação das ameaças por nível de risco</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <span className="text-sm">Crítico</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={15} className="w-20 h-2" />
                      <span className="text-sm font-medium">15%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-orange-500" />
                      <span className="text-sm">Alto</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={35} className="w-20 h-2" />
                      <span className="text-sm font-medium">35%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-amber-500" />
                      <span className="text-sm">Médio</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={40} className="w-20 h-2" />
                      <span className="text-sm font-medium">40%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-blue-500" />
                      <span className="text-sm">Baixo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={10} className="w-20 h-2" />
                      <span className="text-sm font-medium">10%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Resposta a Incidentes */}
        <TabsContent value="response">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-blue-200 cursor-pointer hover:bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">Isolamento Automático</p>
                    <p className="text-sm text-gray-600">Isolar sistemas comprometidos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 cursor-pointer hover:bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Zap className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">Bloqueio de IP</p>
                    <p className="text-sm text-gray-600">Bloquear IPs maliciosos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 cursor-pointer hover:bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Database className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">Backup de Emergência</p>
                    <p className="text-sm text-gray-600">Criar backup imediato</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 cursor-pointer hover:bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">Alerta de Emergência</p>
                    <p className="text-sm text-gray-600">Notificar equipe de segurança</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 cursor-pointer hover:bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Lock className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">Lockdown do Sistema</p>
                    <p className="text-sm text-gray-600">Bloquear acesso total ao sistema</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 cursor-pointer hover:bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Eye className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">Análise Forense</p>
                    <p className="text-sm text-gray-600">Coletar evidências digitais</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
