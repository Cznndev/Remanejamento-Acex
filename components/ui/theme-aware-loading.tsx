"use client"

import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ThemeAwareLoadingProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function ThemeAwareLoading({ size = "md", className }: ThemeAwareLoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Loader2 className={cn("animate-spin text-brand-red-500 dark:text-brand-red-400", sizeClasses[size])} />
    </div>
  )
}
