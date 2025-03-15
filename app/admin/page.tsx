"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import {
  Users,
  Package,
  Settings,
  ShoppingCart,
  CreditCard,
  BarChart3,
  Shield,
  FileText,
  Bell,
  Search,
  Plus,
  Download,
  Trash2,
  Edit,
  Eye,
  Check,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// เพิ่ม import PaymentDetail
import PaymentDetail from "./payment-detail"

// import { redirect } from "next/navigation"
// import { Tabs, TabsContent } from "@/components/ui/tabs"
// import { requireAdmin } from "@/lib/auth"
// import prisma from "@/lib/prisma"
// import OverviewTab from "./tabs/overview-tab"
// import UsersTab from "./tabs/users-tab"
// import ProductsTab from "./tabs/products-tab"
// import OrdersTab from "./tabs/orders-tab"
// import PaymentsTab from "./tabs/payments-tab"
// import ReportsTab from "./tabs/reports-tab"
// import SettingsTab from "./tabs/settings-tab"

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  // เพิ่ม state สำหรับ dialog และข้อมูลการชำระเงินที่เลือก
  const [showSlipDialog, setShowSlipDialog] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<any>(null)

  // เพิ่มฟังก์ชันสำหรับเปิด dialog แสดงสลิป
  const openSlipDialog = (payment: any) => {
    setSelectedPayment(payment)
    setShowSlipDialog(true)
  }

  // แก้ไขฟังก์ชันสำหรับการอนุมัติและปฏิเสธการชำระเงิน
  const approvePayment = (paymentId: string, note: string) => {
    // ในระบบจริงจะต้องเรียก API เพื่ออัปเดตสถานะในฐานข้อมูล
    alert(`อนุมัติการชำระเงิน #${paymentId} เรียบร้อยแล้ว${note ? "\nหมายเหตุ: " + note : ""}`)
    setShowSlipDialog(false)
  }

  const rejectPayment = (paymentId: string, note: string) => {
    // ในระบบจริงจะต้องเรียก API เพื่ออัปเดตสถานะในฐานข้อมูล
    alert(`ปฏิเสธการชำระเงิน #${paymentId} เรียบร้อยแล้ว${note ? "\nหมายเหตุ: " + note : ""}`)
    setShowSlipDialog(false)
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
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
              แอดมิน
            </Button>
            <Button variant="ghost" size="icon" className="text-white">
              <Bell className="h-5 w-5" />
              <span className="sr-only">การแจ้งเตือน</span>
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600"></span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-gray-900">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
            <div className="hidden md:block">
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 rounded-full overflow-hidden mb-4 bg-gray-700">
                        <Image
                          src="/placeholder.svg?height=80&width=80"
                          alt="โปรไฟล์แอดมิน"
                          width={80}
                          height={80}
                          className="object-cover"
                        />
                      </div>
                      <h2 className="text-xl font-bold text-white">แอดมิน</h2>
                      <p className="text-gray-400 text-sm">ผู้ดูแลระบบหลัก</p>
                      <div className="mt-3 flex items-center bg-red-900/30 px-3 py-1 rounded-full">
                        <Shield className="h-4 w-4 text-red-400 mr-2" />
                        <span className="text-red-300 font-medium">สิทธิ์แอดมินสูงสุด</span>
                      </div>
                    </div>
                  </div>
                  <Separator className="bg-gray-700" />
                  <div className="p-4">
                    <nav className="space-y-2">
                      <Button
                        variant="ghost"
                        className={`w-full justify-start ${activeTab === "overview" ? "bg-blue-900/50 text-white" : "text-gray-400 hover:text-white hover:bg-gray-700"}`}
                        onClick={() => setActiveTab("overview")}
                      >
                        <BarChart3 className="mr-2 h-4 w-4" />
                        ภาพรวม
                      </Button>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start ${activeTab === "users" ? "bg-blue-900/50 text-white" : "text-gray-400 hover:text-white hover:bg-gray-700"}`}
                        onClick={() => setActiveTab("users")}
                      >
                        <Users className="mr-2 h-4 w-4" />
                        จัดการผู้ใช้
                      </Button>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start ${activeTab === "products" ? "bg-blue-900/50 text-white" : "text-gray-400 hover:text-white hover:bg-gray-700"}`}
                        onClick={() => setActiveTab("products")}
                      >
                        <Package className="mr-2 h-4 w-4" />
                        จัดการสคริปต์
                      </Button>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start ${activeTab === "orders" ? "bg-blue-900/50 text-white" : "text-gray-400 hover:text-white hover:bg-gray-700"}`}
                        onClick={() => setActiveTab("orders")}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        คำสั่งซื้อ
                      </Button>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start ${activeTab === "payments" ? "bg-blue-900/50 text-white" : "text-gray-400 hover:text-white hover:bg-gray-700"}`}
                        onClick={() => setActiveTab("payments")}
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        การชำระเงิน
                      </Button>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start ${activeTab === "reports" ? "bg-blue-900/50 text-white" : "text-gray-400 hover:text-white hover:bg-gray-700"}`}
                        onClick={() => setActiveTab("reports")}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        รายงาน
                      </Button>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start ${activeTab === "settings" ? "bg-blue-900/50 text-white" : "text-gray-400 hover:text-white hover:bg-gray-700"}`}
                        onClick={() => setActiveTab("settings")}
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
                      <Badge className="bg-green-600">ออนไลน์</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">ฐานข้อมูล:</span>
                      <Badge className="bg-green-600">ออนไลน์</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">ระบบชำระเงิน:</span>
                      <Badge className="bg-green-600">ออนไลน์</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">อัปเดตล่าสุด:</span>
                      <span className="text-xs text-gray-400">วันนี้, 10:45</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex items-center justify-between mb-6 md:hidden">
                  <h1 className="text-2xl font-bold text-white">แดชบอร์ดแอดมิน</h1>
                  <TabsList className="bg-gray-800">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
                      ภาพรวม
                    </TabsTrigger>
                    <TabsTrigger value="users" className="data-[state=active]:bg-blue-600">
                      ผู้ใช้
                    </TabsTrigger>
                    <TabsTrigger value="products" className="data-[state=active]:bg-blue-600">
                      สคริปต์
                    </TabsTrigger>
                    <TabsTrigger value="orders" className="data-[state=active]:bg-blue-600">
                      คำสั่งซื้อ
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* ภาพรวม */}
                <TabsContent value="overview" className="space-y-6">
                  <h1 className="text-2xl font-bold text-white hidden md:block">ภาพรวมระบบ</h1>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-white text-lg">ผู้ใช้ทั้งหมด</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="text-3xl font-bold text-white">1,245</div>
                          <div className="p-2 bg-blue-900/30 rounded-full">
                            <Users className="h-6 w-6 text-blue-400" />
                          </div>
                        </div>
                        <div className="text-sm text-green-400 mt-2 flex items-center">
                          <span>+12% จากเดือนที่แล้ว</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-white text-lg">รายได้ทั้งหมด</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="text-3xl font-bold text-white">฿152,489</div>
                          <div className="p-2 bg-green-900/30 rounded-full">
                            <CreditCard className="h-6 w-6 text-green-400" />
                          </div>
                        </div>
                        <div className="text-sm text-green-400 mt-2 flex items-center">
                          <span>+8% จากเดือนที่แล้ว</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-white text-lg">คำสั่งซื้อทั้งหมด</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="text-3xl font-bold text-white">3,721</div>
                          <div className="p-2 bg-purple-900/30 rounded-full">
                            <ShoppingCart className="h-6 w-6 text-purple-400" />
                          </div>
                        </div>
                        <div className="text-sm text-green-400 mt-2 flex items-center">
                          <span>+15% จากเดือนที่แล้ว</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-white text-lg">สคริปต์ทั้งหมด</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="text-3xl font-bold text-white">48</div>
                          <div className="p-2 bg-yellow-900/30 rounded-full">
                            <Package className="h-6 w-6 text-yellow-400" />
                          </div>
                        </div>
                        <div className="text-sm text-green-400 mt-2 flex items-center">
                          <span>+3 สคริปต์ใหม่เดือนนี้</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-white">คำสั่งซื้อล่าสุด</CardTitle>
                        <CardDescription className="text-gray-400">คำสั่งซื้อ 5 รายการล่าสุดในระบบ</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4">
                        <Table>
                          <TableHeader className="bg-gray-900">
                            <TableRow className="border-gray-700 hover:bg-gray-800">
                              <TableHead className="text-gray-400">รหัส</TableHead>
                              <TableHead className="text-gray-400">ผู้ใช้</TableHead>
                              <TableHead className="text-gray-400">สคริปต์</TableHead>
                              <TableHead className="text-gray-400 text-right">ราคา</TableHead>
                              <TableHead className="text-gray-400 text-right">สถานะ</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {recentOrders.map((order) => (
                              <TableRow key={order.id} className="border-gray-700 hover:bg-gray-800">
                                <TableCell className="text-white font-medium">#{order.id}</TableCell>
                                <TableCell className="text-gray-400">{order.user}</TableCell>
                                <TableCell className="text-white">{order.product}</TableCell>
                                <TableCell className="text-white text-right">{order.price} พอยท์</TableCell>
                                <TableCell className="text-right">
                                  <Badge
                                    className={
                                      order.status === "เสร็จสิ้น"
                                        ? "bg-green-600"
                                        : order.status === "กำลังดำเนินการ"
                                          ? "bg-yellow-600"
                                          : "bg-red-600"
                                    }
                                  >
                                    {order.status}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <div className="mt-4">
                          <Button
                            variant="outline"
                            className="w-full border-blue-600 text-white hover:bg-blue-900/50"
                            onClick={() => setActiveTab("orders")}
                          >
                            ดูคำสั่งซื้อทั้งหมด
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-white">การชำระเงินที่รอการยืนยัน</CardTitle>
                        <CardDescription className="text-gray-400">การชำระเงินที่รอการตรวจสอบและอนุมัติ</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4">
                        <Table>
                          <TableHeader className="bg-gray-900">
                            <TableRow className="border-gray-700 hover:bg-gray-800">
                              <TableHead className="text-gray-400">รหัส</TableHead>
                              <TableHead className="text-gray-400">ผู้ใช้</TableHead>
                              <TableHead className="text-gray-400 text-right">จำนวน</TableHead>
                              <TableHead className="text-gray-400 text-right">พอยท์</TableHead>
                              <TableHead className="text-gray-400 text-right">การดำเนินการ</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pendingPayments.map((payment) => (
                              <TableRow key={payment.id} className="border-gray-700 hover:bg-gray-800">
                                <TableCell className="text-white font-medium">#{payment.id}</TableCell>
                                <TableCell className="text-gray-400">{payment.user}</TableCell>
                                <TableCell className="text-white text-right">${payment.amount}</TableCell>
                                <TableCell className="text-white text-right">{payment.points}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-green-500 hover:text-green-400"
                                    >
                                      <Check className="h-4 w-4" />
                                      <span className="sr-only">อนุมัติ</span>
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-red-500 hover:text-red-400"
                                    >
                                      <X className="h-4 w-4" />
                                      <span className="sr-only">ปฏิเสธ</span>
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <div className="mt-4">
                          <Button
                            variant="outline"
                            className="w-full border-blue-600 text-white hover:bg-blue-900/50"
                            onClick={() => setActiveTab("payments")}
                          >
                            ดูการชำระเงินทั้งหมด
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-white">กราฟรายได้</CardTitle>
                      <CardDescription className="text-gray-400">รายได้ย้อนหลัง 6 เดือน</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="h-80 w-full bg-gray-900 rounded-md flex items-center justify-center">
                        <p className="text-gray-400">กราฟแสดงรายได้จะปรากฏที่นี่</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* จัดการผู้ใช้ */}
                <TabsContent value="users" className="space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h1 className="text-2xl font-bold text-white">จัดการผู้ใช้</h1>
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                      <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          type="search"
                          placeholder="ค้นหาผู้ใช้..."
                          className="w-full pl-8 bg-gray-800 border-gray-700 text-white focus-visible:ring-blue-600"
                        />
                      </div>
                      <Button className="bg-blue-600 text-white hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" />
                        เพิ่มผู้ใช้ใหม่
                      </Button>
                    </div>
                  </div>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <Table>
                        <TableHeader className="bg-gray-900">
                          <TableRow className="border-gray-700 hover:bg-gray-800">
                            <TableHead className="text-gray-400">รหัส</TableHead>
                            <TableHead className="text-gray-400">ชื่อผู้ใช้</TableHead>
                            <TableHead className="text-gray-400">อีเมล</TableHead>
                            <TableHead className="text-gray-400">วันที่สมัคร</TableHead>
                            <TableHead className="text-gray-400 text-right">พอยท์</TableHead>
                            <TableHead className="text-gray-400 text-right">สถานะ</TableHead>
                            <TableHead className="text-gray-400 text-right">การดำเนินการ</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.map((user) => (
                            <TableRow key={user.id} className="border-gray-700 hover:bg-gray-800">
                              <TableCell className="text-white font-medium">#{user.id}</TableCell>
                              <TableCell className="text-white">{user.username}</TableCell>
                              <TableCell className="text-gray-400">{user.email}</TableCell>
                              <TableCell className="text-gray-400">{user.joinDate}</TableCell>
                              <TableCell className="text-white text-right">{user.points}</TableCell>
                              <TableCell className="text-right">
                                <Badge className={user.status === "ใช้งาน" ? "bg-green-600" : "bg-red-600"}>
                                  {user.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-blue-500 hover:text-blue-400"
                                  >
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">แก้ไข</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-500 hover:text-red-400"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">ลบ</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className="flex justify-center mt-6">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-gray-700 text-white hover:bg-gray-800 hover:text-blue-500"
                          >
                            <span className="sr-only">หน้าก่อนหน้า</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="m15 18-6-6 6-6" />
                            </svg>
                          </Button>
                          <Button
                            variant="outline"
                            className="border-blue-600 bg-blue-600/10 text-white hover:bg-blue-900/50"
                          >
                            1
                          </Button>
                          <Button
                            variant="outline"
                            className="border-gray-700 text-white hover:bg-gray-800 hover:text-blue-500"
                          >
                            2
                          </Button>
                          <Button
                            variant="outline"
                            className="border-gray-700 text-white hover:bg-gray-800 hover:text-blue-500"
                          >
                            3
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-gray-700 text-white hover:bg-gray-800 hover:text-blue-500"
                          >
                            <span className="sr-only">หน้าถัดไป</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="m9 18 6-6-6-6" />
                            </svg>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* จัดการสคริปต์ */}
                <TabsContent value="products" className="space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h1 className="text-2xl font-bold text-white">จัดการสคริปต์</h1>
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                      <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          type="search"
                          placeholder="ค้นหาสคริปต์..."
                          className="w-full pl-8 bg-gray-800 border-gray-700 text-white focus-visible:ring-blue-600"
                        />
                      </div>
                      <Button className="bg-blue-600 text-white hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" />
                        เพิ่มสคริปต์ใหม่
                      </Button>
                    </div>
                  </div>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <Table>
                        <TableHeader className="bg-gray-900">
                          <TableRow className="border-gray-700 hover:bg-gray-800">
                            <TableHead className="text-gray-400">รหัส</TableHead>
                            <TableHead className="text-gray-400">ชื่อสคริปต์</TableHead>
                            <TableHead className="text-gray-400">หมวดหมู่</TableHead>
                            <TableHead className="text-gray-400">เวอร์ชัน</TableHead>
                            <TableHead className="text-gray-400 text-right">ราคา (พอยท์)</TableHead>
                            <TableHead className="text-gray-400 text-right">ยอดขาย</TableHead>
                            <TableHead className="text-gray-400 text-right">สถานะ</TableHead>
                            <TableHead className="text-gray-400 text-right">การดำเนินการ</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {scripts.map((script) => (
                            <TableRow key={script.id} className="border-gray-700 hover:bg-gray-800">
                              <TableCell className="text-white font-medium">#{script.id}</TableCell>
                              <TableCell className="text-white">{script.title}</TableCell>
                              <TableCell className="text-gray-400">{script.category}</TableCell>
                              <TableCell className="text-gray-400">{script.version}</TableCell>
                              <TableCell className="text-white text-right">{script.price}</TableCell>
                              <TableCell className="text-white text-right">{script.sales}</TableCell>
                              <TableCell className="text-right">
                                <Badge className={script.status === "เผยแพร่" ? "bg-green-600" : "bg-yellow-600"}>
                                  {script.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-blue-500 hover:text-blue-400"
                                  >
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">แก้ไข</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-green-500 hover:text-green-400"
                                  >
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">ดู</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-500 hover:text-red-400"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">ลบ</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className="flex justify-center mt-6">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-gray-700 text-white hover:bg-gray-800 hover:text-blue-500"
                          >
                            <span className="sr-only">หน้าก่อนหน้า</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="m15 18-6-6 6-6" />
                            </svg>
                          </Button>
                          <Button
                            variant="outline"
                            className="border-blue-600 bg-blue-600/10 text-white hover:bg-blue-900/50"
                          >
                            1
                          </Button>
                          <Button
                            variant="outline"
                            className="border-gray-700 text-white hover:bg-gray-800 hover:text-blue-500"
                          >
                            2
                          </Button>
                          <Button
                            variant="outline"
                            className="border-gray-700 text-white hover:bg-gray-800 hover:text-blue-500"
                          >
                            3
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-gray-700 text-white hover:bg-gray-800 hover:text-blue-500"
                          >
                            <span className="sr-only">หน้าถัดไป</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="m9 18 6-6-6-6" />
                            </svg>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* คำสั่งซื้อ */}
                <TabsContent value="orders" className="space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h1 className="text-2xl font-bold text-white">จัดการคำสั่งซื้อ</h1>
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                      <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          type="search"
                          placeholder="ค้นหาคำสั่งซื้อ..."
                          className="w-full pl-8 bg-gray-800 border-gray-700 text-white focus-visible:ring-blue-600"
                        />
                      </div>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white focus:ring-blue-600">
                          <SelectValue placeholder="กรองตามสถานะ" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="all">ทั้งหมด</SelectItem>
                          <SelectItem value="completed">เสร็จสิ้น</SelectItem>
                          <SelectItem value="processing">กำลังดำเนินการ</SelectItem>
                          <SelectItem value="cancelled">ยกเลิก</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <Table>
                        <TableHeader className="bg-gray-900">
                          <TableRow className="border-gray-700 hover:bg-gray-800">
                            <TableHead className="text-gray-400">รหัส</TableHead>
                            <TableHead className="text-gray-400">ผู้ใช้</TableHead>
                            <TableHead className="text-gray-400">สคริปต์</TableHead>
                            <TableHead className="text-gray-400">วันที่</TableHead>
                            <TableHead className="text-gray-400 text-right">ราคา</TableHead>
                            <TableHead className="text-gray-400 text-right">สถานะ</TableHead>
                            <TableHead className="text-gray-400 text-right">การดำเนินการ</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.map((order) => (
                            <TableRow key={order.id} className="border-gray-700 hover:bg-gray-800">
                              <TableCell className="text-white font-medium">#{order.id}</TableCell>
                              <TableCell className="text-white">{order.user}</TableCell>
                              <TableCell className="text-gray-400">{order.product}</TableCell>
                              <TableCell className="text-gray-400">{order.date}</TableCell>
                              <TableCell className="text-white text-right">{order.price} พอยท์</TableCell>
                              <TableCell className="text-right">
                                <Badge
                                  className={
                                    order.status === "เสร็จสิ้น"
                                      ? "bg-green-600"
                                      : order.status === "กำลังดำเนินการ"
                                        ? "bg-yellow-600"
                                        : "bg-red-600"
                                  }
                                >
                                  {order.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-blue-500 hover:text-blue-400"
                                  >
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">ดูรายละเอียด</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-green-500 hover:text-green-400"
                                  >
                                    <Download className="h-4 w-4" />
                                    <span className="sr-only">ดาวน์โหลดใบเสร็จ</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className="flex justify-center mt-6">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-gray-700 text-white hover:bg-gray-800 hover:text-blue-500"
                          >
                            <span className="sr-only">หน้าก่อนหน้า</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="m15 18-6-6 6-6" />
                            </svg>
                          </Button>
                          <Button
                            variant="outline"
                            className="border-blue-600 bg-blue-600/10 text-white hover:bg-blue-900/50"
                          >
                            1
                          </Button>
                          <Button
                            variant="outline"
                            className="border-gray-700 text-white hover:bg-gray-800 hover:text-blue-500"
                          >
                            2
                          </Button>
                          <Button
                            variant="outline"
                            className="border-gray-700 text-white hover:bg-gray-800 hover:text-blue-500"
                          >
                            3
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-gray-700 text-white hover:bg-gray-800 hover:text-blue-500"
                          >
                            <span className="sr-only">หน้าถัดไป</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="m9 18 6-6-6-6" />
                            </svg>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* การชำระเงิน */}
                <TabsContent value="payments" className="space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h1 className="text-2xl font-bold text-white">จัดการการชำระเงิน</h1>
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                      <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          type="search"
                          placeholder="ค้นหาการชำระเงิน..."
                          className="w-full pl-8 bg-gray-800 border-gray-700 text-white focus-visible:ring-blue-600"
                        />
                      </div>
                      <Select defaultValue="pending">
                        <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white focus:ring-blue-600">
                          <SelectValue placeholder="กรองตามสถานะ" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="all">ทั้งหมด</SelectItem>
                          <SelectItem value="pending">รอดำเนินการ</SelectItem>
                          <SelectItem value="approved">อนุมัติแล้ว</SelectItem>
                          <SelectItem value="rejected">ปฏิเสธ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <Table>
                        <TableHeader className="bg-gray-900">
                          <TableRow className="border-gray-700 hover:bg-gray-800">
                            <TableHead className="text-gray-400">รหัส</TableHead>
                            <TableHead className="text-gray-400">ผู้ใช้</TableHead>
                            <TableHead className="text-gray-400">วันที่</TableHead>
                            <TableHead className="text-gray-400">รหัสธุรกรรม</TableHead>
                            <TableHead className="text-gray-400 text-right">จำนวน</TableHead>
                            <TableHead className="text-gray-400 text-right">พอยท์</TableHead>
                            <TableHead className="text-gray-400 text-right">สถานะ</TableHead>
                            <TableHead className="text-gray-400 text-right">การดำเนินการ</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {payments.map((payment) => (
                            <TableRow key={payment.id} className="border-gray-700 hover:bg-gray-800">
                              <TableCell className="text-white font-medium">#{payment.id}</TableCell>
                              <TableCell className="text-white">{payment.user}</TableCell>
                              <TableCell className="text-gray-400">{payment.date}</TableCell>
                              <TableCell className="text-gray-400">{payment.transactionId}</TableCell>
                              <TableCell className="text-white text-right">${payment.amount}</TableCell>
                              <TableCell className="text-white text-right">{payment.points}</TableCell>
                              <TableCell className="text-right">
                                <Badge
                                  className={
                                    payment.status === "อนุมัติแล้ว"
                                      ? "bg-green-600"
                                      : payment.status === "รอดำเนินการ"
                                        ? "bg-yellow-600"
                                        : "bg-red-600"
                                  }
                                >
                                  {payment.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  {/* แก้ไขปุ่ม "ดูหลักฐาน" ในตารางการชำระเงิน ให้เรียกฟังก์ชัน openSlipDialog */}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-blue-500 hover:text-blue-400"
                                    onClick={() => openSlipDialog(payment)}
                                  >
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">ดูหลักฐาน</span>
                                  </Button>
                                  {payment.status === "รอดำเนินการ" && (
                                    <>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-green-500 hover:text-green-400"
                                      >
                                        <Check className="h-4 w-4" />
                                        <span className="sr-only">อนุมัติ</span>
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-500 hover:text-red-400"
                                      >
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">ปฏิเสธ</span>
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className="flex justify-center mt-6">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-gray-700 text-white hover:bg-gray-800 hover:text-blue-500"
                          >
                            <span className="sr-only">หน้าก่อนหน้า</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="m15 18-6-6 6-6" />
                            </svg>
                          </Button>
                          <Button
                            variant="outline"
                            className="border-blue-600 bg-blue-600/10 text-white hover:bg-blue-900/50"
                          >
                            1
                          </Button>
                          <Button
                            variant="outline"
                            className="border-gray-700 text-white hover:bg-gray-800 hover:text-blue-500"
                          >
                            2
                          </Button>
                          <Button
                            variant="outline"
                            className="border-gray-700 text-white hover:bg-gray-800 hover:text-blue-500"
                          >
                            3
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-gray-700 text-white hover:bg-gray-800 hover:text-blue-500"
                          >
                            <span className="sr-only">หน้าถัดไป</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="m9 18 6-6-6-6" />
                            </svg>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* รายงาน */}
                <TabsContent value="reports" className="space-y-6">
                  <h1 className="text-2xl font-bold text-white">รายงานและสถิติ</h1>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-white">รายงานยอดขายรายเดือน</CardTitle>
                        <CardDescription className="text-gray-400">ยอดขายแยกตามเดือนในปีปัจจุบัน</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="h-80 w-full bg-gray-900 rounded-md flex items-center justify-center">
                          <p className="text-gray-400">กราฟแสดงยอดขายรายเดือนจะปรากฏที่นี่</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-white">สคริปต์ยอดนิยม</CardTitle>
                        <CardDescription className="text-gray-400">สคริปต์ที่มียอดขายสูงสุด 10 อันดับแรก</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="h-80 w-full bg-gray-900 rounded-md flex items-center justify-center">
                          <p className="text-gray-400">กราฟแสดงสคริปต์ยอดนิยมจะปรากฏที่นี่</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-white">สรุปรายได้</CardTitle>
                      <CardDescription className="text-gray-400">รายได้ทั้งหมดแยกตามหมวดหมู่และช่วงเวลา</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <Select defaultValue="year">
                          <SelectTrigger className="w-full sm:w-[180px] bg-gray-800 border-gray-700 text-white focus:ring-blue-600">
                            <SelectValue placeholder="เลือกช่วงเวลา" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700 text-white">
                            <SelectItem value="month">เดือนนี้</SelectItem>
                            <SelectItem value="quarter">ไตรมาสนี้</SelectItem>
                            <SelectItem value="year">ปีนี้</SelectItem>
                            <SelectItem value="all">ทั้งหมด</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" className="border-blue-600 text-white hover:bg-blue-900/50">
                          <Download className="mr-2 h-4 w-4" />
                          ดาวน์โหลดรายงาน
                        </Button>
                      </div>
                      <Table>
                        <TableHeader className="bg-gray-900">
                          <TableRow className="border-gray-700 hover:bg-gray-800">
                            <TableHead className="text-gray-400">หมวดหมู่</TableHead>
                            <TableHead className="text-gray-400 text-right">จำนวนสคริปต์</TableHead>
                            <TableHead className="text-gray-400 text-right">ยอดขาย (ชิ้น)</TableHead>
                            <TableHead className="text-gray-400 text-right">รายได้ (บาท)</TableHead>
                            <TableHead className="text-gray-400 text-right">% ของรายได้ทั้งหมด</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {categoryReports.map((report) => (
                            <TableRow key={report.category} className="border-gray-700 hover:bg-gray-800">
                              <TableCell className="text-white font-medium">{report.category}</TableCell>
                              <TableCell className="text-white text-right">{report.scriptCount}</TableCell>
                              <TableCell className="text-white text-right">{report.salesCount}</TableCell>
                              <TableCell className="text-white text-right">
                                ฿{report.revenue.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-white text-right">{report.percentage}%</TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="border-gray-700 bg-gray-900">
                            <TableCell className="text-white font-bold">รวมทั้งหมด</TableCell>
                            <TableCell className="text-white font-bold text-right">48</TableCell>
                            <TableCell className="text-white font-bold text-right">3,721</TableCell>
                            <TableCell className="text-white font-bold text-right">฿152,489</TableCell>
                            <TableCell className="text-white font-bold text-right">100%</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* ตั้งค่าระบบ */}
                <TabsContent value="settings" className="space-y-6">
                  <h1 className="text-2xl font-bold text-white">ตั้งค่าระบบ</h1>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-white">ตั้งค่าทั่วไป</CardTitle>
                      <CardDescription className="text-gray-400">ตั้งค่าพื้นฐานของเว็บไซต์</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white">ชื่อเว็บไซต์</label>
                            <Input
                              defaultValue="FiveM Scripts"
                              className="bg-gray-900 border-gray-700 text-white focus-visible:ring-blue-600"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white">อีเมลติดต่อ</label>
                            <Input
                              defaultValue="admin@fivemscripts.com"
                              className="bg-gray-900 border-gray-700 text-white focus-visible:ring-blue-600"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white">คำอธิบายเว็บไซต์</label>
                          <textarea
                            defaultValue="ร้านค้าสคริปต์ FiveM คุณภาพสูงสำหรับเซิร์ฟเวอร์ของคุณ"
                            className="w-full h-24 px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white">โลโก้เว็บไซต์</label>
                          <div className="flex items-center gap-4">
                            <div className="h-16 w-16 bg-gray-900 border border-gray-700 rounded-md flex items-center justify-center">
                              <Image
                                src="/placeholder.svg?height=64&width=64"
                                alt="โลโก้"
                                width={64}
                                height={64}
                                className="object-contain"
                              />
                            </div>
                            <Button variant="outline" className="border-blue-600 text-white hover:bg-blue-900/50">
                              อัปโหลดโลโก้ใหม่
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-white">ตั้งค่าการชำระเงิน</CardTitle>
                      <CardDescription className="text-gray-400">ตั้งค่าระบบการชำระเงินและพอยท์</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white">อัตราแลกเปลี่ยนพอยท์ (1 USD = ? พอยท์)</label>
                            <Input
                              type="number"
                              defaultValue="100"
                              className="bg-gray-900 border-gray-700 text-white focus-visible:ring-blue-600"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white">โบนัสพอยท์ (% เพิ่มเติมเมื่อซื้อพอยท์)</label>
                            <Input
                              type="number"
                              defaultValue="5"
                              className="bg-gray-900 border-gray-700 text-white focus-visible:ring-blue-600"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white">ช่องทางการชำระเงินที่เปิดใช้งาน</label>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="payment-bank"
                                className="rounded bg-gray-900 border-gray-700 text-blue-600"
                                defaultChecked
                              />
                              <label htmlFor="payment-bank" className="text-white">
                                โอนเงินผ่านธนาคาร
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="payment-promptpay"
                                className="rounded bg-gray-900 border-gray-700 text-blue-600"
                                defaultChecked
                              />
                              <label htmlFor="payment-promptpay" className="text-white">
                                พร้อมเพย์
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="payment-paypal"
                                className="rounded bg-gray-900 border-gray-700 text-blue-600"
                              />
                              <label htmlFor="payment-paypal" className="text-white">
                                PayPal
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="payment-crypto"
                                className="rounded bg-gray-900 border-gray-700 text-blue-600"
                              />
                              <label htmlFor="payment-crypto" className="text-white">
                                คริปโตเคอร์เรนซี
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-white">จัดการผู้ดูแลระบบ</CardTitle>
                      <CardDescription className="text-gray-400">เพิ่มหรือแก้ไขผู้ดูแลระบบ</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <Table>
                          <TableHeader className="bg-gray-900">
                            <TableRow className="border-gray-700 hover:bg-gray-800">
                              <TableHead className="text-gray-400">ชื่อผู้ใช้</TableHead>
                              <TableHead className="text-gray-400">อีเมล</TableHead>
                              <TableHead className="text-gray-400">ระดับสิทธิ์</TableHead>
                              <TableHead className="text-gray-400">วันที่เพิ่ม</TableHead>
                              <TableHead className="text-gray-400 text-right">การดำเนินการ</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow className="border-gray-700 hover:bg-gray-800">
                              <TableCell className="text-white font-medium">admin</TableCell>
                              <TableCell className="text-gray-400">admin@fivemscripts.com</TableCell>
                              <TableCell className="text-white">ผู้ดูแลระบบหลัก</TableCell>
                              <TableCell className="text-gray-400">01/01/2023</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-blue-500 hover:text-blue-400"
                                >
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">แก้ไข</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                            <TableRow className="border-gray-700 hover:bg-gray-800">
                              <TableCell className="text-white font-medium">moderator</TableCell>
                              <TableCell className="text-gray-400">mod@fivemscripts.com</TableCell>
                              <TableCell className="text-white">ผู้ดูแล</TableCell>
                              <TableCell className="text-gray-400">15/03/2023</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-blue-500 hover:text-blue-400"
                                  >
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">แก้ไข</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-500 hover:text-red-400"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">ลบ</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        <Button className="bg-blue-600 text-white hover:bg-blue-700">
                          <Plus className="mr-2 h-4 w-4" />
                          เพิ่มผู้ดูแลระบบใหม่
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-end gap-4">
                    <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                      ยกเลิก
                    </Button>
                    <Button className="bg-blue-600 text-white hover:bg-blue-700">บันทึกการตั้งค่า</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <footer className="w-full border-t border-gray-800 bg-black py-6">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
          <p className="text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} FiveM Scripts สงวนลิขสิทธิ์ - แดชบอร์ดแอดมิน
          </p>
        </div>
      </footer>

      {selectedPayment && (
        <PaymentDetail
          payment={selectedPayment}
          open={showSlipDialog}
          onOpenChange={setShowSlipDialog}
          onApprove={approvePayment}
          onReject={rejectPayment}
        />
      )}
    </div>
  )
}

// Sample data for admin dashboard
const recentOrders = [
  {
    id: "ORD-7829",
    user: "จอห์น โด",
    product: "ระบบโรงรถขั้นสูง",
    price: 2499,
    status: "เสร็จสิ้น",
  },
  {
    id: "ORD-7830",
    user: "เจน สมิธ",
    product: "ระบบธนาคารขั้นสูง",
    price: 2799,
    status: "กำลังดำเนินการ",
  },
  {
    id: "ORD-7831",
    user: "โรเบิร์ต จอห์นสัน",
    product: "งานตำรวจที่สมบูรณ์",
    price: 3499,
    status: "เสร็จสิ้น",
  },
  {
    id: "ORD-7832",
    user: "มาร์ค วิลสัน",
    product: "ระบบที่อยู่อาศัยแบบไดนามิก",
    price: 2999,
    status: "ยกเลิก",
  },
  {
    id: "ORD-7833",
    user: "ซาร่า ลี",
    product: "ระบบโทรศัพท์แบบโต้ตอบ",
    price: 3999,
    status: "กำลังดำเนินการ",
  },
]

const pendingPayments = [
  {
    id: "PAY-4521",
    user: "ซาร่า ลี",
    amount: 50.0,
    points: 5000,
  },
  {
    id: "PAY-4522",
    user: "เดวิด บราวน์",
    amount: 25.0,
    points: 2500,
  },
  {
    id: "PAY-4523",
    user: "ลิซ่า วอง",
    amount: 10.0,
    points: 1000,
  },
  {
    id: "PAY-4520",
    user: "จอห์น โด",
    date: "15/06/2023",
    transactionId: "TRX-78945",
    amount: 10.0,
    points: 1000,
    status: "อนุมัติแล้ว",
    note: "โอนผ่านธนาคารกรุงเทพ",
  },
  {
    id: "PAY-4519",
    user: "เจน สมิธ",
    date: "10/06/2023",
    transactionId: "TRX-78944",
    amount: 5.0,
    points: 500,
    status: "อนุมัติแล้ว",
    note: "โอนผ่านพร้อมเพย์",
  },
]

const categoryReports = [
  {
    category: "ยานพาหนะ",
    scriptCount: 8,
    salesCount: 982,
    revenue: 42500,
    percentage: 27.9,
  },
  {
    category: "อาชีพ",
    scriptCount: 12,
    salesCount: 1245,
    revenue: 56780,
    percentage: 37.2,
  },
  {
    category: "ที่อยู่อาศัย",
    scriptCount: 5,
    salesCount: 520,
    revenue: 18750,
    percentage: 12.3,
  },
  {
    category: "หลัก",
    scriptCount: 7,
    salesCount: 425,
    revenue: 12450,
    percentage: 8.2,
  },
  {
    category: "อาชญากรรม",
    scriptCount: 6,
    salesCount: 320,
    revenue: 9800,
    percentage: 6.4,
  },
  {
    category: "เศรษฐกิจ",
    scriptCount: 4,
    salesCount: 180,
    revenue: 7209,
    percentage: 4.7,
  },
  {
    category: "การสื่อสาร",
    scriptCount: 6,
    salesCount: 49,
    revenue: 5000,
    percentage: 3.3,
  },
]

const users = [
  {
    id: "USR-1024",
    username: "จอห์น โด",
    email: "john.doe@example.com",
    joinDate: "15/05/2023",
    points: 7500,
    status: "ใช้งาน",
  },
  {
    id: "USR-1025",
    username: "เจน สมิธ",
    email: "jane.smith@example.com",
    joinDate: "22/05/2023",
    points: 4200,
    status: "ใช้งาน",
  },
  {
    id: "USR-1026",
    username: "โรเบิร์ต จอห์นสัน",
    email: "robert.johnson@example.com",
    joinDate: "01/06/2023",
    points: 9800,
    status: "ระงับ",
  },
  {
    id: "USR-1027",
    username: "มาร์ค วิลสัน",
    email: "mark.wilson@example.com",
    joinDate: "10/06/2023",
    points: 2900,
    status: "ใช้งาน",
  },
  {
    id: "USR-1028",
    username: "ซาร่า ลี",
    email: "sara.lee@example.com",
    joinDate: "18/06/2023",
    points: 6100,
    status: "ใช้งาน",
  },
]

const scripts = [
  {
    id: "SCR-2048",
    title: "ระบบโรงรถขั้นสูง",
    category: "ยานพาหนะ",
    version: "2.5",
    price: 2499,
    sales: 320,
    status: "เผยแพร่",
  },
  {
    id: "SCR-2049",
    title: "ระบบธนาคารขั้นสูง",
    category: "เศรษฐกิจ",
    version: "1.8",
    price: 2799,
    sales: 285,
    status: "เผยแพร่",
  },
  {
    id: "SCR-2050",
    title: "งานตำรวจที่สมบูรณ์",
    category: "อาชีพ",
    version: "3.1",
    price: 3499,
    sales: 410,
    status: "เผยแพร่",
  },
  {
    id: "SCR-2051",
    title: "ระบบที่อยู่อาศัยแบบไดนามิก",
    category: "ที่อยู่อาศัย",
    version: "1.2",
    price: 2999,
    sales: 255,
    status: "เผยแพร่",
  },
  {
    id: "SCR-2052",
    title: "ระบบโทรศัพท์แบบโต้ตอบ",
    category: "การสื่อสาร",
    version: "2.0",
    price: 3999,
    sales: 190,
    status: "เผยแพร่",
  },
]

const orders = [
  {
    id: "ORD-7829",
    user: "จอห์น โด",
    product: "ระบบโรงรถขั้นสูง",
    date: "20/06/2023",
    price: 2499,
    status: "เสร็จสิ้น",
  },
  {
    id: "ORD-7830",
    user: "เจน สมิธ",
    product: "ระบบธนาคารขั้นสูง",
    date: "21/06/2023",
    price: 2799,
    status: "กำลังดำเนินการ",
  },
  {
    id: "ORD-7831",
    user: "โรเบิร์ต จอห์นสัน",
    product: "งานตำรวจที่สมบูรณ์",
    date: "22/06/2023",
    price: 3499,
    status: "เสร็จสิ้น",
  },
  {
    id: "ORD-7832",
    user: "มาร์ค วิลสัน",
    product: "ระบบที่อยู่อาศัยแบบไดนามิก",
    date: "23/06/2023",
    price: 2999,
    status: "ยกเลิก",
  },
  {
    id: "ORD-7833",
    user: "ซาร่า ลี",
    product: "ระบบโทรศัพท์แบบโต้ตอบ",
    date: "24/06/2023",
    price: 3999,
    status: "กำลังดำเนินการ",
  },
]

const payments = [
  {
    id: "PAY-4515",
    user: "จอห์น โด",
    date: "25/06/2023",
    transactionId: "TRX-98765",
    amount: 20.0,
    points: 2000,
    status: "รอดำเนินการ",
    note: "โอนผ่านธนาคาร",
  },
  {
    id: "PAY-4516",
    user: "เจน สมิธ",
    date: "26/06/2023",
    transactionId: "TRX-98766",
    amount: 15.0,
    points: 1500,
    status: "รอดำเนินการ",
    note: "โอนผ่านพร้อมเพย์",
  },
  {
    id: "PAY-4517",
    user: "โรเบิร์ต จอห์นสัน",
    date: "27/06/2023",
    transactionId: "TRX-98767",
    amount: 30.0,
    points: 3000,
    status: "อนุมัติแล้ว",
    note: "โอนผ่านธนาคาร",
  },
  {
    id: "PAY-4518",
    user: "มาร์ค วิลสัน",
    date: "28/06/2023",
    transactionId: "TRX-98768",
    amount: 25.0,
    points: 2500,
    status: "ปฏิเสธ",
    note: "หลักฐานไม่ถูกต้อง",
  },
  {
    id: "PAY-4519",
    user: "ซาร่า ลี",
    date: "29/06/2023",
    transactionId: "TRX-98769",
    amount: 10.0,
    points: 1000,
    status: "รอดำเนินการ",
    note: "โอนผ่านพร้อมเพย์",
  },
]

