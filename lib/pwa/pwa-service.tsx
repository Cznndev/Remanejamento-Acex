export class PWAService {
  private static instance: PWAService
  private swRegistration: ServiceWorkerRegistration | null = null

  static getInstance(): PWAService {
    if (!PWAService.instance) {
      PWAService.instance = new PWAService()
    }
    return PWAService.instance
  }

  async initialize(): Promise<void> {
    if ("serviceWorker" in navigator) {
      try {
        this.swRegistration = await navigator.serviceWorker.register("/sw.js")
        console.log("✅ Service Worker registrado:", this.swRegistration)

        // Verificar atualizações
        this.swRegistration.addEventListener("updatefound", () => {
          this.handleUpdateFound()
        })
      } catch (error) {
        console.error("❌ Erro ao registrar Service Worker:", error)
      }
    }
  }

  private handleUpdateFound(): void {
    if (!this.swRegistration) return

    const newWorker = this.swRegistration.installing
    if (!newWorker) return

    newWorker.addEventListener("statechange", () => {
      if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
        // Nova versão disponível
        this.showUpdateNotification()
      }
    })
  }

  private showUpdateNotification(): void {
    // Mostrar notificação de atualização disponível
    const updateBanner = document.createElement("div")
    updateBanner.className =
      "fixed top-0 left-0 right-0 bg-blue-600 text-white p-4 z-50 flex justify-between items-center"
    updateBanner.innerHTML = `
      <span>🔄 Nova versão disponível!</span>
      <button id="update-btn" class="bg-white text-blue-600 px-4 py-2 rounded font-medium">
        Atualizar
      </button>
    `

    document.body.appendChild(updateBanner)

    document.getElementById("update-btn")?.addEventListener("click", () => {
      this.updateApp()
      updateBanner.remove()
    })
  }

  private updateApp(): void {
    if (this.swRegistration?.waiting) {
      this.swRegistration.waiting.postMessage({ type: "SKIP_WAITING" })
      window.location.reload()
    }
  }

  async requestNotificationPermission(): Promise<boolean> {
    if (!("Notification" in window)) {
      console.warn("Este navegador não suporta notificações")
      return false
    }

    if (Notification.permission === "granted") {
      return true
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission()
      return permission === "granted"
    }

    return false
  }

  async showNotification(title: string, options: NotificationOptions = {}): Promise<void> {
    if (!(await this.requestNotificationPermission())) {
      console.warn("Permissão de notificação negada")
      return
    }

    if (this.swRegistration) {
      await this.swRegistration.showNotification(title, {
        icon: "/images/colegio-plus-logo.png",
        badge: "/images/colegio-plus-logo.png",
        vibrate: [200, 100, 200],
        ...options,
      })
    } else {
      new Notification(title, options)
    }
  }

  isInstallable(): boolean {
    return "beforeinstallprompt" in window
  }

  async promptInstall(): Promise<boolean> {
    const event = (window as any).deferredPrompt
    if (!event) return false

    event.prompt()
    const result = await event.userChoice
    return result.outcome === "accepted"
  }
}
