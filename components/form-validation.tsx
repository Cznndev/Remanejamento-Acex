import { CheckCircle2, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface ValidationMessageProps {
  message: string
  type: "success" | "error" | "info"
  show: boolean
}

export function ValidationMessage({ message, type, show }: ValidationMessageProps) {
  if (!show) return null

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-xs mt-1 transition-all duration-200",
        type === "success" && "text-green-600 dark:text-green-400",
        type === "error" && "text-red-600 dark:text-red-400",
        type === "info" && "text-blue-600 dark:text-blue-400",
      )}
    >
      {type === "success" && <CheckCircle2 className="h-3 w-3" />}
      {type === "error" && <AlertCircle className="h-3 w-3" />}
      {type === "info" && <Info className="h-3 w-3" />}
      <span>{message}</span>
    </div>
  )
}

interface PasswordStrengthProps {
  password: string
  show: boolean
}

export function PasswordStrength({ password, show }: PasswordStrengthProps) {
  if (!show || !password) return null

  // Calcular força da senha
  const getStrength = (password: string): number => {
    let score = 0

    // Comprimento
    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1

    // Complexidade
    if (/[A-Z]/.test(password)) score += 1
    if (/[a-z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1

    return Math.min(score, 5)
  }

  const strength = getStrength(password)

  const getStrengthText = (strength: number): string => {
    if (strength === 0) return "Muito fraca"
    if (strength === 1) return "Fraca"
    if (strength === 2) return "Razoável"
    if (strength === 3) return "Média"
    if (strength === 4) return "Forte"
    return "Muito forte"
  }

  const getStrengthColor = (strength: number): string => {
    if (strength <= 1) return "bg-red-500 dark:bg-red-600"
    if (strength === 2) return "bg-orange-500 dark:bg-orange-600"
    if (strength === 3) return "bg-yellow-500 dark:bg-yellow-600"
    if (strength >= 4) return "bg-green-500 dark:bg-green-600"
    return ""
  }

  return (
    <div className="mt-2 space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-600 dark:text-slate-400">Força da senha:</span>
        <span
          className={cn(
            "font-medium",
            strength <= 1 && "text-red-600 dark:text-red-400",
            strength === 2 && "text-orange-600 dark:text-orange-400",
            strength === 3 && "text-yellow-600 dark:text-yellow-400",
            strength >= 4 && "text-green-600 dark:text-green-400",
          )}
        >
          {getStrengthText(strength)}
        </span>
      </div>
      <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-full w-1/5 transition-all duration-300 ease-out",
              i < strength ? getStrengthColor(strength) : "bg-transparent",
            )}
          />
        ))}
      </div>
    </div>
  )
}
