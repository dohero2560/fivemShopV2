"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { BarChart3, Users, Package, ShoppingCart, CreditCard, FileText, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [activeTab, setActiveTab] = useState("overview")

  // Set active tab based on URL query parameter
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab) {
      setActiveTab(tab)
    } else if (pathname === "/admin") {
      setActiveTab("overview")
    }
  }, [pathname, searchParams])

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    router.push(`/admin?tab=${tab}`)
  }

  return (
    <div className="hidden md:block">
      <div className="space-y-4">
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="p-4">
            <nav className="space-y-2">
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeTab === "overview" ? "bg-blue-900/50 text-white" : "text-gray-400 hover:text-white hover:bg-gray-700"}`}
                onClick={() => handleTabChange("overview")}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                ภาพรวม
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeTab === "users" ? "bg-blue-900/50 text-white" : "text-gray-400 hover:text-white hover:bg-gray-700"}`}
                onClick={() => handleTabChange("users")}
              >
                <Users className="mr-2 h-4 w-4" />
                จัดการผู้ใช้
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeTab === "products" ? "bg-blue-900/50 text-white" : "text-gray-400 hover:text-white hover:bg-gray-700"}`}
                onClick={() => handleTabChange("products")}
              >
                <Package className="mr-2 h-4 w-4" />
                จัดการสคริปต์
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeTab === "orders" ? "bg-blue-900/50 text-white" : "text-gray-400 hover:text-white hover:bg-gray-700"}`}
                onClick={() => handleTabChange("orders")}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                คำสั่งซื้อ
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeTab === "payments" ? "bg-blue-900/50 text-white" : "text-gray-400 hover:text-white hover:bg-gray-700"}`}
                onClick={() => handleTabChange("payments")}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                การชำระเงิน
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeTab === "reports" ? "bg-blue-900/50 text-white" : "text-gray-400 hover:text-white hover:bg-gray-700"}`}
                onClick={() => handleTabChange("reports")}
              >
                <FileText className="mr-2 h-4 w-4" />
                รายงาน
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeTab === "settings" ? "bg-blue-900/50 text-white" : "text-gray-400 hover:text-white hover:bg-gray-700"}`}
                onClick={() => handleTabChange("settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                ตั้งค่าระบบ
              </Button>
            </nav>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
          <h3 className="font-medium text-white mb-2">สถานะระบบ</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">เซิร์ฟเวอร์:</span>
              <span className="text-xs text-green-400">ออนไลน์</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">ฐานข้อมูล:</span>
              <span className="text-xs text-green-400">ออนไลน์</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">ระบบชำระเงิน:</span>
              <span className="text-xs text-green-400">ออนไลน์</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">อัปเดตล่าสุด:</span>
              <span className="text-xs text-gray-400">{new Date().toLocaleTimeString("th-TH")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

