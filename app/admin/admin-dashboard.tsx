"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit, Trash2, Check, X, Eye, Download } from "lucide-react"

interface User {
  id: string
  email: string
  name: string
  points: number
  role: string
  createdAt: string
}

interface Payment {
  id: string
  userId: string
  amount: number
  points: number
  status: string
  transactionId: string
  note: string
  adminNote: string
  createdAt: string
}

interface Script {
  id: string
  title: string
  price: number
  status: string
  resourceName: string
  createdAt: string
}

interface AdminDashboardProps {
  users: User[]
  payments: Payment[]
  scripts: Script[]
}

export default function AdminDashboard({ users, payments, scripts }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("users")

  return (
    <div className="container py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">แดชบอร์ดแอดมิน</h1>
          <TabsList className="bg-gray-800">
            <TabsTrigger value="users" className="data-[state=active]:bg-blue-600">
              จัดการผู้ใช้
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-blue-600">
              การชำระเงิน
            </TabsTrigger>
            <TabsTrigger value="scripts" className="data-[state=active]:bg-blue-600">
              สคริปต์
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="ค้นหาผู้ใช้..."
                className="pl-8 bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              เพิ่มผู้ใช้ใหม่
            </Button>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <Table>
                <TableHeader className="bg-gray-900">
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-400">ชื่อผู้ใช้</TableHead>
                    <TableHead className="text-gray-400">อีเมล</TableHead>
                    <TableHead className="text-gray-400">พอยท์</TableHead>
                    <TableHead className="text-gray-400">สิทธิ์</TableHead>
                    <TableHead className="text-gray-400">วันที่สมัคร</TableHead>
                    <TableHead className="text-gray-400 text-right">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="border-gray-700">
                      <TableCell className="text-white">{user.name}</TableCell>
                      <TableCell className="text-gray-400">{user.email}</TableCell>
                      <TableCell className="text-white">{user.points}</TableCell>
                      <TableCell>
                        <Badge className={user.role === "ADMIN" ? "bg-red-600" : "bg-blue-600"}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-400">{user.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="ค้นหาการชำระเงิน..."
                className="pl-8 bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <Table>
                <TableHeader className="bg-gray-900">
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-400">รหัส</TableHead>
                    <TableHead className="text-gray-400">จำนวนเงิน</TableHead>
                    <TableHead className="text-gray-400">พอยท์</TableHead>
                    <TableHead className="text-gray-400">สถานะ</TableHead>
                    <TableHead className="text-gray-400">วันที่</TableHead>
                    <TableHead className="text-gray-400">หมายเหตุ</TableHead>
                    <TableHead className="text-gray-400 text-right">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id} className="border-gray-700">
                      <TableCell className="text-white font-medium">#{payment.id.slice(-6)}</TableCell>
                      <TableCell className="text-white">{payment.amount} บาท</TableCell>
                      <TableCell className="text-white">{payment.points}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            payment.status === "COMPLETED"
                              ? "bg-green-600"
                              : payment.status === "PENDING"
                              ? "bg-yellow-600"
                              : "bg-red-600"
                          }
                        >
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-400">{payment.createdAt}</TableCell>
                      <TableCell className="text-gray-400">{payment.note}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {payment.status === "PENDING" && (
                            <>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500">
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scripts Tab */}
        <TabsContent value="scripts" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="ค้นหาสคริปต์..."
                className="pl-8 bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              เพิ่มสคริปต์ใหม่
            </Button>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <Table>
                <TableHeader className="bg-gray-900">
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-400">ชื่อสคริปต์</TableHead>
                    <TableHead className="text-gray-400">Resource Name</TableHead>
                    <TableHead className="text-gray-400">ราคา</TableHead>
                    <TableHead className="text-gray-400">สถานะ</TableHead>
                    <TableHead className="text-gray-400">วันที่เพิ่ม</TableHead>
                    <TableHead className="text-gray-400 text-right">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scripts.map((script) => (
                    <TableRow key={script.id} className="border-gray-700">
                      <TableCell className="text-white">{script.title}</TableCell>
                      <TableCell className="text-gray-400">{script.resourceName}</TableCell>
                      <TableCell className="text-white">{script.price} พอยท์</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            script.status === "ACTIVE" ? "bg-green-600" : "bg-yellow-600"
                          }
                        >
                          {script.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-400">{script.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 