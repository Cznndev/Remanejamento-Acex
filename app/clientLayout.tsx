"use client"

import type React from "react"
import { Inter } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ToastNotifications } from "@/components/notifications/toast-notifications"
import { WebSocketProvider } from "@/components/real-time/websocket-provider"
import { ApolloWrapper } from "@/components/graphql/apollo-provider"
import { AnalyticsProvider } from "@/components/analytics/analytics-provider"
import { usePathname } from 'next/navigation'
import { useEffect, useState } from "react"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ApolloWrapper>
          <WebSocketProvider>
            <AnalyticsProvider>
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                <div className="relative flex min-h-screen flex-col">
                  <div className="flex-1">{children}</div>
                  <ClientToastWrapper />
                </div>
              </ThemeProvider>
            </AnalyticsProvider>
          </WebSocketProvider>
        </ApolloWrapper>
      </body>
    </html>
  )
}

function ClientToastWrapper() {
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Verifica se o usuário está autenticado
    const auth = localStorage.getItem("et-wicca-auth")
    setIsAuthenticated(!!auth)
  }, [pathname])

  // Não mostra notificações na página de login (raiz)
  if (pathname === "/" || !isAuthenticated) {
    return null
  }

  return <ToastNotifications />
}
