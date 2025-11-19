"use client"

import type React from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Lock, FileText } from "lucide-react"
import { LoginSecurityDashboard } from "./login-security-dashboard"
import { SecurityComplianceDashboard } from "./security-compliance-dashboard"
import { SSOIntegration } from "./sso-integration"

export function EnterpriseSecurityDashboard() {
  return (
    <div className="space-y-6">
      <Card className="border-blue-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-blue-800">Segurança Empresarial</CardTitle>
              <CardDescription>Gerencie configurações avançadas de segurança para sua organização</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="login">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="login" className="flex items-center gap-1">
            <Lock className="h-4 w-4" />
            <span>Segurança de Login</span>
          </TabsTrigger>
          <TabsTrigger value="sso" className="flex items-center gap-1">
            <Key className="h-4 w-4" />
            <span>SSO Empresarial</span>
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>Conformidade</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="pt-6">
          <LoginSecurityDashboard />
        </TabsContent>

        <TabsContent value="sso" className="pt-6">
          <SSOIntegration />
        </TabsContent>

        <TabsContent value="compliance" className="pt-6">
          <SecurityComplianceDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Key(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="m21 2-9.6 9.6" />
      <path d="m15.5 7.5 3 3L22 7l-3-3" />
    </svg>
  )
}
