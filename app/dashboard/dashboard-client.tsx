"use client"

import { TabsTrigger, TabsList, Tabs, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Download, Package, Settings, User, CreditCard, Wallet, Shield } from "lucide-react"
import PaymentSlipUploader from "./payment-slip"
import PaymentHistory from "./payment-history"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"

interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  points: number
  role: string
  discordId?: string
}

interface Script {
  id: string
  title: string
  version: string
  hasUpdate: boolean
  purchaseDate: string
  image: string
  serverIp: string
  isActive: boolean
  lastActive: string | null
  resourceName: string
  scriptId: string
}

interface ServerIp {
  _id: string
  userId: string
  resourceName: string
  ipAddress: string
  isActive: boolean
  lastActive: string | null
  createdAt: string
  updatedAt: string
}

interface Payment {
  id: string
  date: string
  transactionId: string
  amount: number
  points: number
  status: string
  note?: string
  adminNote?: string
}

interface PointsTransaction {
  id: string
  date: string
  description: string
  amount: number
  balance: number
}

interface Order {
  id: string
  date: string
  product: string
  amount: number
  status: string
}

interface PointsPackage {
  points: number
  price: number
  bonus: number
}

interface DashboardClientProps {
  user: User
  tab: string
  purchases: Script[]
  serverIps: ServerIp[]
  payments: Payment[]
  pointsTransactions: PointsTransaction[]
  orders: Order[]
  paymentSubmissions: Payment[]
  pointsPackages: PointsPackage[]
}

const formSchema = z.object({
  ipAddress: z.string().min(7, "IP ต้องมีความยาวอย่างน้อย 7 ตัวอักษร").max(15, "IP ต้องมีความยาวไม่เกิน 15 ตัวอักษร")
})

export default function DashboardClient({
  user,
  tab,
  purchases,
  serverIps,
  payments,
  pointsTransactions,
  orders,
  paymentSubmissions,
  pointsPackages,
}: DashboardClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState(tab || "overview")
  const [selectedScript, setSelectedScript] = useState<Script | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ipAddress: "",
    },
  })

  useEffect(() => {
    const currentTab = searchParams.get("tab")
    setActiveTab(currentTab || "overview")
  }, [searchParams])

  const handleTabChange = (value: string) => {
    router.push(`/dashboard?tab=${value}`)
    setActiveTab(value)
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!selectedScript?.scriptId) {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่พบข้อมูลสคริปต์ กรุณาลองใหม่อีกครั้ง",
          variant: "destructive",
        })
        return
      }

      const response = await fetch("/api/server-ips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scriptId: selectedScript.scriptId,
          ipAddress: values.ipAddress,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update server IP")
      }

      // Update the script's serverIp in the local state
      const updatedPurchases = purchases.map(script => {
        if (script.id === selectedScript.id) {
          return {
            ...script,
            serverIp: values.ipAddress,
            isActive: false,
            lastActive: null
          }
        }
        return script
      })

      // Force a page refresh to get the latest data
      router.refresh()

      toast({
        title: "อัพเดท IP สำเร็จ",
        description: "กรุณารอการยืนยันจากระบบ",
      })

      setIsSettingsOpen(false)
    } catch (error) {
      console.error("Error updating server IP:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัพเดท IP ได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-white">แดชบอร์ด</h2>
      </div>
      <Tabs value={activeTab} className="space-y-4" onValueChange={handleTabChange}>
        <TabsList className="bg-gray-800 border border-gray-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400">ภาพรวม</TabsTrigger>
          <TabsTrigger value="purchases" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400">สคริปต์ที่ซื้อ</TabsTrigger>
          <TabsTrigger value="payment" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400">เติมเงิน</TabsTrigger>
          <TabsTrigger value="server-config" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400">ตั้งค่า</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">พอยท์คงเหลือ</CardTitle>
                <Wallet className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{user.points || 0}</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">สคริปต์ที่ซื้อ</CardTitle>
                <Package className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{purchases.length}</div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">การซื้อล่าสุด</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-400">รหัสคำสั่งซื้อ</TableHead>
                      <TableHead className="text-gray-400">วันที่</TableHead>
                      <TableHead className="text-gray-400">สินค้า</TableHead>
                      <TableHead className="text-gray-400 text-right">จำนวนเงิน</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.slice(0, 5).map((order) => (
                      <TableRow key={order.id} className="border-gray-700">
                        <TableCell className="text-gray-300">{order.id}</TableCell>
                        <TableCell className="text-gray-300">{order.date}</TableCell>
                        <TableCell className="text-gray-300">{order.product}</TableCell>
                        <TableCell className="text-gray-300 text-right">
                          {order.amount.toLocaleString()} บาท
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card className="col-span-3 bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">การทำรายการพอยท์</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-400">วันที่</TableHead>
                      <TableHead className="text-gray-400">รายการ</TableHead>
                      <TableHead className="text-gray-400 text-right">จำนวน</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pointsTransactions.slice(0, 5).map((transaction) => (
                      <TableRow key={transaction.id} className="border-gray-700">
                        <TableCell className="text-gray-300">{transaction.date}</TableCell>
                        <TableCell className="text-gray-300">{transaction.description}</TableCell>
                        <TableCell className="text-gray-300 text-right">
                          {transaction.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="purchases" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {purchases.map((script) => (
              <Card key={script.id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <Image
                    src={script.image}
                    alt={script.title}
                    width={600}
                    height={400}
                    className="rounded-lg object-cover"
                  />
                  <CardTitle className="mt-4 text-white">{script.title}</CardTitle>
                  <CardDescription className="text-gray-400">
                    เวอร์ชัน {script.version}
                    {script.hasUpdate && (
                      <Badge variant="destructive" className="ml-2">
                        มีอัพเดท
                      </Badge>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">วันที่ซื้อ</span>
                      <span className="text-gray-300">{script.purchaseDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">IP เซิร์ฟเวอร์</span>
                      <span className="text-gray-300">{script.serverIp || "ยังไม่ได้ตั้งค่า"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">สถานะ</span>
                      <Badge variant={script.isActive ? "default" : "secondary"} className={script.isActive ? "bg-green-600" : ""}>
                        {script.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    {script.lastActive && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">ใช้งานล่าสุด</span>
                        <span className="text-gray-300">{script.lastActive}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Download className="mr-2 h-4 w-4" />
                    ดาวน์โหลด
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
                    onClick={() => {
                      setSelectedScript(script)
                      setIsSettingsOpen(true)
                      form.setValue("ipAddress", script.serverIp || "")
                    }}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    ตั้งค่า
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="payment">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">เติมพอยท์</CardTitle>
                <CardDescription className="text-gray-400">อัพโหลดสลิปการโอนเงินเพื่อเติมพอยท์</CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentSlipUploader />
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">ประวัติการเติมพอยท์</CardTitle>
                <CardDescription className="text-gray-400">รายการเติมพอยท์ทั้งหมดของคุณ</CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentHistory payments={payments} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="server-config">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">ตั้งค่าบัญชี</CardTitle>
              <CardDescription className="text-gray-400">จัดการการตั้งค่าบัญชีของคุณ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-white">IP เซิร์ฟเวอร์</h3>
                <p className="text-sm text-gray-400">
                  ตั้งค่า IP เซิร์ฟเวอร์สำหรับสคริปต์ของคุณ
                </p>
                {serverIps.map((ip, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={ip.ipAddress}
                      className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-300 ring-offset-background"
                      readOnly
                    />
                    <Badge variant={ip.isActive ? "default" : "secondary"} className={ip.isActive ? "bg-green-600" : ""}>
                      {ip.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                ))}
              </div>
              <Separator className="bg-gray-700" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-white">ข้อมูลส่วนตัว</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">อีเมล</span>
                    <span className="text-gray-300">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">ชื่อผู้ใช้</span>
                    <span className="text-gray-300">{user.name}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">ตั้งค่า IP เซิร์ฟเวอร์</DialogTitle>
            <DialogDescription className="text-gray-400">
              กรอก IP เซิร์ฟเวอร์ FiveM ของคุณเพื่อใช้งานสคริปต์
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="ipAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">IP เซิร์ฟเวอร์</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="กรอก IP เซิร์ฟเวอร์" 
                        {...field} 
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsSettingsOpen(false)}
                  className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  ยกเลิก
                </Button>
                <Button 
                  type="submit"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  บันทึก
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 