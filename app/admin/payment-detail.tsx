"use client"

import { useState } from "react"
import Image from "next/image"
import { Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

type PaymentDetailProps = {
  payment: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove: (id: string, note: string) => void
  onReject: (id: string, note: string) => void
}

export default function PaymentDetail({ payment, open, onOpenChange, onApprove, onReject }: PaymentDetailProps) {
  const [adminNote, setAdminNote] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleApprove = () => {
    setIsProcessing(true)
    // จำลองการประมวลผล
    setTimeout(() => {
      onApprove(payment.id, adminNote)
      setIsProcessing(false)
      setAdminNote("")
    }, 1000)
  }

  const handleReject = () => {
    setIsProcessing(true)
    // จำลองการประมวลผล
    setTimeout(() => {
      onReject(payment.id, adminNote)
      setIsProcessing(false)
      setAdminNote("")
    }, 1000)
  }

  if (!payment) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>ตรวจสอบหลักฐานการชำระเงิน</DialogTitle>
          <DialogDescription className="text-gray-400">
            รหัสการชำระเงิน #{payment.id} - {payment.user}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-900 p-4 rounded-md">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">รหัสธุรกรรม:</p>
                <p className="font-medium">{payment.transactionId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">วันที่ชำระเงิน:</p>
                <p className="font-medium">{payment.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">จำนวนเงิน:</p>
                <p className="font-medium">${payment.amount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">พอยท์ที่จะได้รับ:</p>
                <p className="font-medium">{payment.points} พอยท์</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-4 rounded-md">
            <p className="text-sm text-gray-400 mb-2">รูปภาพสลิปการโอนเงิน:</p>
            <div className="flex justify-center bg-black p-2 rounded-md">
              <Image
                src="/placeholder.svg?height=400&width=300"
                alt="สลิปการโอนเงิน"
                width={300}
                height={400}
                className="object-contain max-h-[400px]"
              />
            </div>
          </div>

          <div className="bg-gray-900 p-4 rounded-md">
            <p className="text-sm text-gray-400 mb-2">หมายเหตุจากผู้ใช้:</p>
            <p className="text-sm">{payment.note || "ไม่มีหมายเหตุจากผู้ใช้"}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-400">หมายเหตุจากแอดมิน (ถ้ามี):</p>
            <Textarea
              placeholder="ระบุหมายเหตุหรือเหตุผลในการอนุมัติ/ปฏิเสธ"
              className="bg-gray-900 border-gray-700 text-white focus-visible:ring-blue-600"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="border-gray-700 text-white hover:bg-gray-800"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            ปิด
          </Button>
          <Button
            variant="outline"
            className="border-red-600 text-red-500 hover:bg-red-900/20"
            onClick={handleReject}
            disabled={isProcessing}
          >
            <X className="mr-2 h-4 w-4" />
            {isProcessing ? "กำลังประมวลผล..." : "ปฏิเสธการชำระเงิน"}
          </Button>
          <Button
            className="bg-green-600 text-white hover:bg-green-700"
            onClick={handleApprove}
            disabled={isProcessing}
          >
            <Check className="mr-2 h-4 w-4" />
            {isProcessing ? "กำลังประมวลผล..." : "อนุมัติการชำระเงิน"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

