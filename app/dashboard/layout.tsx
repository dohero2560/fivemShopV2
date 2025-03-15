import type React from "react"
import { requireAuth } from "@/lib/auth"
import DashboardHeader from "./dashboard-header"
import DashboardSidebar from "./dashboard-sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if user is authenticated
  const user = await requireAuth()

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <DashboardHeader user={user} />
      <div className="flex-1 bg-gray-900">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
            <DashboardSidebar />
            <div>{children}</div>
          </div>
        </div>
      </div>
      <footer className="w-full border-t border-gray-800 bg-black py-6">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
          <p className="text-center text-sm text-gray-400">&copy; {new Date().getFullYear()} FiveM Scripts สงวนลิขสิทธิ์</p>
          <div className="flex gap-4">
            <a href="/terms" className="text-sm text-gray-400 hover:text-blue-500">
              เงื่อนไขการใช้งาน
            </a>
            <a href="/privacy" className="text-sm text-gray-400 hover:text-blue-500">
              นโยบายความเป็นส่วนตัว
            </a>
            <a href="/contact" className="text-sm text-gray-400 hover:text-blue-500">
              ติดต่อเรา
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

