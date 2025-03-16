"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
  DollarSign,
  Plus,
  Search,
  Trash2,
  ImageIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import UserForm from "./components/user-form"
import ScriptForm from "./components/script-form"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface User {
  _id: string
  name: string
  email: string
  points: number
  role: string
  createdAt: string
  purchasedScripts?: number
}

interface Script {
  _id: string
  title: string
  description: string
  price: number
  category: string
  downloadUrl: string
  imageUrl?: string
  image?: string
  createdAt: string
  status?: "ACTIVE" | "DRAFT"
  sales?: number
  version?: string
  resourceName?: string
}

interface DashboardData {
  users: number
  orders: number
  scripts: number
  revenue: number
}

interface Order {
  _id: string
  userId: string
  userName: string
  scriptId: string
  scriptTitle: string
  price: number
  status: string
  createdAt: string
}

interface Payment {
  _id: string
  userId: string
  userName: string
  amount: number
  method: string
  status: string
  createdAt: string
  slipImage?: string
  paymentMethod: string
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabFromUrl = searchParams.get("tab") || "overview"
  const [activeTab, setActiveTab] = useState(tabFromUrl)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<DashboardData | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [scripts, setScripts] = useState<Script[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isUserFormOpen, setIsUserFormOpen] = useState(false)
  const [isScriptFormOpen, setIsScriptFormOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedScript, setSelectedScript] = useState<Script | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ type: "user" | "script", id: string } | null>(null)
  const [currentTime, setCurrentTime] = useState("")
  const [orders, setOrders] = useState<Order[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [selectedSlip, setSelectedSlip] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/admin/dashboard', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.status === 401) {
          router.push('/login')
          return
        }

        if (response.status === 403) {
          router.push('/')
          return
        }

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data')
        }

        const jsonData = await response.json()
        setData(jsonData)
      } catch (err) {
        console.error('Dashboard error:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [router])

  useEffect(() => {
    const fetchUsers = async () => {
      if (activeTab !== "users") return
      
      try {
        const response = await fetch('/api/admin/users')
        if (!response.ok) throw new Error('Failed to fetch users')
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()
  }, [activeTab])

  useEffect(() => {
    const fetchScripts = async () => {
      if (activeTab !== "scripts") return
      
      try {
        const response = await fetch('/api/admin/scripts')
        if (!response.ok) throw new Error('Failed to fetch scripts')
        const data = await response.json()
        setScripts(data)
      } catch (error) {
        console.error('Error fetching scripts:', error)
      }
    }

    fetchScripts()
  }, [activeTab])

  useEffect(() => {
    // Initial time set
    const updateTime = () => {
      const now = new Date()
      const options: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      }
      setCurrentTime(now.toLocaleTimeString('th-TH', options))
    }
    
    updateTime() // Set initial time
    
    // Update time every second
    const timer = setInterval(updateTime, 1000)
    
    // Cleanup interval on unmount
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const fetchOrders = async () => {
      if (activeTab !== "orders") return
      
      try {
        const response = await fetch('/api/admin/orders')
        if (!response.ok) {
          console.error('Failed to fetch orders:', await response.text())
          return
        }
        const data = await response.json()
        console.log('Fetched orders:', data)
        setOrders(data)
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    }

    fetchOrders()
  }, [activeTab])

  useEffect(() => {
    const fetchPayments = async () => {
      if (activeTab !== "payments") return
      
      try {
        const response = await fetch('/api/admin/payments')
        if (!response.ok) {
          console.error('Failed to fetch payments:', await response.text())
          return
        }
        const data = await response.json()
        setPayments(data)
      } catch (error) {
        console.error('Error fetching payments:', error)
      }
    }

    fetchPayments()
  }, [activeTab])

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredScripts = scripts.filter(script => 
    script.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    script.resourceName?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredOrders = orders?.filter(order => 
    order.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.scriptTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const filteredPayments = payments?.filter(payment => 
    payment.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment._id?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const handleDelete = async () => {
    if (!itemToDelete) return

    try {
      const endpoint = itemToDelete.type === "user" 
        ? `/api/admin/users/${itemToDelete.id}`
        : `/api/admin/scripts/${itemToDelete.id}`

      const response = await fetch(endpoint, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete item')
      }

      toast.success(
        itemToDelete.type === "user" 
          ? "ลบผู้ใช้เรียบร้อย" 
          : "ลบสคริปต์เรียบร้อย"
      )

      // Refresh data
      if (itemToDelete.type === "user") {
        const usersResponse = await fetch('/api/admin/users')
        const usersData = await usersResponse.json()
        setUsers(usersData)
      } else {
        const scriptsResponse = await fetch('/api/admin/scripts')
        const scriptsData = await scriptsResponse.json()
        setScripts(scriptsData)
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      toast.error("เกิดข้อผิดพลาดในการลบข้อมูล")
    } finally {
      setIsDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  const confirmDelete = (type: "user" | "script", id: string) => {
    setItemToDelete({ type, id })
    setIsDeleteDialogOpen(true)
  }

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    router.push(`/admin?tab=${tab}`)
  }

  const handlePaymentAction = async (paymentId: string, action: "approve" | "reject") => {
    try {
      const response = await fetch(`/api/admin/payments/${paymentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      })

      if (!response.ok) {
        throw new Error("Failed to update payment status")
      }

      // Refresh payments data
      const updatedPayments = await fetch('/api/admin/payments').then(res => res.json())
      setPayments(updatedPayments)

      toast.success(
        action === "approve" 
          ? "ยืนยันการชำระเงินสำเร็จ พ้อยท์ถูกเพิ่มให้ผู้ใช้แล้ว" 
          : "ยกเลิกการชำระเงินสำเร็จ"
      )
    } catch (error) {
      console.error('Error updating payment:', error)
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white">Loading dashboard data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="font-bold text-2xl bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                DooDev <span className="text-sm text-white">แอดมิน</span>
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">ผู้ใช้ทั้งหมด</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
                      </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{data?.users || 0}</div>
                <p className="text-xs text-gray-400">คน</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">คำสั่งซื้อ</CardTitle>
                <ShoppingCart className="h-4 w-4 text-green-500" />
                      </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{data?.orders || 0}</div>
                <p className="text-xs text-gray-400">รายการ</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">สคริปต์</CardTitle>
                <Package className="h-4 w-4 text-yellow-500" />
                      </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{data?.scripts || 0}</div>
                <p className="text-xs text-gray-400">รายการ</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">รายได้</CardTitle>
                <DollarSign className="h-4 w-4 text-red-500" />
                      </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">฿{data?.revenue.toLocaleString() || 0}</div>
                <p className="text-xs text-gray-400">บาท</p>
                      </CardContent>
                    </Card>
            </div>

          <div className="mt-8">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
                  <TabsList className="bg-gray-800">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
                      ภาพรวม
                    </TabsTrigger>
                    <TabsTrigger value="users" className="data-[state=active]:bg-blue-600">
                      ผู้ใช้
                    </TabsTrigger>
                <TabsTrigger value="scripts" className="data-[state=active]:bg-blue-600">
                      สคริปต์
                    </TabsTrigger>
                    <TabsTrigger value="orders" className="data-[state=active]:bg-blue-600">
                      คำสั่งซื้อ
                    </TabsTrigger>
                <TabsTrigger value="payments" className="data-[state=active]:bg-blue-600">
                  การชำระเงิน
                </TabsTrigger>
                <TabsTrigger value="reports" className="data-[state=active]:bg-blue-600">
                  รายงาน
                </TabsTrigger>
                  </TabsList>
              <TabsContent value="overview" className="mt-6">
                <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
                  <h3 className="text-lg font-medium text-white mb-4">ภาพรวมระบบ</h3>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-400">สถานะระบบ</p>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-600">ระบบทำงานปกติ</Badge>
                </div>
                          </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-400">อัปเดตล่าสุด</p>
                        <p className="text-sm text-white">{currentTime || "กำลังโหลด..."}</p>
                        </div>
                        </div>
                          </div>
                        </div>
                </TabsContent>

              <TabsContent value="users" className="mt-6">
                <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-lg font-medium text-white">จัดการผู้ใช้</h3>
                      <p className="text-sm text-gray-400 mt-1">จัดการข้อมูลผู้ใช้ทั้งหมดในระบบ</p>
                          </div>
                          <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        setSelectedUser(null)
                        setIsUserFormOpen(true)
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      เพิ่มผู้ใช้
                          </Button>
                        </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                          type="search"
                          placeholder="ค้นหาผู้ใช้..."
                          className="w-full pl-8 py-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="bg-gray-900">
                          ทั้งหมด: {users.length}
                        </Badge>
                        <Badge variant="outline" className="bg-blue-900">
                          ผู้ใช้: {users.filter(user => user.role === "USER").length}
                        </Badge>
                        <Badge variant="outline" className="bg-red-900">
                          แอดมิน: {users.filter(user => user.role === "ADMIN" || user.role === "SUPER_ADMIN").length}
                        </Badge>
                    </div>
                  </div>

                    <div className="rounded-md border border-gray-700">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-gray-700 bg-gray-900">
                            <TableHead className="text-gray-400">ชื่อผู้ใช้</TableHead>
                            <TableHead className="text-gray-400">อีเมล</TableHead>
                            <TableHead className="text-gray-400">พอยท์</TableHead>
                            <TableHead className="text-gray-400">สิทธิ์</TableHead>
                            <TableHead className="text-gray-400">สคริปต์ที่ซื้อ</TableHead>
                            <TableHead className="text-gray-400">วันที่สมัคร</TableHead>
                            <TableHead className="text-gray-400 text-right">จัดการ</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsers.map((user) => (
                            <TableRow key={user._id} className="border-gray-700">
                              <TableCell className="font-medium text-white">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                                    {user.name ? user.name[0].toUpperCase() : "U"}
                                  </div>
                                  {user.name}
                                </div>
                              </TableCell>
                              <TableCell className="text-gray-400">{user.email}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-green-900/30">
                                  {user.points} พอยท์
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 ml-2 text-blue-500 hover:text-blue-400"
                                    onClick={() => {
                                      const newPoints = window.prompt(`กรอกจำนวนพอยท์ใหม่สำหรับ ${user.name}:`, user.points.toString())
                                      if (newPoints !== null) {
                                        const points = parseInt(newPoints)
                                        if (!isNaN(points)) {
                                          fetch(`/api/admin/users/${user._id}/points`, {
                                            method: "PATCH",
                                            headers: {
                                              "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify({ points }),
                                          })
                                          .then(response => {
                                            if (!response.ok) throw new Error("Failed to update points")
                                            return response.json()
                                          })
                                          .then(() => {
                                            toast.success("อัพเดทพอยท์สำเร็จ")
                                            // Refresh users data
                                            fetch('/api/admin/users')
                                              .then(res => res.json())
                                              .then(data => setUsers(data))
                                          })
                                          .catch(error => {
                                            console.error("Error updating points:", error)
                                            toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่")
                                          })
                                        }
                                      }
                                    }}
                                  >
                                    <Settings className="h-4 w-4" />
                                  </Button>
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className={
                                  user.role === "SUPER_ADMIN" ? "bg-red-600" :
                                  user.role === "ADMIN" ? "bg-yellow-600" :
                                  "bg-blue-600"
                                }>
                                  {user.role}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-gray-900">
                                  {user.purchasedScripts || 0} สคริปต์
                                </Badge>
                              </TableCell>
                              <TableCell className="text-gray-400">
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('th-TH', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }) : 'ไม่มีข้อมูล'}
                              </TableCell>
                              <TableCell>
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-blue-500 hover:text-blue-400"
                                    onClick={() => {
                                      setSelectedUser(user)
                                      setIsUserFormOpen(true)
                                    }}
                                  >
                                    <Settings className="h-4 w-4" />
                                  </Button>
                                  {user.role !== "SUPER_ADMIN" && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-500 hover:text-red-400"
                                      onClick={() => confirmDelete("user", user._id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="scripts" className="mt-6">
                <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-lg font-medium text-white">จัดการสคริปต์</h3>
                      <p className="text-sm text-gray-400 mt-1">จัดการสคริปต์ทั้งหมดในระบบ</p>
                    </div>
                          <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        setSelectedScript(null)
                        setIsScriptFormOpen(true)
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      เพิ่มสคริปต์
                          </Button>
                        </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                          type="search"
                          placeholder="ค้นหาสคริปต์..."
                          className="w-full pl-8 py-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="bg-gray-900">
                          ทั้งหมด: {scripts.length}
                        </Badge>
                        <Badge variant="outline" className="bg-green-900">
                          ใช้งาน: {scripts.filter(script => script.status === "ACTIVE").length}
                        </Badge>
                        <Badge variant="outline" className="bg-yellow-900">
                          ร่าง: {scripts.filter(script => script.status === "DRAFT").length}
                        </Badge>
                    </div>
                  </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredScripts.map((script) => (
                        <Card key={script._id} className="bg-gray-900 border-gray-700">
                          <CardHeader className="p-4">
                            <div className="aspect-video relative rounded-md overflow-hidden mb-4">
                              <Image
                                src={script.image || "/placeholder.svg"}
                                alt={script.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-white">{script.title}</CardTitle>
                                <CardDescription className="text-gray-400 mt-1">
                                  {script.description}
                                </CardDescription>
                              </div>
                              <Badge className={
                                script.status === "ACTIVE" ? "bg-green-600" :
                                script.status === "DRAFT" ? "bg-yellow-600" :
                                "bg-gray-600"
                              }>
                                {script.status === "ACTIVE" ? "ใช้งาน" :
                                 script.status === "DRAFT" ? "ร่าง" : script.status}
                                </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-400">ราคา</span>
                                <span className="text-white font-medium">{script.price} พอยท์</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-400">ยอดขาย</span>
                                <span className="text-white font-medium">{script.sales || 0} ครั้ง</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-400">เวอร์ชัน</span>
                                <span className="text-white font-medium">{script.version}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Resource Name</span>
                                <span className="text-white font-medium">{script.resourceName}</span>
                              </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                  <Button
                                    variant="ghost"
                                size="sm"
                                className="text-blue-500 hover:text-blue-400"
                                onClick={() => {
                                  setSelectedScript(script)
                                  setIsScriptFormOpen(true)
                                }}
                              >
                                <Settings className="h-4 w-4 mr-1" />
                                แก้ไข
                                  </Button>
                                  <Button
                                    variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-400"
                                onClick={() => confirmDelete("script", script._id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                ลบ
                                  </Button>
                                </div>
                          </CardContent>
                        </Card>
                      ))}
                        </div>
                      </div>
                </div>
                </TabsContent>

              <TabsContent value="orders" className="mt-6">
                <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
                  <h3 className="text-lg font-medium text-white mb-4">คำสั่งซื้อ</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="relative w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                          type="search"
                          placeholder="ค้นหาคำสั่งซื้อ..."
                          className="w-full pl-8 py-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="rounded-md border border-gray-700">
                      <Table>
                        <TableHeader className="bg-gray-900">
                          <TableRow className="border-gray-700">
                            <TableHead className="text-gray-400">รหัสคำสั่งซื้อ</TableHead>
                            <TableHead className="text-gray-400">ผู้ซื้อ</TableHead>
                            <TableHead className="text-gray-400">สคริปต์</TableHead>
                            <TableHead className="text-gray-400">ราคา</TableHead>
                            <TableHead className="text-gray-400">สถานะ</TableHead>
                            <TableHead className="text-gray-400">วันที่</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredOrders.map((order) => (
                            <TableRow key={order._id} className="border-gray-700">
                              <TableCell className="text-white">{order._id}</TableCell>
                              <TableCell className="text-white">{order.userName || 'ไม่ระบุ'}</TableCell>
                              <TableCell className="text-white">{order.scriptTitle || 'ไม่ระบุ'}</TableCell>
                              <TableCell className="text-white">฿{(order.price || 0).toLocaleString()}</TableCell>
                              <TableCell>
                                <Badge className={
                                  order.status === "COMPLETED" ? "bg-green-600" :
                                  order.status === "PENDING" ? "bg-yellow-600" :
                                  "bg-red-600"
                                }>
                                  {order.status === "COMPLETED" ? "สำเร็จ" :
                                   order.status === "PENDING" ? "รอดำเนินการ" :
                                   "ยกเลิก"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-gray-400">
                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('th-TH') : 'ไม่ระบุ'}
                              </TableCell>
                            </TableRow>
                          ))}
                          {filteredOrders.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center text-gray-400 py-4">
                                ไม่พบข้อมูลคำสั่งซื้อ
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                        </div>
                      </div>
                </div>
                </TabsContent>

              <TabsContent value="payments" className="mt-6">
                <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
                  <h3 className="text-lg font-medium text-white mb-4">การชำระเงิน</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="relative w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                          type="search"
                          placeholder="ค้นหารายการชำระเงิน..."
                          className="w-full pl-8 py-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="rounded-md border border-gray-700">
                      <Table>
                        <TableHeader className="bg-gray-900">
                          <TableRow className="border-gray-700">
                            <TableHead className="text-gray-400">รหัสการชำระเงิน</TableHead>
                            <TableHead className="text-gray-400">ผู้ชำระเงิน</TableHead>
                            <TableHead className="text-gray-400">จำนวนเงิน</TableHead>
                            <TableHead className="text-gray-400">ช่องทางชำระเงิน</TableHead>
                            <TableHead className="text-gray-400">สลิป</TableHead>
                            <TableHead className="text-gray-400">สถานะ</TableHead>
                            <TableHead className="text-gray-400">วันที่</TableHead>
                            <TableHead className="text-gray-400">จัดการ</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredPayments.map((payment) => (
                            <TableRow key={payment._id} className="border-gray-700">
                              <TableCell className="text-white">{payment._id}</TableCell>
                              <TableCell className="text-white">{payment.userName}</TableCell>
                              <TableCell className="text-white">฿{payment.amount.toLocaleString()}</TableCell>
                              <TableCell>
                                <Badge variant={
                                  payment.paymentMethod === 'bank' ? 'default' :
                                  payment.paymentMethod === 'qr-bank' ? 'secondary' :
                                  payment.paymentMethod === 'truemoney' ? 'outline' : 'default'
                                }>
                                  {payment.paymentMethod === 'bank' && 'โอนผ่านธนาคาร'}
                                  {payment.paymentMethod === 'qr-bank' && 'พร้อมเพย์'}
                                  {payment.paymentMethod === 'truemoney' && 'TrueMoney Wallet'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {payment.slipImage ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-blue-500 hover:text-blue-400"
                                    onClick={() => setSelectedSlip(`data:image/jpeg;base64,${payment.slipImage}`)}
                                  >
                                    <ImageIcon className="h-4 w-4 mr-1" />
                                    ดูสลิป
                                  </Button>
                                ) : (
                                  <span className="text-gray-400">ไม่มีสลิป</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge className={
                                  payment.status === "COMPLETED" ? "bg-green-600" :
                                  payment.status === "PENDING" ? "bg-yellow-600" :
                                  "bg-red-600"
                                }>
                                  {payment.status === "COMPLETED" ? "สำเร็จ" :
                                   payment.status === "PENDING" ? "รอตรวจสอบ" :
                                   "ยกเลิก"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-gray-400">
                                {new Date(payment.createdAt).toLocaleDateString('th-TH')}
                              </TableCell>
                              <TableCell>
                                {payment.status === "PENDING" && (
                                  <div className="flex gap-2">
                                      <Button
                                        variant="ghost"
                                      size="sm"
                                      className="text-green-500 hover:text-green-400"
                                      onClick={() => handlePaymentAction(payment._id, "approve")}
                                      disabled={!payment.slipImage}
                                    >
                                      ยืนยัน
                                      </Button>
                                      <Button
                                        variant="ghost"
                                      size="sm"
                                      className="text-red-500 hover:text-red-400"
                                      onClick={() => handlePaymentAction(payment._id, "reject")}
                                      >
                                      ยกเลิก
                                      </Button>
                                </div>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                        </div>
                      </div>
                </div>
                </TabsContent>

              <TabsContent value="reports" className="mt-6">
                <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
                  <h3 className="text-lg font-medium text-white mb-4">รายงาน</h3>
                      <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card className="bg-gray-900 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-white">รายได้รายเดือน</CardTitle>
                      </CardHeader>
                        <CardContent>
                          {/* Monthly revenue chart will be added here */}
                          <div className="h-[200px] flex items-center justify-center text-gray-400">
                            กราฟแสดงรายได้รายเดือน
                        </div>
                      </CardContent>
                    </Card>
                      <Card className="bg-gray-900 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-white">สคริปต์ขายดี</CardTitle>
                      </CardHeader>
                        <CardContent>
                          {/* Top selling scripts chart will be added here */}
                          <div className="h-[200px] flex items-center justify-center text-gray-400">
                            กราฟแสดงสคริปต์ขายดี
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                      </div>
                  </div>
                </TabsContent>
              </Tabs>
                          </div>
                          </div>
      </main>

      {/* Forms */}
      <UserForm
        isOpen={isUserFormOpen}
        onClose={() => setIsUserFormOpen(false)}
        user={selectedUser || undefined}
        onSuccess={() => {
          setSelectedUser(null)
          if (activeTab === "users") {
            // Refresh users data
            fetch('/api/admin/users')
              .then(res => res.json())
              .then(data => setUsers(data))
              .catch(error => console.error('Error fetching users:', error))
          }
        }}
      />

      <ScriptForm
        isOpen={isScriptFormOpen}
        onClose={() => setIsScriptFormOpen(false)}
        script={selectedScript || undefined}
        onSuccess={() => {
          setSelectedScript(null)
          setIsScriptFormOpen(false)
          // Refresh scripts data
          fetch('/api/admin/scripts')
            .then(res => res.json())
            .then(data => setScripts(data))
            .catch(error => console.error('Error fetching scripts:', error))
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-800 text-white border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              {itemToDelete?.type === "user" 
                ? "คุณแน่ใจหรือไม่ที่จะลบผู้ใช้นี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้"
                : "คุณแน่ใจหรือไม่ที่จะลบสคริปต์นี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
              ยกเลิก
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={handleDelete}
            >
              ลบ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Slip Image Modal */}
      <Dialog open={!!selectedSlip} onOpenChange={() => setSelectedSlip(null)}>
        <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">สลิปการโอนเงิน</DialogTitle>
          </DialogHeader>
          {selectedSlip && (
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={selectedSlip}
                alt="สลิปการโอนเงิน"
                fill
                className="object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

