"use client"

import Link from "next/link"
import { Shield, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

export default function AdminHeader({ admin }: { admin: any }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="font-bold text-2xl bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
              FiveM Scripts <span className="text-sm text-white">แอดมิน</span>
            </div>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium text-white transition-colors hover:text-blue-500">
              หน้าหลักเว็บไซต์
            </Link>
            <Link href="/admin" className="text-sm font-medium text-blue-500 transition-colors hover:text-blue-500">
              แดชบอร์ดแอดมิน
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="border-blue-600 text-white hover:bg-blue-900/50">
            <Shield className="mr-2 h-4 w-4" />
            {admin.name || "แอดมิน"}
          </Button>
          <Button variant="ghost" size="icon" className="text-white">
            <Bell className="h-5 w-5" />
            <span className="sr-only">การแจ้งเตือน</span>
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600"></span>
          </Button>
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            ออกจากระบบ
          </Button>
        </div>
      </div>
    </header>
  )
}

