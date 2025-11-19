"use client"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

// Simple toast implementation using browser notifications
export function toast({ title, description, variant = "default" }: ToastProps) {
  const message = title + (description ? `\n${description}` : "")

  if (variant === "destructive") {
    alert(`❌ ${message}`)
  } else {
    alert(`✅ ${message}`)
  }
}

export function useToast() {
  return { toast }
}
