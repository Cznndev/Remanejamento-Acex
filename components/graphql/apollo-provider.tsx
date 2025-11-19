"use client"

import type React from "react"

// Using fetch-based approach that works in Next.js runtime
export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
