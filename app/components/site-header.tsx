"use client"

import Link from "next/link"
import Image from "next/image"
import { Shield, User, LogOut, Settings, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut, useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SiteHeaderProps {
  user?: any // สำหรับหน้า dashboard
  isDashboard?: boolean // flag สำหรับบอกว่าเป็นหน้า dashboard หรือไม่
}

export default function SiteHeader({ user, isDashboard }: SiteHeaderProps) {
  const { data: session } = useSession()
  const pathname = usePathname()

  // ไม่แสดง header ในหน้า dashboard ถ้าไม่ได้ถูกเรียกจาก dashboard layout
  if (pathname?.startsWith('/dashboard') && !isDashboard) {
    return null
  }

  // ใช้ข้อมูลจาก user prop ถ้าอยู่ในหน้า dashboard หรือใช้จาก session ถ้าเป็นหน้าปกติ
  const currentUser = isDashboard ? user : session?.user
  
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
            <Link 
              href="/" 
              className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                pathname === "/" ? "text-blue-500" : "text-gray-400"
              }`}
            >
              หน้าหลัก
            </Link>
            <Link 
              href="/products" 
              className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                pathname === "/products" ? "text-blue-500" : "text-gray-400"
              }`}
            >
              สินค้า
            </Link>
            {(currentUser || isDashboard) && (
              <Link 
                href="/dashboard" 
                className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                  pathname.startsWith("/dashboard") ? "text-blue-500" : "text-gray-400"
                }`}
              >
                แดชบอร์ด
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {currentUser ? (
            <>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center bg-blue-900/30 px-3 py-1.5 rounded-full">
                  <Wallet className="h-4 w-4 text-blue-400 mr-2" />
                  <span className="text-blue-300 font-medium">{currentUser?.points || 0} พอยท์</span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <div className="relative h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center ring-2 ring-gray-800 hover:ring-blue-600 transition-all">
                        {currentUser?.image ? (
                          <Image
                            src={currentUser.image}
                            alt={currentUser.name || ""}
                            fill
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-medium text-white">
                            {currentUser?.name?.[0] || "U"}
                          </span>
                        )}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium text-gray-100">{currentUser?.name}</p>
                        <p className="text-xs text-gray-400">{currentUser?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href="/dashboard">
                      <DropdownMenuItem className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>แดชบอร์ด</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/dashboard/settings">
                      <DropdownMenuItem className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>ตั้งค่า</span>
                      </DropdownMenuItem>
                    </Link>
                    {(currentUser?.role === "ADMIN" || currentUser?.role === "SUPER_ADMIN") && (
                      <>
                        <DropdownMenuSeparator />
                        <Link href="/admin">
                          <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500">
                            <Shield className="mr-2 h-4 w-4" />
                            <span>หน้าผู้ดูแลระบบ</span>
                          </DropdownMenuItem>
                        </Link>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer text-gray-400 focus:text-white"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>ออกจากระบบ</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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