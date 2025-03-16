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
import { Label } from "@/components/ui/label"

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
  slipImage?: string
  paymentMethod: string
}

interface PointsTransaction {
  id: string
  date: string
  description: string
  amount: number
  balance: number
  type: string
  status: string
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

const getPaymentMethodText = (method: string) => {
  switch (method) {
    case 'bank':
      return 'โอนผ่านธนาคาร'
    case 'qr-bank':
      return 'พร้อมเพย์'
    case 'truemoney':
      return 'TrueMoney Wallet'
    default:
      return ''
  }
}

const PaymentMethodDialog = ({ 
  open, 
  onOpenChange,
  onConfirm,
  amount 
}: { 
  open: boolean, 
  onOpenChange: (open: boolean) => void,
  onConfirm: (method: string) => void,
  amount: number
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">เลือกช่องทางการชำระเงิน</DialogTitle>
          <DialogDescription className="text-gray-400">
            ยอดชำระ: {amount.toLocaleString()} บาท
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div 
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${
              selectedMethod === 'bank' 
                ? 'border-green-500 bg-green-900/20' 
                : 'border-gray-700 hover:border-gray-600 hover:bg-green-900/10'
            }`}
            onClick={() => setSelectedMethod('bank')}
          >
            <div className="flex items-center space-x-4">
              <div className="bg-green-900/30 p-2 rounded-lg">
                <Image
                  src="/icons/bankicon.png"
                  alt="Bank Icon"
                  width={24}
                  height={24}
                  className="text-gray-400"
                />
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">{getPaymentMethodText('bank')}</h4>
                <p className="text-sm text-gray-400">โอนเงินผ่านบัญชีธนาคารโดยตรง</p>
              </div>
            </div>
            {selectedMethod === 'bank' && (
              <div className="mt-4 p-4 bg-gray-900 rounded-lg">
                <p className="text-sm text-gray-300 space-y-1">
                  <span className="block">ธนาคาร: กสิกรไทย</span>
                  <span className="block">เลขบัญชี: xxx-x-xxxxx-x</span>
                  <span className="block">ชื่อบัญชี: John Doe</span>
                </p>
              </div>
            )}
          </div>

          <div 
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${
              selectedMethod === 'qr-bank' 
                ? 'border-blue-500 bg-blue-900/20' 
                : 'border-gray-700 hover:border-gray-600 hover:bg-blue-900/10'
            }`}
            onClick={() => setSelectedMethod('qr-bank')}
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-900/30 p-2 rounded-lg">
                <Image
                  src="/icons/ThaiQR.jpg"
                  alt="QR Code Icon"
                  width={24}
                  height={24}
                  className="text-gray-400"
                />
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">{getPaymentMethodText('qr-bank')}</h4>
                <p className="text-sm text-gray-400">สแกน QR Code เพื่อโอนเงินผ่านแอพธนาคาร</p>
              </div>
            </div>
            {selectedMethod === 'qr-bank' && (
              <div className="mt-4 flex flex-col items-center space-y-4">
                <Image
                  src="/images/promptpay-qr.png"
                  alt="PromptPay QR Code"
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
                <p className="text-sm text-gray-400">สแกนเพื่อชำระเงินผ่านพร้อมเพย์</p>
              </div>
            )}
          </div>

          <div 
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${
              selectedMethod === 'truemoney' 
                ? 'border-red-500 bg-red-900/20' 
                : 'border-gray-700 hover:border-gray-600 hover:bg-red-900/10'
            }`}
            onClick={() => setSelectedMethod('truemoney')}
          >
            <div className="flex items-center space-x-4">
              <div className="bg-red-900/30 p-2 rounded-lg">
                <Image
                  src="/icons/truemoney-walleticon.png"
                  alt="TrueMoney Wallet Icon"
                  width={24}
                  height={24}
                  className="text-gray-400"
                />
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">{getPaymentMethodText('truemoney')}</h4>
                <p className="text-sm text-gray-400">โอนเงินด้วย TrueMoney Wallet</p>
              </div>
            </div>
            {selectedMethod === 'truemoney' && (
              <div className="mt-4 flex flex-col items-center space-y-4">
                <Image
                  src="/images/truemoneywallet-qr.png"
                  alt="TrueMoney Wallet QR Code"
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
                <p className="text-sm text-gray-400">สแกนเพื่อชำระเงินผ่าน TrueMoney Wallet</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            ปิด
          </Button>
          {selectedMethod && (
            <Button
              onClick={() => {
                onOpenChange(false)
                onConfirm(selectedMethod)
              }}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              ยืนยันการชำระเงิน
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

const PaymentUploadDialog = ({ 
  open, 
  onOpenChange,
  amount,
  paymentMethod 
}: { 
  open: boolean, 
  onOpenChange: (open: boolean) => void,
  amount: number,
  paymentMethod: string
}) => {
  const router = useRouter()

  const displayPaymentMethod = getPaymentMethodText(paymentMethod)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">อัพโหลดสลิป</DialogTitle>
          <DialogDescription className="text-gray-400">
            ยอดชำระ: {amount.toLocaleString()} บาท
            <br />
            ช่องทาง: <Badge variant="default" className="bg-blue-600">{displayPaymentMethod}</Badge>
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <PaymentSlipUploader 
            amount={amount} 
            paymentMethod={paymentMethod}
            onSuccess={() => {
              onOpenChange(false)
              router.refresh()
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

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
  const [amount, setAmount] = useState<number>(0)
  const [isPaymentMethodOpen, setIsPaymentMethodOpen] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('')

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

  const handlePayment = () => {
    if (amount < 1) {
      toast({
        variant: "destructive",
        title: "ข้อผิดพลาด",
        description: "กรุณาระบุจำนวนเงิน"
      })
      return
    }
    setIsPaymentMethodOpen(true)
  }

  const handlePaymentMethodConfirm = (method: string) => {
    setSelectedPaymentMethod(method)
    setIsPaymentMethodOpen(false)
    setIsUploadOpen(true)
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
                      <TableHead className="text-gray-400">สถานะ</TableHead>
                      <TableHead className="text-gray-400 text-right">จำนวน</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pointsTransactions.slice(0, 5).map((transaction) => (
                      <TableRow key={transaction.id} className="border-gray-700">
                        <TableCell className="text-gray-300">{transaction.date}</TableCell>
                        <TableCell className="text-gray-300">{transaction.description}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              transaction.status === "สำเร็จ"
                                ? "default"
                                : transaction.status === "รอดำเนินการ"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-300 text-right">
                          {transaction.type === "เพิ่ม" && "+"}
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
                <CardDescription className="text-gray-400">ระบุจำนวนเงินที่ต้องการเติม</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-white">จำนวนเงิน (บาท)</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="1"
                      value={amount || ''}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="ระบุจำนวนเงิน"
                    />
                  </div>
                  <div className="text-sm text-gray-400">
                    จะได้รับ: {Math.floor(amount)} พอยท์
                    {/* คำนวณโบนัสตามเงื่อนไข */}
                    {amount >= 1000 && (
                      <span className="ml-2">
                        <Badge variant="secondary" className="bg-blue-600">
                          +{Math.floor(amount * 0.1)} โบนัส
                        </Badge>
                      </span>
                    )}
                  </div>
                  <Button
                    onClick={handlePayment}
                    className="w-full bg-blue-600 text-white hover:bg-blue-700"
                    disabled={amount < 1}
                  >
                    เติมเงิน
                  </Button>
                </div>
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

      <PaymentMethodDialog 
        open={isPaymentMethodOpen} 
        onOpenChange={setIsPaymentMethodOpen}
        onConfirm={handlePaymentMethodConfirm}
        amount={amount}
      />
      <PaymentUploadDialog 
        open={isUploadOpen} 
        onOpenChange={setIsUploadOpen}
        amount={amount}
        paymentMethod={selectedPaymentMethod}
      />
    </div>
  )
} 