interface OfflineAction {
  id: string
  type: "create" | "update" | "delete"
  entity: string
  data: any
  timestamp: Date
  retryCount: number
}

export class OfflineService {
  private static instance: OfflineService
  private pendingActions: OfflineAction[] = []
  private isOnline = navigator.onLine
  private syncInProgress = false

  static getInstance(): OfflineService {
    if (!OfflineService.instance) {
      OfflineService.instance = new OfflineService()
    }
    return OfflineService.instance
  }

  constructor() {
    this.initializeOfflineHandling()
    this.loadPendingActions()
  }

  private initializeOfflineHandling(): void {
    window.addEventListener("online", () => {
      this.isOnline = true
      this.syncPendingActions()
    })

    window.addEventListener("offline", () => {
      this.isOnline = false
    })
  }

  private loadPendingActions(): void {
    const stored = localStorage.getItem("offline_actions")
    if (stored) {
      this.pendingActions = JSON.parse(stored).map((action: any) => ({
        ...action,
        timestamp: new Date(action.timestamp),
      }))
    }
  }

  private savePendingActions(): void {
    localStorage.setItem("offline_actions", JSON.stringify(this.pendingActions))
  }

  queueAction(type: OfflineAction["type"], entity: string, data: any): string {
    const action: OfflineAction = {
      id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      entity,
      data,
      timestamp: new Date(),
      retryCount: 0,
    }

    this.pendingActions.push(action)
    this.savePendingActions()

    // Se online, tentar sincronizar imediatamente
    if (this.isOnline) {
      this.syncPendingActions()
    }

    return action.id
  }

  async syncPendingActions(): Promise<void> {
    if (this.syncInProgress || !this.isOnline || this.pendingActions.length === 0) {
      return
    }

    this.syncInProgress = true

    try {
      const actionsToSync = [...this.pendingActions]
      const successfulActions: string[] = []

      for (const action of actionsToSync) {
        try {
          await this.executeAction(action)
          successfulActions.push(action.id)
        } catch (error) {
          console.error("Erro ao sincronizar ação:", action, error)
          action.retryCount++

          // Remover ações que falharam muitas vezes
          if (action.retryCount > 3) {
            successfulActions.push(action.id)
            console.warn("Ação removida após múltiplas tentativas:", action)
          }
        }
      }

      // Remover ações bem-sucedidas
      this.pendingActions = this.pendingActions.filter((action) => !successfulActions.includes(action.id))

      this.savePendingActions()
    } finally {
      this.syncInProgress = false
    }
  }

  private async executeAction(action: OfflineAction): Promise<void> {
    // Simular execução da ação (em produção seria uma chamada real para API)
    console.log("🔄 Sincronizando ação offline:", action)

    // Simular delay de rede
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Simular possível falha
    if (Math.random() < 0.1) {
      // 10% de chance de falha
      throw new Error("Falha na sincronização")
    }
  }

  getPendingActionsCount(): number {
    return this.pendingActions.length
  }

  isOffline(): boolean {
    return !this.isOnline
  }

  getOfflineStatus() {
    return {
      isOnline: this.isOnline,
      pendingActions: this.pendingActions.length,
      syncInProgress: this.syncInProgress,
      lastSync: this.getLastSyncTime(),
    }
  }

  private getLastSyncTime(): Date | null {
    const lastSync = localStorage.getItem("last_sync")
    return lastSync ? new Date(lastSync) : null
  }

  private setLastSyncTime(): void {
    localStorage.setItem("last_sync", new Date().toISOString())
  }
}
