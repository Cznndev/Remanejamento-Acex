"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { WorkflowDashboard } from "@/components/workflow/workflow-dashboard"
import { BackupManager } from "@/components/backup/backup-manager"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"

export default function DashboardAvancado() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard Avançado</h1>
        <NotificationCenter />
      </div>

      <Tabs defaultValue="workflows">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="sistema">Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows">
          <WorkflowDashboard />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsDashboard />
        </TabsContent>

        <TabsContent value="backup">
          <BackupManager />
        </TabsContent>

        <TabsContent value="sistema">
          <div className="text-center p-8">
            <h3 className="text-lg font-medium mb-2">Configurações do Sistema</h3>
            <p className="text-muted-foreground">Configurações avançadas do sistema em desenvolvimento</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
