import { Building2 } from "lucide-react"

interface TransitionOverlayProps {
  message?: string
}

export function TransitionOverlay({ message = "Carregando seu ambiente..." }: TransitionOverlayProps) {
  return (
    <div className="transition-overlay">
      <div className="transition-logo-container p-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 shadow-lg transition-logo">
          <Building2 className="h-8 w-8 text-white" />
        </div>
      </div>
      <div className="transition-message text-slate-700 dark:text-slate-200">{message}</div>
      <div className="transition-progress">
        <div className="transition-progress-bar"></div>
      </div>
    </div>
  )
}
