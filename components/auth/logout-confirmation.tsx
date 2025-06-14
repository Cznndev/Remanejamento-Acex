"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { LogOut, AlertTriangle } from "lucide-react"
import { AuthService } from "@/lib/auth/auth-service"
import { useToast } from "@/hooks/use-toast"

interface LogoutConfirmationProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LogoutConfirmation({ open, onOpenChange }: LogoutConfirmationProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const authService = AuthService.getInstance()
  const { toast } = useToast()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await authService.logout()
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao fazer logout",
        description: "Tente novamente.",
        variant: "destructive",
      })
      setIsLoggingOut(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <DialogTitle>Confirmar Logout</DialogTitle>
              <DialogDescription>Tem certeza que deseja sair do sistema?</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Você será redirecionado para a página de login e precisará inserir suas credenciais novamente para acessar o
            sistema.
          </p>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoggingOut}>
            Cancelar
          </Button>
          <Button onClick={handleLogout} disabled={isLoggingOut} className="bg-red-600 hover:bg-red-700">
            <LogOut className="mr-2 h-4 w-4" />
            {isLoggingOut ? "Saindo..." : "Sair"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
