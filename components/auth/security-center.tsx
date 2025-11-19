"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield } from "lucide-react"
import { EnterpriseSecurityDashboard } from "./enterprise-security-dashboard"

export function SecurityCenter() {
  const [activeTab, setActiveTab] = useState("enterprise")

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-blue-800">Central de Segurança</h1>
            <p className="text-gray-500">Gerencie todas as configurações de segurança do sistema</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="enterprise" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="enterprise" className="flex items-center gap-1">
            <Building className="h-4 w-4" />
            <span>Segurança Empresarial</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Usuários</span>
          </TabsTrigger>
          <TabsTrigger value="devices" className="flex items-center gap-1">
            <Laptop className="h-4 w-4" />
            <span>Dispositivos</span>
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-1">
            <FileSearch className="h-4 w-4" />
            <span>Auditoria</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="enterprise" className="pt-6">
          <EnterpriseSecurityDashboard />
        </TabsContent>

        <TabsContent value="users" className="pt-6">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Segurança de Usuários</CardTitle>
              <CardDescription>Gerencie configurações de segurança para usuários</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Conteúdo da aba de segurança de usuários será exibido aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="pt-6">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Segurança de Dispositivos</CardTitle>
              <CardDescription>Gerencie configurações de segurança para dispositivos</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Conteúdo da aba de segurança de dispositivos será exibido aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="pt-6">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Auditoria de Segurança</CardTitle>
              <CardDescription>Visualize logs e relatórios de auditoria de segurança</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Conteúdo da aba de auditoria de segurança será exibido aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Building(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  )
}

function Users(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function Laptop(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16" />
    </svg>
  )
}

function FileSearch(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v3" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M5 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <path d="m9 18-1.5-1.5" />
    </svg>
  )
}
