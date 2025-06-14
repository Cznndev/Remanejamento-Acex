"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Palette, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const themes = [
  { name: "Colégio Plus", primary: "#ef4444", secondary: "#f97316", accent: "#2563eb" },
  { name: "Azul Oceano", primary: "#0ea5e9", secondary: "#06b6d4", accent: "#8b5cf6" },
  { name: "Verde Natureza", primary: "#10b981", secondary: "#84cc16", accent: "#f59e0b" },
  { name: "Roxo Elegante", primary: "#8b5cf6", secondary: "#a855f7", accent: "#ec4899" },
  { name: "Laranja Vibrante", primary: "#f97316", secondary: "#fb923c", accent: "#ef4444" },
]

export function ThemeCustomizer() {
  const [selectedTheme, setSelectedTheme] = useState(themes[0])
  const [open, setOpen] = useState(false)

  const applyTheme = (theme: (typeof themes)[0]) => {
    const root = document.documentElement
    root.style.setProperty("--primary", theme.primary)
    root.style.setProperty("--secondary", theme.secondary)
    root.style.setProperty("--accent", theme.accent)
    setSelectedTheme(theme)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Palette className="w-4 h-4" />
          Tema
        </Button>
      </PopoverTrigger>
      <AnimatePresence>
        {open && (
          <PopoverContent className="w-80 p-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <h3 className="font-semibold">Personalizar Tema</h3>
              <div className="grid gap-3">
                {themes.map((theme, index) => (
                  <motion.button
                    key={theme.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => applyTheme(theme)}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex gap-1">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.primary }} />
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.secondary }} />
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.accent }} />
                    </div>
                    <span className="flex-1 text-left">{theme.name}</span>
                    {selectedTheme.name === theme.name && <Check className="w-4 h-4 text-green-500" />}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </PopoverContent>
        )}
      </AnimatePresence>
    </Popover>
  )
}
