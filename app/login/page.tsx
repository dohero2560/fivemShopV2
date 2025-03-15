import Link from "next/link"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DiscordAuth } from "./discord-auth"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const session = await getServerSession(authOptions)

  // Redirect to dashboard if already logged in
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <div className="font-bold text-2xl bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                FiveM Scripts
              </div>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/" className="text-sm font-medium text-white transition-colors hover:text-blue-500">
                หน้าหลัก
              </Link>
              <Link href="/products" className="text-sm font-medium text-white transition-colors hover:text-blue-500">
                สินค้า
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" className="border-red-600 text-white hover:bg-red-900/50">
                <Shield className="mr-2 h-4 w-4" />
                แอดมิน
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center bg-gray-900">
        <div className="w-full max-w-md p-8">
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">เข้าสู่ระบบ</h1>
              <p className="text-gray-400">เข้าสู่ระบบเพื่อเข้าถึงสคริปต์ FiveM ของคุณ</p>
            </div>

            <div className="space-y-6">
              <DiscordAuth />

              <div className="text-center text-sm text-gray-400">
                <p>
                  การเข้าสู่ระบบถือว่าคุณยอมรับ{" "}
                  <Link href="/terms" className="text-blue-400 hover:underline">
                    เงื่อนไขการใช้งาน
                  </Link>{" "}
                  และ{" "}
                  <Link href="/privacy" className="text-blue-400 hover:underline">
                    นโยบายความเป็นส่วนตัว
                  </Link>{" "}
                  ของเรา
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="w-full border-t border-gray-800 bg-black py-6">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
          <p className="text-center text-sm text-gray-400">&copy; {new Date().getFullYear()} FiveM Scripts สงวนลิขสิทธิ์</p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-gray-400 hover:text-blue-500">
              เงื่อนไขการใช้งาน
            </Link>
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-blue-500">
              นโยบายความเป็นส่วนตัว
            </Link>
            <Link href="/contact" className="text-sm text-gray-400 hover:text-blue-500">
              ติดต่อเรา
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

