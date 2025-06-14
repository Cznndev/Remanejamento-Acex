"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Upload, RefreshCw, Database, FileText, Calendar, Users } from "lucide-react"
import { ButtonActions } from "@/lib/utils/button-actions"

export function QuickActions() {
  const handleQuickAction = async (action: string) => {
    switch (action) {
      case "export":
        await ButtonActions.handleExport("pdf")
        break
      case "import":
        await ButtonActions.handleImport()
        break
      case "sync":
        await ButtonActions.handleSync()
        break
      case "backup":
        await ButtonActions.handleBackup()
        break
      case "report":
        ButtonActions.showInfo("Gerando relatório", "Compilando dados do sistema...")
        break
      case "schedule":
        ButtonActions.showInfo("Abrindo cronograma", "Carregando grade de horários...")
        break
      default:
        ButtonActions.showInfo("Ação executada", `${action} realizada com sucesso`)
    }
  }

  const quickActions = [
    {
      id: "export",
      title: "Exportar Dados",
      description: "Baixar relatórios em PDF",
      icon: Download,
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      id: "import",
      title: "Importar Dados",
      description: "Carregar dados externos",
      icon: Upload,
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      id: "sync",
      title: "Sincronizar",
      description: "Atualizar informações",
      icon: RefreshCw,
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      id: "backup",
      title: "Backup",
      description: "Salvar dados seguros",
      icon: Database,
      color: "bg-orange-500 hover:bg-orange-600",
    },
    {
      id: "report",
      title: "Relatórios",
      description: "Gerar relatórios",
      icon: FileText,
      color: "bg-red-500 hover:bg-red-600",
    },
    {
      id: "schedule",
      title: "Cronograma",
      description: "Ver grade horária",
      icon: Calendar,
      color: "bg-indigo-500 hover:bg-indigo-600",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Ações Rápidas
        </CardTitle>
        <CardDescription>Execute tarefas comuns rapidamente</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.id}
                variant="outline"
                className={`h-auto p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform ${action.color} text-white border-0`}
                onClick={() => handleQuickAction(action.id)}
              >
                <Icon className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs opacity-90">{action.description}</div>
                </div>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
