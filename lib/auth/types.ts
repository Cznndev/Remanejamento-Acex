export interface User {
  id: string
  nome: string
  email: string
  role: UserRole
  avatar?: string
  departamento?: string
  telefone?: string
  ativo: boolean
  criadoEm: Date
  ultimoLogin?: Date
}

export type UserRole = "admin" | "coordenador" | "professor" | "secretaria" | "diretor"

export interface Permission {
  id: string
  nome: string
  descricao: string
  modulo: string
}

export interface RolePermissions {
  role: UserRole
  permissions: string[]
}

export interface AuthSession {
  user: User
  token: string
  expiresAt: Date
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}
