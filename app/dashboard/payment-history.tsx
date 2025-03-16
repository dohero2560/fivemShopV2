"use client"

import { useState } from "react"
import Image from "next/image"
import { Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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

interface PaymentHistoryProps {
  payments: Payment[]
}

export default function PaymentHistory({ payments }: PaymentHistoryProps) {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)

  const openDetailDialog = (payment: Payment) => {
    setSelectedPayment(payment)
    setShowDetailDialog(true)
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-white">ประวัติการชำระเงิน</CardTitle>
        <CardDescription className="text-gray-400">ประวัติการชำระเงินและสถานะการเติมพอยท์ของคุณ</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <Table>
          <TableHeader className="bg-gray-900">
            <TableRow className="border-gray-700 hover:bg-gray-800">
              <TableHead className="text-gray-400">รหัส</TableHead>
              <TableHead className="text-gray-400">วันที่</TableHead>
              <TableHead className="text-gray-400">รหัสธุรกรรม</TableHead>
              <TableHead className="text-gray-400 text-right">จำนวนเงิน</TableHead>
              <TableHead className="text-gray-400 text-right">พอยท์</TableHead>
              <TableHead className="text-gray-400 text-right">ช่องทาง</TableHead>
              <TableHead className="text-gray-400 text-right">สถานะ</TableHead>
              <TableHead className="text-gray-400 text-right">การดำเนินการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id} className="border-gray-700 hover:bg-gray-800">
                <TableCell className="text-white font-medium">#{payment.id}</TableCell>
                <TableCell className="text-gray-400">{payment.date}</TableCell>
                <TableCell className="text-gray-400">{payment.transactionId}</TableCell>
                <TableCell className="text-white text-right">${payment.amount}</TableCell>
                <TableCell className="text-white text-right">{payment.points}</TableCell>
                <TableCell className="text-gray-400">
                  {payment.paymentMethod === 'bank' && 'โอนผ่านธนาคาร'}
                  {payment.paymentMethod === 'qr-bank' && 'พร้อมเพย์'}
                  {payment.paymentMethod === 'truemoney' && 'TrueMoney Wallet'}
                </TableCell>
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-500 hover:text-blue-400"
                    onClick={() => openDetailDialog(payment)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">ดูรายละเอียด</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {selectedPayment && (
          <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
            <DialogContent className="bg-gray-800 border-gray-700 text-white sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>รายละเอียดการชำระเงิน</DialogTitle>
                <DialogDescription className="text-gray-400">รหัสการชำระเงิน #{selectedPayment.id}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="bg-gray-900 p-4 rounded-md">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">รหัสธุรกรรม:</p>
                      <p className="font-medium">{selectedPayment.transactionId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">วันที่ชำระเงิน:</p>
                      <p className="font-medium">{selectedPayment.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">จำนวนเงิน:</p>
                      <p className="font-medium">${selectedPayment.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">พอยท์ที่ได้รับ:</p>
                      <p className="font-medium">{selectedPayment.points} พอยท์</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">สถานะ:</p>
                      <Badge
                        className={
                          selectedPayment.status === "อนุมัติแล้ว"
                            ? "bg-green-600"
                            : selectedPayment.status === "รอดำเนินการ"
                              ? "bg-yellow-600"
                              : "bg-red-600"
                        }
                      >
                        {selectedPayment.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 p-4 rounded-md">
                  <p className="text-sm text-gray-400 mb-2">รูปภาพสลิปการโอนเงิน:</p>
                  <div className="flex justify-center bg-black p-2 rounded-md">
                    {selectedPayment?.slipImage ? (
                      <div className="relative w-full max-w-[200px] h-[300px]">
                        <Image
                          src={`data:image/jpeg;base64,${selectedPayment.slipImage}`}
                          alt="สลิปการโอนเงิน"
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4">
                        <p className="text-gray-500">ไม่พบรูปภาพสลิป</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-900 p-4 rounded-md">
                  <p className="text-sm text-gray-400 mb-2">หมายเหตุจากคุณ:</p>
                  <p className="text-sm">{selectedPayment.note || "ไม่มีหมายเหตุ"}</p>
                </div>

                {selectedPayment.adminNote && (
                  <div className="bg-gray-900 p-4 rounded-md">
                    <p className="text-sm text-gray-400 mb-2">หมายเหตุจากแอดมิน:</p>
                    <p className="text-sm">{selectedPayment.adminNote}</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  )
}

