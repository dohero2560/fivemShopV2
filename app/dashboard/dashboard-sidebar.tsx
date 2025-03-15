"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Package, Settings, CreditCard, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"

export default function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()

  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview")

  // Update active tab when URL changes
  useEffect(() => {
    const tab = searchParams.get("tab")
    setActiveTab(tab || "overview")
  }, [searchParams])

  const tabs = [
    {
      title: "ภาพรวม",
      value: "overview",
      icon: Wallet,
    },
    {
      title: "สคริปต์ที่ซื้อ",
      value: "purchases",
      icon: Package,
    },
    {
      title: "เติมเงิน",
      value: "payment",
      icon: CreditCard,
    },
    {
      title: "ตั้งค่า",
      value: "server-config",
      icon: Settings,
    },
  ]

  return (
    <div className="hidden md:block">
      <div className="space-y-4">
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full overflow-hidden mb-4 bg-gray-700">
                <Image
                  src={session?.user?.image || "/placeholder.svg?height=80&width=80"}
                  alt="โปรไฟล์"
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </div>
              <h2 className="text-xl font-bold text-white">{session?.user?.name || "ผู้ใช้"}</h2>
              <p className="text-gray-400 text-sm">
                สมาชิกตั้งแต่{" "}
                {new Date(session?.user?.createdAt || Date.now()).toLocaleDateString("th-TH", {
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <div className="mt-3 flex items-center bg-blue-900/30 px-3 py-1 rounded-full">
                <Wallet className="h-4 w-4 text-blue-400 mr-2" />
                <span className="text-blue-300 font-medium">{session?.user?.points || 0} พอยท์</span>
              </div>
            </div>
          </div>
          <Separator className="bg-gray-700" />
          <div className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <Button
                    key={tab.value}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      activeTab === tab.value ? "bg-blue-900/50 text-blue-500" : "text-gray-400 hover:text-white"
                    )}
                    onClick={() => {
                      router.push(`/dashboard?tab=${tab.value}`)
                      setActiveTab(tab.value)
                    }}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {tab.title}
                  </Button>
                )
              })}
            </nav>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
          <h3 className="font-medium text-white mb-2">ต้องการความช่วยเหลือ?</h3>
          <p className="text-gray-400 text-sm mb-4">มีปัญหากับสคริปต์ของคุณ? ทีมสนับสนุนของเราพร้อมช่วยเหลือ</p>
          <Button variant="outline" className="w-full border-blue-600 text-white hover:bg-blue-900/50">
            ติดต่อฝ่ายสนับสนุน
          </Button>
        </div>
      </div>
    </div>
  )
}

