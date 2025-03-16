"use client"

import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export interface PaymentSlipUploaderProps {
  amount: number
  paymentMethod: string
  onSuccess?: () => void
}

export default function PaymentSlipUploader({ amount, paymentMethod, onSuccess }: PaymentSlipUploaderProps) {
  const [transactionId, setTransactionId] = useState("")
  const [note, setNote] = useState("")
  const [slipImage, setSlipImage] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!slipImage) {
      toast({
        variant: "destructive",
        title: "ข้อผิดพลาด",
        description: "กรุณาอัพโหลดสลิปการโอนเงิน"
      })
      return
    }

    try {
      setIsSubmitting(true)
      
      const formData = new FormData()
      formData.append("amount", amount.toString())
      formData.append("transactionId", transactionId)
      formData.append("note", note)
      formData.append("slipImage", slipImage)
      formData.append("paymentMethod", paymentMethod)

      const response = await fetch("/api/payments", {
        method: "POST",
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "เกิดข้อผิดพลาดในการอัพโหลด")
      }

      toast({
        title: "สำเร็จ",
        description: data.message
      })

      // Reset form
      setTransactionId("")
      setNote("")
      setSlipImage(null)
      
      // เรียก callback เมื่ออัพโหลดสำเร็จ
      onSuccess?.()
      
    } catch (error) {
      console.error("Error uploading slip:", error)
      toast({
        variant: "destructive",
        title: "ข้อผิดพลาด",
        description: error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการอัพโหลด"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast({
          variant: "destructive",
          title: "ข้อผิดพลาด",
          description: "ขนาดไฟล์ต้องไม่เกิน 5MB"
        })
        return
      }
      setSlipImage(file)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="transactionId" className="text-white">รหัสธุรกรรม (ถ้ามี)</Label>
        <Input
          id="transactionId"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          className="bg-gray-700 border-gray-600 text-white"
          placeholder="รหัสธุรกรรมหรือเลขที่อ้างอิง"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slip" className="text-white">สลิปการโอนเงิน</Label>
        <Input
          id="slip"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="bg-gray-700 border-gray-600 text-white"
        />
        <p className="text-sm text-gray-400">รองรับไฟล์รูปภาพขนาดไม่เกิน 5MB</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="note" className="text-white">หมายเหตุ (ถ้ามี)</Label>
        <Input
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="bg-gray-700 border-gray-600 text-white"
          placeholder="หมายเหตุเพิ่มเติม"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-blue-600 text-white hover:bg-blue-700"
        disabled={isSubmitting || !slipImage}
      >
        {isSubmitting ? "กำลังอัพโหลด..." : "อัพโหลดสลิป"}
      </Button>
    </form>
  )
} 