export interface ThemeConfig {
  id: string
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
    success: string
    warning: string
    error: string
    info: string
  }
  fonts: {
    heading: string
    body: string
    mono: string
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  borderRadius: {
    sm: string
    md: string
    lg: string
    full: string
  }
  shadows: {
    sm: string
    md: string
    lg: string
    xl: string
  }
}

export class AdvancedThemeService {
  private static instance: AdvancedThemeService
  private currentTheme: ThemeConfig
  private customThemes: ThemeConfig[] = []

  static getInstance(): AdvancedThemeService {
    if (!AdvancedThemeService.instance) {
      AdvancedThemeService.instance = new AdvancedThemeService()
    }
    return AdvancedThemeService.instance
  }

  constructor() {
    this.initializeDefaultThemes()
    this.currentTheme = this.getThemeById("default") || this.getDefaultTheme()
    this.loadCustomThemes()
    this.applyTheme(this.currentTheme)
  }

  private initializeDefaultThemes(): void {
    // Tema padrão já está definido no sistema
  }

  private getDefaultTheme(): ThemeConfig {
    return {
      id: "default",
      name: "Colégio Plus",
      colors: {
        primary: "#dc2626",
        secondary: "#ea580c",
        accent: "#0ea5e9",
        background: "#ffffff",
        surface: "#f8fafc",
        text: "#1f2937",
        textSecondary: "#6b7280",
        border: "#e5e7eb",
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        info: "#3b82f6",
      },
      fonts: {
        heading: "Inter, sans-serif",
        body: "Inter, sans-serif",
        mono: "JetBrains Mono, monospace",
      },
      spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
      },
      borderRadius: {
        sm: "0.25rem",
        md: "0.5rem",
        lg: "0.75rem",
        full: "9999px",
      },
      shadows: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
      },
    }
  }

  private loadCustomThemes(): void {
    const stored = localStorage.getItem("custom_themes")
    if (stored) {
      this.customThemes = JSON.parse(stored)
    }
  }

  private saveCustomThemes(): void {
    localStorage.setItem("custom_themes", JSON.stringify(this.customThemes))
  }

  applyTheme(theme: ThemeConfig): void {
    this.currentTheme = theme

    // Aplicar variáveis CSS
    const root = document.documentElement

    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })

    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value)
    })

    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value)
    })

    Object.entries(theme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value)
    })

    // Salvar tema atual
    localStorage.setItem("current_theme", theme.id)
  }

  createCustomTheme(baseTheme: ThemeConfig, customizations: Partial<ThemeConfig>): ThemeConfig {
    const customTheme: ThemeConfig = {
      ...baseTheme,
      ...customizations,
      id: `custom_${Date.now()}`,
      colors: { ...baseTheme.colors, ...customizations.colors },
      fonts: { ...baseTheme.fonts, ...customizations.fonts },
      spacing: { ...baseTheme.spacing, ...customizations.spacing },
      borderRadius: { ...baseTheme.borderRadius, ...customizations.borderRadius },
      shadows: { ...baseTheme.shadows, ...customizations.shadows },
    }

    this.customThemes.push(customTheme)
    this.saveCustomThemes()

    return customTheme
  }

  getThemeById(id: string): ThemeConfig | undefined {
    if (id === "default") return this.getDefaultTheme()
    return this.customThemes.find((theme) => theme.id === id)
  }

  getAllThemes(): ThemeConfig[] {
    return [this.getDefaultTheme(), ...this.customThemes]
  }

  getCurrentTheme(): ThemeConfig {
    return this.currentTheme
  }

  deleteCustomTheme(id: string): boolean {
    const index = this.customThemes.findIndex((theme) => theme.id === id)
    if (index === -1) return false

    this.customThemes.splice(index, 1)
    this.saveCustomThemes()

    // Se o tema deletado era o atual, voltar para o padrão
    if (this.currentTheme.id === id) {
      this.applyTheme(this.getDefaultTheme())
    }

    return true
  }

  exportTheme(themeId: string): string | null {
    const theme = this.getThemeById(themeId)
    if (!theme) return null

    return JSON.stringify(theme, null, 2)
  }

  importTheme(themeJson: string): ThemeConfig | null {
    try {
      const theme = JSON.parse(themeJson) as ThemeConfig

      // Validar estrutura do tema
      if (!this.validateTheme(theme)) {
        throw new Error("Tema inválido")
      }

      // Gerar novo ID para evitar conflitos
      theme.id = `imported_${Date.now()}`

      this.customThemes.push(theme)
      this.saveCustomThemes()

      return theme
    } catch (error) {
      console.error("Erro ao importar tema:", error)
      return null
    }
  }

  private validateTheme(theme: any): theme is ThemeConfig {
    return (
      typeof theme === "object" &&
      typeof theme.id === "string" &&
      typeof theme.name === "string" &&
      typeof theme.colors === "object" &&
      typeof theme.fonts === "object" &&
      typeof theme.spacing === "object" &&
      typeof theme.borderRadius === "object" &&
      typeof theme.shadows === "object"
    )
  }
}
