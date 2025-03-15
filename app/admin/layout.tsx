import type React from "react"
import { requireAdmin } from "@/lib/auth"
import AdminHeader from "./admin-header"
import AdminSidebar from "./admin-sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if user is admin
  const admin = await requireAdmin()

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <AdminHeader admin={admin} />
      <div className="flex-1 bg-gray-900">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
            <AdminSidebar />
            <div>{children}</div>
          </div>
        </div>
      </div>
      <footer className="w-full border-t border-gray-800 bg-black py-6">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
          <p className="text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} FiveM Scripts สงวนลิขสิทธิ์ - แดชบอร์ดแอดมิน
          </p>
        </div>
      </footer>
    </div>
  )
}

