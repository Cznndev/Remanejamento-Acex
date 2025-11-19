"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Shield,
  AlertCircle,
  XCircle,
  AlertTriangle,
  FileText,
  RefreshCw,
  Lock,
  Key,
  UserCheck,
  Globe,
  Clock,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function SecurityComplianceDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [complianceData, setComplianceData] = useState({
    overall: 89,
    categories: {
      authentication: 94,
      dataProtection: 87,
      accessControl: 91,
      auditLogging: 85,
      incidentResponse: 78,
    },
    frameworks: {
      iso27001: 91,
      nist: 87,
      pci: 83,
      gdpr: 95,
      lgpd: 97,
    },
    findings: [
      {
        id: 1,
        severity: "high",
        title: "13% dos usuários ainda não têm MFA configurado",
        description: "24 usuários de um total de 180 não possuem autenticação de dois fatores",
        standard: "NIST 800-53",
        control: "IA-2(1)",
        remediation: "Implementar política de MFA obrigatório com prazo de 30 dias para adequação",
      },
      {
        id: 2,
        severity: "medium",
        title: "Política de senha não atende padrão NIST atual",
        description: "Comprimento mínimo configurado para 8 caracteres, recomendado 12+",
        standard: "NIST 800-63B",
        control: "5.1.1.2",
        remediation: "Atualizar política para mínimo de 12 caracteres e verificação contra dicionário",
      },
      {
        id: 3,
        severity: "medium",
        title: "Retenção de logs abaixo do recomendado para PCI DSS",
        description: "Logs de auditoria mantidos por 180 dias, PCI DSS requer 365 dias",
        standard: "PCI DSS",
        control: "10.7",
        remediation: "Aumentar período de retenção para 12 meses e implementar backup seguro",
      },
      {
        id: 4,
        severity: "medium",
        title: "Falta processo automatizado de revisão de acessos",
        description: "Revisões de acesso são feitas manualmente a cada 6 meses",
        standard: "ISO 27001",
        control: "A.9.2.5",
        remediation: "Implementar revisão automatizada trimestral com workflow de aprovação",
      },
      {
        id: 5,
        severity: "low",
        title: "Certificados SSL próximos do vencimento",
        description: "3 certificados SSL vencem nos próximos 30 dias",
        standard: "ISO 27001",
        control: "A.13.2.3",
        remediation: "Configurar renovação automática de certificados e alertas antecipados",
      },
      {
        id: 6,
        severity: "low",
        title: "Falta de treinamento de segurança documentado",
        description: "Não há registro formal de treinamentos de conscientização em segurança",
        standard: "ISO 27001",
        control: "A.7.2.2",
        remediation: "Implementar programa de treinamento anual com certificação obrigatória",
      },
    ],
  })

  useEffect(() => {
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsLoading(false)
    }

    loadData()
  }, [])

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case "high":
        return <Badge className="bg-red-500">Alta</Badge>
      case "medium":
        return <Badge className="bg-amber-500">Média</Badge>
      case "low":
        return <Badge className="bg-blue-500">Baixa</Badge>
      default:
        return <Badge className="bg-gray-500">Informativa</Badge>
    }
  }

  const getScoreColor = (score) => {
    if (score >= 90) return "bg-green-500"
    if (score >= 80) return "bg-blue-500"
    if (score >= 70) return "bg-amber-500"
    return "bg-red-500"
  }

  const runComplianceScan = async () => {
    setIsLoading(true)
    toast({
      title: "Verificação Iniciada",
      description: "A verificação de conformidade está em andamento...",
    })

    await new Promise((resolve) => setTimeout(resolve, 3000))

    toast({
      title: "Verificação Concluída",
      description: "Relatório de conformidade atualizado com sucesso.",
    })

    setIsLoading(false)
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
                <CardTitle className="text-blue-800">Dashboard de Conformidade de Segurança</CardTitle>
                <CardDescription>Monitore a conformidade com padrões de segurança e regulamentações</CardDescription>
              </div>
            </div>
            <Button onClick={runComplianceScan} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  <span>Verificar Conformidade</span>
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-blue-800">Pontuação Geral de Conformidade</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-4xl font-bold text-blue-600">{complianceData.overall}%</p>
                    <p className="text-sm text-gray-500">Pontuação de Conformidade</p>
                  </div>
                  <div
                    className="h-24 w-24 rounded-full border-4 border-blue-600 flex items-center justify-center"
                    style={{
                      background: `conic-gradient(#3b82f6 ${complianceData.overall * 3.6}deg, #e5e7eb 0deg)`,
                    }}
                  >
                    <div className="h-16 w-16 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-xl font-bold text-blue-600">
                      {complianceData.overall}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Autenticação</p>
                      <p className="text-sm font-medium">{complianceData.categories.authentication}%</p>
                    </div>
                    <Progress
                      value={complianceData.categories.authentication}
                      className={getScoreColor(complianceData.categories.authentication)}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Proteção de Dados</p>
                      <p className="text-sm font-medium">{complianceData.categories.dataProtection}%</p>
                    </div>
                    <Progress
                      value={complianceData.categories.dataProtection}
                      className={getScoreColor(complianceData.categories.dataProtection)}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Controle de Acesso</p>
                      <p className="text-sm font-medium">{complianceData.categories.accessControl}%</p>
                    </div>
                    <Progress
                      value={complianceData.categories.accessControl}
                      className={getScoreColor(complianceData.categories.accessControl)}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Logs de Auditoria</p>
                      <p className="text-sm font-medium">{complianceData.categories.auditLogging}%</p>
                    </div>
                    <Progress
                      value={complianceData.categories.auditLogging}
                      className={getScoreColor(complianceData.categories.auditLogging)}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Resposta a Incidentes</p>
                      <p className="text-sm font-medium">{complianceData.categories.incidentResponse}%</p>
                    </div>
                    <Progress
                      value={complianceData.categories.incidentResponse}
                      className={getScoreColor(complianceData.categories.incidentResponse)}
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-blue-800">Conformidade com Frameworks</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center justify-center p-4 border rounded-md">
                    <div className="text-2xl font-bold text-blue-600">{complianceData.frameworks.iso27001}%</div>
                    <p className="text-sm font-medium">ISO 27001</p>
                  </div>

                  <div className="flex flex-col items-center justify-center p-4 border rounded-md">
                    <div className="text-2xl font-bold text-blue-600">{complianceData.frameworks.nist}%</div>
                    <p className="text-sm font-medium">NIST 800-53</p>
                  </div>

                  <div className="flex flex-col items-center justify-center p-4 border rounded-md">
                    <div className="text-2xl font-bold text-blue-600">{complianceData.frameworks.pci}%</div>
                    <p className="text-sm font-medium">PCI DSS</p>
                  </div>

                  <div className="flex flex-col items-center justify-center p-4 border rounded-md">
                    <div className="text-2xl font-bold text-blue-600">{complianceData.frameworks.gdpr}%</div>
                    <p className="text-sm font-medium">GDPR</p>
                  </div>
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-700">
                    A conformidade com LGPD está em {complianceData.frameworks.lgpd}%, acima da média do setor de 82%.
                  </AlertDescription>
                </Alert>

                <Button variant="outline" className="w-full border-blue-200 text-blue-600">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>Exportar Relatório de Conformidade</span>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="findings">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="findings" className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" />
            <span>Achados</span>
          </TabsTrigger>
          <TabsTrigger value="controls" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            <span>Controles</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>Relatórios</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="findings" className="pt-6">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Achados de Conformidade</CardTitle>
              <CardDescription>Problemas identificados que precisam de atenção</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
                </div>
              ) : (
                <div className="space-y-6">
                  {complianceData.findings.map((finding) => (
                    <div key={finding.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {finding.severity === "high" ? (
                            <XCircle className="h-5 w-5 text-red-500 mt-1" />
                          ) : finding.severity === "medium" ? (
                            <AlertTriangle className="h-5 w-5 text-amber-500 mt-1" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-blue-500 mt-1" />
                          )}
                          <div>
                            <p className="font-medium">{finding.title}</p>
                            <p className="text-sm text-gray-500">{finding.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {finding.standard} {finding.control}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">{getSeverityBadge(finding.severity)}</div>
                      </div>
                      <div className="mt-3 ml-8">
                        <p className="text-sm font-medium">Recomendação:</p>
                        <p className="text-sm text-gray-600">{finding.remediation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="controls" className="pt-6">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Controles de Segurança</CardTitle>
              <CardDescription>Status dos controles de segurança implementados</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Lock className="h-5 w-5 text-blue-600" />
                          <p className="font-medium">Autenticação Multifator</p>
                        </div>
                        <Badge className="bg-amber-500">Parcial</Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">78% dos usuários com MFA ativado</p>
                    </div>

                    <div className="border rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Key className="h-5 w-5 text-blue-600" />
                          <p className="font-medium">Política de Senhas</p>
                        </div>
                        <Badge className="bg-amber-500">Parcial</Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Mínimo de 8 caracteres (recomendado: 12)</p>
                    </div>

                    <div className="border rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-5 w-5 text-blue-600" />
                          <p className="font-medium">Revisão de Acessos</p>
                        </div>
                        <Badge className="bg-red-500">Não Implementado</Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Sem processo automatizado de revisão</p>
                    </div>

                    <div className="border rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Globe className="h-5 w-5 text-blue-600" />
                          <p className="font-medium">Acesso Remoto Seguro</p>
                        </div>
                        <Badge className="bg-green-500">Implementado</Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">VPN com autenticação forte configurada</p>
                    </div>

                    <div className="border rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-blue-600" />
                          <p className="font-medium">Retenção de Logs</p>
                        </div>
                        <Badge className="bg-amber-500">Parcial</Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">90 dias (recomendado: 365 dias)</p>
                    </div>

                    <div className="border rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-blue-600" />
                          <p className="font-medium">Proteção de Dados</p>
                        </div>
                        <Badge className="bg-green-500">Implementado</Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Criptografia em trânsito e em repouso</p>
                    </div>
                  </div>

                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-700">
                      12 de 15 controles críticos implementados completamente (80%)
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="pt-6">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Relatórios de Conformidade</CardTitle>
              <CardDescription>Relatórios disponíveis para auditoria e conformidade</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Relatório de Conformidade ISO 27001</p>
                          <p className="text-sm text-gray-500">Última atualização: 10/06/2025</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-blue-200 text-blue-600">
                        Baixar
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Relatório de Conformidade LGPD</p>
                          <p className="text-sm text-gray-500">Última atualização: 05/06/2025</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-blue-200 text-blue-600">
                        Baixar
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Relatório de Controles de Acesso</p>
                          <p className="text-sm text-gray-500">Última atualização: 01/06/2025</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-blue-200 text-blue-600">
                        Baixar
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Relatório de Vulnerabilidades</p>
                          <p className="text-sm text-gray-500">Última atualização: 28/05/2025</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-blue-200 text-blue-600">
                        Baixar
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Relatório de Atividade de Usuários</p>
                          <p className="text-sm text-gray-500">Última atualização: 25/05/2025</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-blue-200 text-blue-600">
                        Baixar
                      </Button>
                    </div>
                  </div>

                  <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    <span>Gerar Novo Relatório</span>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
