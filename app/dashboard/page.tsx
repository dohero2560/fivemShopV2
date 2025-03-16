"use server"

import { TabsTrigger } from "@/components/ui/tabs"
import { TabsList } from "@/components/ui/tabs"
import Link from "next/link"
import Image from "next/image"
import { Download, Package, Settings, User, CreditCard, Wallet, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// เพิ่ม import PaymentSlipUploader
import PaymentSlipUploader from "./payment-slip"

// เพิ่ม import PaymentHistory
import PaymentHistory from "./payment-history"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { requireAuth } from "@/lib/auth"
import DashboardClient from "./dashboard-client"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await searchParams
  const user = await requireAuth()
  const tab = typeof params.tab === 'string' ? params.tab : "overview"
  
  const client = await clientPromise
  const db = client.db()

  // Fetch purchases with script details
  const purchasesData = await db.collection("purchases").aggregate([
    { $match: { userId: user.id } },
    { $lookup: {
        from: "scripts",
        localField: "scriptId",
        foreignField: "_id",
        as: "script"
      }
    },
    { $unwind: "$script" },
    { $sort: { createdAt: -1 } }
  ]).toArray()

  // Fetch server IPs and transform the data
  const serverIpsData = await db.collection("serverIps")
    .find({ userId: user.id })
    .toArray()

  // Transform server IPs data to plain objects
  const transformedServerIps = serverIpsData.map(ip => ({
    _id: ip._id.toString(),
    userId: ip.userId,
    resourceName: ip.resourceName,
    ipAddress: ip.ipAddress,
    isActive: ip.isActive || false,
    lastActive: ip.lastActive ? new Date(ip.lastActive).toLocaleDateString("th-TH") : null,
    createdAt: new Date(ip.createdAt).toISOString(),
    updatedAt: new Date(ip.updatedAt).toISOString()
  }))

  // Create a map of resourceName to serverIp data
  const serverIpMap = transformedServerIps.reduce((acc, ip) => {
    if (ip.resourceName) {
      acc[ip.resourceName] = {
        ipAddress: ip.ipAddress,
        isActive: ip.isActive,
        lastActive: ip.lastActive
      }
    }
    return acc
  }, {} as Record<string, { ipAddress: string, isActive: boolean, lastActive: string | null }>)

  // Transform purchases data to match Script interface
  const purchases = purchasesData.map(purchase => {
    const resourceName = purchase.script.resourceName || purchase.script.title.toLowerCase().replace(/[^a-z0-9]/g, '_')
    const serverIpData = serverIpMap[resourceName]

    return {
      id: purchase._id.toString(),
      scriptId: purchase.scriptId.toString(),
      title: purchase.script.title,
      version: purchase.script.version,
      hasUpdate: purchase.script.hasUpdate || false,
      purchaseDate: new Date(purchase.createdAt).toLocaleDateString("th-TH"),
      image: purchase.script.image || "/placeholder.svg",
      resourceName: resourceName,
      serverIp: serverIpData?.ipAddress || "",
      isActive: serverIpData?.isActive || false,
      lastActive: serverIpData?.lastActive || null,
      versions: purchase.script.versions || []
    }
  })

  // Fetch payments
  const paymentsData = await db.collection("payments")
    .find({ userId: user.id })
    .sort({ createdAt: -1 })
    .toArray()

  // Get points packages from database
  const pointsPackagesData = await db.collection("pointsPackages")
    .find({})
    .sort({ points: 1 })
    .toArray()

  const pointsPackages = pointsPackagesData.length > 0 ? pointsPackagesData : [
    { points: 100, price: 100, bonus: 0 },
    { points: 300, price: 300, bonus: 0 },
    { points: 500, price: 500, bonus: 0 },
    { points: 1000, price: 1000, bonus: 0 },
    { points: 3000, price: 3000, bonus: 0 },
  ]

  // Transform payments data
  const payments = paymentsData.map(payment => ({
    id: payment._id.toString(),
    date: new Date(payment.createdAt).toLocaleDateString("th-TH"),
    transactionId: payment.transactionId,
    amount: payment.amount,
    points: payment.amount, // 1 บาท = 1 พอยท์
    status: payment.status,
    note: payment.note,
    adminNote: payment.adminNote,
    slipImage: payment.slipImage,
    paymentMethod: payment.paymentMethod
  }))

  // Transform payments into orders (การซื้อล่าสุด)
  const orders = payments.map(payment => ({
    id: payment.id,
    date: payment.date,
    product: `เติมเงิน ${payment.amount} บาท`,
    amount: payment.amount,
    status: payment.status === "PENDING" ? "รอดำเนินการ" 
           : payment.status === "COMPLETED" ? "สำเร็จ"
           : payment.status === "REJECTED" ? "ยกเลิก"
           : payment.status
  }))

  // Transform into points transactions (การทำรายการพอยท์)
  const pointsTransactions = payments.map(payment => ({
    id: payment.id,
    date: payment.date,
    description: payment.status === "COMPLETED" 
      ? `เติมพอยท์สำเร็จ +${payment.points} พอยท์`
      : payment.status === "PENDING"
      ? `รอตรวจสอบการเติม ${payment.points} พอยท์`
      : `ยกเลิกการเติม ${payment.points} พอยท์`,
    amount: payment.points,
    type: payment.status === "COMPLETED" ? "เพิ่ม" : "รอดำเนินการ",
    status: payment.status === "PENDING" ? "รอดำเนินการ" 
            : payment.status === "COMPLETED" ? "สำเร็จ"
            : payment.status === "REJECTED" ? "ยกเลิก"
            : payment.status,
    balance: user.points
  }))

  return (
    <DashboardClient 
      user={user}
      tab={tab}
      purchases={purchases}
      serverIps={transformedServerIps}
      payments={payments}
      pointsTransactions={pointsTransactions}
      orders={orders}
      paymentSubmissions={payments}
      pointsPackages={pointsPackages}
    />
  )
}

// Sample data
const purchasedScripts = [
  {
    id: "advanced-garage",
    title: "ระบบโรงรถขั้นสูง",
    version: "v1.2.3",
    hasUpdate: true,
    purchaseDate: "15 มี.ค. 2023",
    image: "/placeholder.svg?height=400&width=600",
    serverIp: "192.168.1.100",
    isVerified: true,
  },
  {
    id: "police-job",
    title: "งานตำรวจที่สมบูรณ์",
    version: "v2.0.1",
    hasUpdate: false,
    purchaseDate: "22 เม.ย. 2023",
    image: "/placeholder.svg?height=400&width=600",
    serverIp: "192.168.1.100",
    isVerified: true,
  },
  {
    id: "housing-system",
    title: "ระบบที่อยู่อาศัยแบบไดนามิก",
    version: "v1.5.0",
    hasUpdate: true,
    purchaseDate: "10 พ.ค. 2023",
    image: "/placeholder.svg?height=400&width=600",
    serverIp: "",
    isVerified: false,
  },
]

const orders = [
  {
    id: "ORD-7829",
    date: "12 มิ.ย. 2023",
    product: "ระบบโรงรถขั้นสูง",
    amount: 2499,
    status: "Completed",
  },
  {
    id: "ORD-6547",
    date: "10 พ.ค. 2023",
    product: "ระบบที่อยู่อาศัยแบบไดนามิก",
    amount: 2999,
    status: "Completed",
  },
  {
    id: "ORD-5321",
    date: "22 เม.ย. 2023",
    product: "งานตำรวจที่สมบูรณ์",
    amount: 3499,
    status: "Completed",
  },
  {
    id: "ORD-4123",
    date: "15 มี.ค. 2023",
    product: "ระบบโรงรถขั้นสูง",
    amount: 2499,
    status: "Completed",
  },
  {
    id: "ORD-3254",
    date: "วันนี้",
    product: "ระบบธนาคาร",
    amount: 2799,
    status: "Processing",
  },
]

// Points packages
const pointsPackages = [
  {
    points: 500,
    price: 5.0,
    bonus: 0,
  },
  {
    points: 1000,
    price: 10.0,
    bonus: 50,
  },
  {
    points: 2500,
    price: 25.0,
    bonus: 250,
  },
  {
    points: 5000,
    price: 50.0,
    bonus: 750,
  },
]

// Payment submissions
const paymentSubmissions = [
  {
    date: "15 มิ.ย. 2023",
    transactionId: "TRX-78945",
    amount: 10.0,
    points: 1000,
    status: "Approved",
  },
  {
    date: "20 พ.ค. 2023",
    transactionId: "TRX-65432",
    amount: 5.0,
    points: 500,
    status: "Approved",
  },
  {
    date: "วันนี้",
    transactionId: "TRX-98765",
    amount: 25.0,
    points: 2500,
    status: "Pending",
  },
]

