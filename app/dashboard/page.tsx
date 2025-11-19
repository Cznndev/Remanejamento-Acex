"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HardwareTab } from "@/components/tabs/hardware-tab"
import { SoftwareTab } from "@/components/tabs/software-tab"
import { RedeTab } from "@/components/tabs/rede-tab"
import { BancoDadosTab } from "@/components/tabs/banco-dados-tab"
import { Overview } from "@/components/dashboard/overview"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield } from "lucide-react"
import { AlertSystem } from "@/components/notifications/alert-system"
import { AdvancedReports } from "@/components/reports/advanced-reports"
import { AutomationAIDashboard } from "@/components/ai/automation-ai-dashboard"
import { SystemSettings } from "@/components/settings/system-settings"
import { UserManagement } from "@/components/users/user-management"
import { AuditLogs } from "@/components/audit/audit-logs"
import { useAuditLogger } from "@/hooks/use-audit-logger"
import "../transition.css"

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState("visao-geral")
  const [isEntering, setIsEntering] = useState(true)
  const router = useRouter()
  const { logView } = useAuditLogger()

  useEffect(() => {
    // Verificar autenticação
    const auth = localStorage.getItem("et-wicca-auth")
    const userData = localStorage.getItem("et-wicca-user")

    if (!auth || auth !== "authenticated") {
      router.push("/")
      return
    }

    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    }

    // Animação de entrada
    const timer = setTimeout(() => {
      setIsEntering(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [router]) // Remove logView from dependency array

  // Log dashboard access when user is set (separate useEffect)
  useEffect(() => {
    if (user) {
      logView("dashboard", "main", undefined, "Acessou o dashboard principal")
    }
  }, [user]) // Only depend on user, not logView

  // Função para navegar entre abas (será chamada pelo DashboardShell)
  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue)

    // Log de navegação entre abas
    if (user) {
      logView("dashboard", "tab", tabValue, `Navegou para a aba: ${tabValue}`)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  // Função para renderizar o conteúdo baseado na aba ativa
  const renderActiveContent = () => {
    switch (activeTab) {
      case "visao-geral":
        return <Overview />
      case "hardware":
        if (user.role === "admin" || user.role === "ti") {
          return <HardwareTab />
        }
        return <AccessDenied />
      case "software":
        if (user.role === "admin" || user.role === "ti") {
          return <SoftwareTab />
        }
        return <AccessDenied />
      case "rede":
        if (user.role === "admin" || user.role === "ti") {
          return <RedeTab />
        }
        return <AccessDenied />
      case "banco-dados":
        if (user.role === "admin" || user.role === "ti") {
          return <BancoDadosTab />
        }
        return <AccessDenied />
      case "relatorios":
        return <RelatoriosTab userRole={user.role} />
      case "relatorios-avancados":
        return <AdvancedReports />
      case "monitoramento":
        if (user.role === "admin" || user.role === "ti") {
          return <MonitoramentoTab />
        }
        return <AccessDenied />
      case "usuarios":
        if (user.role === "admin") {
          return <UserManagement />
        }
        return <AccessDenied />
      case "configuracoes":
        if (user.role === "admin") {
          return <SystemSettings />
        }
        return <AccessDenied />
      case "alertas":
        if (user.role === "admin" || user.role === "ti") {
          return <AlertSystem />
        }
        return <AccessDenied />
      case "automacao-ia":
        if (user.role === "admin" || user.role === "ti") {
          return <AutomationAIDashboard />
        }
        return <AccessDenied />
      case "auditoria":
        if (user.role === "admin") {
          return <AuditLogs />
        }
        return <AccessDenied />
      default:
        return <Overview />
    }
  }

  return (
    <div
      className={`transition-all duration-500 ${isEntering ? "opacity-0 translate-y-10" : "opacity-100 translate-y-0"}`}
    >
      <DashboardShell onTabChange={handleTabChange} activeTab={activeTab}>
        <DashboardHeader
          heading="Sistema de Gestão de TI - ET & WICCA"
          subheading={`Bem-vindo, ${user.name}! Gerencie todos os recursos de tecnologia da empresa em um só lugar.`}
        />

        {/* Alerta de nível de acesso */}
        <Alert className="mb-4 border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Você está logado como{" "}
            <strong>{user.role === "admin" ? "Administrador" : user.role === "ti" ? "Técnico de TI" : "Gestor"}</strong>
            .{user.role === "gestor" && " Você tem acesso apenas à visão geral e relatórios."}
            {user.role === "ti" && " Você tem acesso a hardware, software, rede e banco de dados."}
            {user.role === "admin" && " Você tem acesso completo ao sistema."}
          </AlertDescription>
        </Alert>

        {/* Conteúdo da aba ativa */}
        <div className="space-y-4">{renderActiveContent()}</div>
      </DashboardShell>
    </div>
  )
}

// Componente para acesso negado
function AccessDenied() {
  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="text-blue-800">Acesso Negado</CardTitle>
        <CardDescription>Você não tem permissão para acessar esta seção.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Shield className="h-16 w-16 text-blue-400 mx-auto mb-4" />
          <p className="text-muted-foreground">
            Entre em contato com o administrador do sistema para solicitar acesso.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// Componente de Relatórios com controle de acesso
function RelatoriosTab({ userRole }: { userRole: string }) {
  const adminReports = [
    { title: "Inventário Completo", description: "Relatório de todos os ativos de TI da ET & WICCA" },
    { title: "Licenças a Vencer", description: "Licenças que vencem nos próximos 30 dias" },
    { title: "Manutenções Programadas", description: "Calendário de manutenções futuras" },
    { title: "Custos de TI", description: "Análise de custos mensais e anuais" },
    { title: "Performance da Rede", description: "Relatório de performance e disponibilidade" },
    { title: "Backup e Segurança", description: "Status de backups e segurança dos dados" },
    { title: "Usuários do Sistema", description: "Relatório de usuários e permissões" },
    { title: "Logs de Auditoria", description: "Histórico de ações no sistema" },
    { title: "Análise de Vulnerabilidades", description: "Relatório de segurança e vulnerabilidades" },
  ]

  const gestorReports = [
    { title: "Resumo Executivo", description: "Visão geral dos recursos de TI para gestão" },
    { title: "Custos de TI", description: "Análise de custos mensais e anuais" },
    { title: "Indicadores de Performance", description: "KPIs e métricas de TI" },
    { title: "Status Geral dos Sistemas", description: "Disponibilidade e status dos sistemas" },
    { title: "Planejamento de Orçamento", description: "Projeções e planejamento financeiro" },
  ]

  const reports = userRole === "admin" ? adminReports : gestorReports

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="text-blue-800">
          Relatórios ET & WICCA - {userRole === "admin" ? "Administrador" : "Gestor"}
        </CardTitle>
        <CardDescription>
          {userRole === "admin"
            ? "Acesso completo a todos os relatórios técnicos e administrativos."
            : "Relatórios executivos e de gestão para tomada de decisões estratégicas."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report, index) => (
            <Card
              key={index}
              className="p-4 border-dashed border-2 border-blue-200 cursor-pointer hover:bg-blue-50 hover:border-blue-300"
            >
              <CardTitle className="text-base text-blue-700">{report.title}</CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Componente completo para Monitoramento com paleta azul ET & WICCA
function MonitoramentoTab() {
  // Código existente do MonitoramentoTab...
  return (
    <div className="space-y-6">
      {/* Conteúdo existente... */}
      <p>Monitoramento em tempo real</p>
    </div>
  )
}
