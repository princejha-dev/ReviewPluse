"use client"

import Sidebar from "@/components/Sidebar"
import AuthGuard from "@/components/AuthGuard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-[calc(100vh-68px)] bg-[#faf8ff]">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <div className="p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
