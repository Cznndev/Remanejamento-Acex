"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cardHover } from "@/lib/animations/variants"
import { cn } from "@/lib/utils"

interface AnimatedCardProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  delay?: number
  hover?: boolean
}

export function AnimatedCard({ title, description, children, className, delay = 0, hover = true }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      variants={hover ? cardHover : undefined}
      whileHover={hover ? "hover" : undefined}
      initial={hover ? "rest" : undefined}
    >
      <Card className={cn("overflow-hidden", className)}>
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  )
}
