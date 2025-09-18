"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import Image from "next/image"

interface MobileHeaderProps {
  onMenuClick: () => void
  title: string
}

export function MobileHeader({ onMenuClick, title }: MobileHeaderProps) {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between h-full px-4">
        {/* Menu Button */}
        <Button variant="ghost" size="sm" onClick={onMenuClick} className="p-2">
          <Menu className="h-6 w-6" />
        </Button>

        {/* Logo and Title */}
        <div className="flex items-center gap-2 flex-1 justify-center">
          <div className="relative w-8 h-8">
            <Image
              src="/images/colegio-plus-logo.png"
              alt="Colégio Plus"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <span className="font-semibold text-gray-900 dark:text-white truncate">{title}</span>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
