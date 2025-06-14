"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Settings, LogOut } from "lucide-react"
import { AuthService } from "@/lib/auth/auth-service"
import { LogoutConfirmation } from "./logout-confirmation"
import { useToast } from "@/hooks/use-toast"

export function UserProfile() {
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const authService = AuthService.getInstance()
  const currentUser = authService.getCurrentUser()

  if (!currentUser) {
    return null
  }

  const handleProfileClick = () => {
    toast({
      title: "Navegando para Perfil",
      description: "Redirecionando para página de perfil...",
    })
    router.push("/perfil")
  }

  const handleSettingsClick = () => {
    toast({
      title: "Navegando para Configurações",
      description: "Redirecionando para configurações do sistema...",
    })
    router.push("/configuracoes")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleLabel = (role: string) => {
    const roleLabels: Record<string, string> = {
      admin: "Administrador",
      diretor: "Diretor",
      coordenador: "Coordenador",
      professor: "Professor",
      secretaria: "Secretária",
    }
    return roleLabels[role] || role
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.nome} />
              <AvatarFallback className="bg-brand-500 text-white">{getInitials(currentUser.nome)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{currentUser.nome}</p>
              <p className="text-xs leading-none text-muted-foreground">{currentUser.email}</p>
              <p className="text-xs leading-none text-muted-foreground">{getRoleLabel(currentUser.role)}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSettingsClick} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowLogoutModal(true)} className="cursor-pointer text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LogoutConfirmation open={showLogoutModal} onOpenChange={setShowLogoutModal} />
    </>
  )
}
