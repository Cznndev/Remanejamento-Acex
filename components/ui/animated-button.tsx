"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { buttonTap } from "@/lib/animations/variants"
import { cn } from "@/lib/utils"
import type { ButtonProps } from "@/components/ui/button"

interface AnimatedButtonProps extends ButtonProps {
  children: React.ReactNode
  loading?: boolean
  success?: boolean
}

export function AnimatedButton({
  children,
  className,
  loading = false,
  success = false,
  disabled,
  ...props
}: AnimatedButtonProps) {
  return (
    <motion.div
      variants={buttonTap}
      whileTap={!disabled && !loading ? "whileTap" : undefined}
      whileHover={!disabled && !loading ? "whileHover" : undefined}
    >
      <Button
        className={cn(
          "relative overflow-hidden transition-all duration-200",
          success && "bg-green-500 hover:bg-green-600",
          className,
        )}
        disabled={disabled || loading}
        {...props}
      >
        <motion.div className="flex items-center gap-2" animate={loading ? { opacity: 0.7 } : { opacity: 1 }}>
          {loading && (
            <motion.div
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
          )}
          {success && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-4 h-4 text-white">
              ✓
            </motion.div>
          )}
          {children}
        </motion.div>
      </Button>
    </motion.div>
  )
}
