"use client"

import { ApprovalDashboard } from "@/components/approval/approval-dashboard"

export default function ApprovacoesPage() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">✅ Aprovações</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Sistema de aprovação para remanejamentos e alterações acadêmicas
          </p>
        </div>
      </div>

      <ApprovalDashboard />
    </div>
  )
}
