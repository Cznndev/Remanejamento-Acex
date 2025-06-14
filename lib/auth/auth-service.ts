import type { User, UserRole, AuthSession, LoginCredentials } from "./types"

export class AuthService {
  private static instance: AuthService
  private currentSession: AuthSession | null = null
  private users: User[] = []

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  constructor() {
    this.initializeMockUsers()
    this.loadSessionFromStorage()
  }

  private loadSessionFromStorage() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("auth_session")
      if (stored) {
        try {
          const session = JSON.parse(stored) as AuthSession
          session.expiresAt = new Date(session.expiresAt)

          if (session.expiresAt > new Date()) {
            this.currentSession = session
          } else {
            localStorage.removeItem("auth_session")
          }
        } catch (error) {
          localStorage.removeItem("auth_session")
        }
      }
    }
  }

  private initializeMockUsers() {
    this.users = [
      {
        id: "1",
        nome: "Roberto Almeida",
        email: "admin@escola.edu",
        role: "admin",
        avatar: "/placeholder.svg?height=40&width=40",
        departamento: "Administração",
        telefone: "(11) 99999-0001",
        ativo: true,
        criadoEm: new Date("2024-01-01"),
        ultimoLogin: new Date(),
      },
      {
        id: "2",
        nome: "Ana Coordenadora",
        email: "coordenador@escola.edu",
        role: "coordenador",
        avatar: "/placeholder.svg?height=40&width=40",
        departamento: "Coordenação Pedagógica",
        telefone: "(11) 99999-0002",
        ativo: true,
        criadoEm: new Date("2024-01-15"),
        ultimoLogin: new Date(),
      },
      {
        id: "3",
        nome: "Maria Silva",
        email: "maria.silva@escola.edu",
        role: "professor",
        avatar: "/placeholder.svg?height=40&width=40",
        departamento: "Matemática",
        telefone: "(11) 99999-0003",
        ativo: true,
        criadoEm: new Date("2024-02-01"),
        ultimoLogin: new Date(),
      },
      {
        id: "4",
        nome: "Carlos Diretor",
        email: "diretor@escola.edu",
        role: "diretor",
        avatar: "/placeholder.svg?height=40&width=40",
        departamento: "Direção",
        telefone: "(11) 99999-0004",
        ativo: true,
        criadoEm: new Date("2024-01-01"),
        ultimoLogin: new Date(),
      },
      {
        id: "5",
        nome: "Paula Secretaria",
        email: "secretaria@escola.edu",
        role: "secretaria",
        avatar: "/placeholder.svg?height=40&width=40",
        departamento: "Secretaria",
        telefone: "(11) 99999-0005",
        ativo: true,
        criadoEm: new Date("2024-01-10"),
        ultimoLogin: new Date(),
      },
    ]
  }

  async login(credentials: LoginCredentials): Promise<AuthSession> {
    // Simula verificação de credenciais
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = this.users.find((u) => u.email === credentials.email && u.ativo)

    if (!user) {
      throw new Error("Credenciais inválidas")
    }

    // Simula verificação de senha (em produção seria hash)
    const validPasswords: Record<string, string> = {
      "admin@escola.edu": "admin123",
      "coordenador@escola.edu": "coord123",
      "maria.silva@escola.edu": "prof123",
      "diretor@escola.edu": "dir123",
      "secretaria@escola.edu": "sec123",
    }

    if (validPasswords[credentials.email] !== credentials.password) {
      throw new Error("Senha incorreta")
    }

    user.ultimoLogin = new Date()

    const session: AuthSession = {
      user,
      token: Math.random().toString(36).substr(2, 9),
      expiresAt: new Date(Date.now() + (credentials.rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000),
    }

    this.currentSession = session

    // Salva no localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_session", JSON.stringify(session))
    }

    return session
  }

  async logout(): Promise<void> {
    // Simula delay de logout
    await new Promise((resolve) => setTimeout(resolve, 500))

    this.currentSession = null

    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_session")
      // Redireciona para login
      window.location.href = "/login"
    }
  }

  getCurrentUser(): User | null {
    if (this.currentSession && this.currentSession.expiresAt > new Date()) {
      return this.currentSession.user
    }
    return null
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }

  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser()
    if (!user) return false

    const rolePermissions: Record<UserRole, string[]> = {
      admin: ["*"], // Admin tem todas as permissões
      diretor: [
        "view_dashboard",
        "view_reports",
        "manage_users",
        "approve_remanejamentos",
        "view_analytics",
        "manage_backup",
      ],
      coordenador: [
        "view_dashboard",
        "manage_remanejamentos",
        "view_reports",
        "manage_professores",
        "manage_turmas",
        "approve_remanejamentos",
      ],
      professor: ["view_dashboard", "view_own_schedule", "request_remanejamento", "view_notifications"],
      secretaria: [
        "view_dashboard",
        "manage_professores",
        "manage_turmas",
        "manage_disciplinas",
        "manage_salas",
        "view_reports",
      ],
    }

    const userPermissions = rolePermissions[user.role]
    return userPermissions.includes("*") || userPermissions.includes(permission)
  }

  getAllUsers(): User[] {
    return this.users.filter((u) => u.ativo)
  }

  getUsersByRole(role: UserRole): User[] {
    return this.users.filter((u) => u.role === role && u.ativo)
  }
}
