"use client"

import Link from "next/link"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut, useSession } from "next-auth/react"

export default function SiteHeader() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/75">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <div className="font-bold text-2xl bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
              FiveM Scripts
            </div>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium text-gray-400 transition-colors hover:text-blue-500">
              หน้าหลัก
            </Link>
            <Link href="/products" className="text-sm font-medium text-gray-400 transition-colors hover:text-blue-500">
              สินค้า
            </Link>
            {session && (
              <Link href="/dashboard" className="text-sm font-medium text-gray-400 transition-colors hover:text-blue-500">
                แดชบอร์ด
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
                  <span className="text-sm font-medium text-white">{session.user?.name?.[0] || "U"}</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-white">{session.user?.name || "ผู้ใช้"}</p>
                  <p className="text-xs text-gray-400">{(session.user as any)?.points || 0} พอยท์</p>
                </div>
              </div>

              {((session.user as any)?.role === "ADMIN" || (session.user as any)?.role === "SUPER_ADMIN") && (
                <Link href="/admin">
                  <Button variant="outline" className="bg-transparent border-red-600 text-red-500 hover:bg-red-950/50">
                    <Shield className="mr-2 h-4 w-4" />
                    แอดมิน
                  </Button>
                </Link>
              )}

              <Button
                variant="ghost"
                className="text-gray-400 hover:text-white hover:bg-gray-800"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                ออกจากระบบ
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button variant="outline" className="bg-transparent border-blue-600 text-blue-500 hover:bg-blue-950/50">
                เข้าสู่ระบบ
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
} 