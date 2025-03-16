"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Upload, X, Check } from "lucide-react"
import { submitPaymentSlip } from "./actions"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export interface PaymentSlipUploaderProps {
  amount: number
  paymentMethod: string
  onSuccess?: () => void
}

export default function PaymentSlipUploader({ amount, paymentMethod, onSuccess }: PaymentSlipUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [transactionId, setTransactionId] = useState("")
  const [note, setNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setSelectedFile(file)

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreviewUrl(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("transactionId", transactionId)
      formData.append("amount", amount.toString())
      formData.append("note", note)
      formData.append("paymentMethod", paymentMethod)
      if (selectedFile) {
        formData.append("slipImage", selectedFile)
      }

      const result = await submitPaymentSlip(formData)

      if (result?.success) {
        toast({
          title: "ส่งหลักฐานการชำระเงินสำเร็จ",
          description: "ทีมงานจะตรวจสอบและดำเนินการภายใน 24 ชั่วโมง",
        })

        // Reset form
        setSelectedFile(null)
        setPreviewUrl(null)
        setTransactionId("")
        setNote("")
        
        // Call onSuccess callback
        if (onSuccess) {
          onSuccess()
        }
      }
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error instanceof Error ? error.message : "ไม่สามารถส่งหลักฐานการชำระเงินได้",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setTransactionId("")
    setNote("")
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-white">อัปโหลดสลิปการชำระเงิน</CardTitle>
        <CardDescription className="text-gray-400">อัปโหลดหลักฐานการชำระเงินเพื่อเติมพอยท์</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="h-12 w-12 rounded-full bg-green-900/30 flex items-center justify-center mb-4">
              <Check className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">ส่งหลักฐานการชำระเงินเรียบร้อยแล้ว</h3>
            <p className="text-gray-400 max-w-md">
              ขอบคุณสำหรับการส่งหลักฐานการชำระเงิน ทีมงานของเราจะตรวจสอบและดำเนินการภายใน 24 ชั่วโมง
            </p>
            <Badge className="mt-4 bg-yellow-600">รอการตรวจสอบ</Badge>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="slip-upload" className="text-white">
                  อัปโหลดรูปภาพสลิป
                </Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center ${
                    previewUrl ? "border-blue-500 bg-blue-900/10" : "border-gray-700 hover:border-gray-600"
                  }`}
                >
                  {previewUrl ? (
                    <div className="flex flex-col items-center">
                      <div className="relative w-full max-w-[200px] h-[250px] mb-4">
                        <Image
                          src={previewUrl || "/placeholder.svg"}
                          alt="สลิปการชำระเงิน"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="border-red-600 text-red-500 hover:bg-red-900/20"
                        onClick={() => {
                          setSelectedFile(null)
                          setPreviewUrl(null)
                        }}
                      >
                        <X className="mr-2 h-4 w-4" />
                        ลบรูปภาพ
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-4">
                        <Upload className="h-10 w-10 text-gray-500" />
                      </div>
                      <p className="text-gray-400 mb-2">ลากและวางรูปภาพสลิปที่นี่ หรือคลิกเพื่อเลือกไฟล์</p>
                      <p className="text-gray-500 text-xs">รูปแบบที่รองรับ: JPG, PNG (สูงสุด 5MB)</p>
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-4 border-blue-600 text-white hover:bg-blue-900/50"
                        onClick={() => document.getElementById("slip-upload")?.click()}
                      >
                        เลือกไฟล์
                      </Button>
                    </div>
                  )}
                  <input
                    id="slip-upload"
                    type="file"
                    accept="image/jpeg,image/png"
                    className="hidden"
                    onChange={handleFileChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transaction-id" className="text-white">
                    รหัสธุรกรรม / เลขที่อ้างอิง
                  </Label>
                  <Input
                    id="transaction-id"
                    placeholder="ระบุรหัสธุรกรรมหรือเลขที่อ้างอิง"
                    className="bg-gray-900 border-gray-700 text-white focus-visible:ring-blue-600"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note" className="text-white">
                    หมายเหตุ (ถ้ามี)
                  </Label>
                  <Textarea
                    id="note"
                    placeholder="ระบุรายละเอียดเพิ่มเติม เช่น ธนาคารที่โอน เวลาที่โอน"
                    className="bg-gray-900 border-gray-700 text-white focus-visible:ring-blue-600 min-h-[100px]"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-blue-900/20 p-4 rounded-md">
                <h4 className="text-blue-400 font-medium mb-2">ข้อมูลการเติมพอยท์</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">จำนวนเงิน:</p>
                    <p className="font-medium text-white">{amount.toString()} บาท</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">พอยท์ที่จะได้รับ:</p>
                    <p className="font-medium text-white">{amount} พอยท์</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-400">หมายเหตุ:</p>
                  <p className="text-sm text-gray-300">1 บาท = 1 พอยท์</p>
                </div>
              </div>
            </div>
          </form>
        )}
      </CardContent>
      {!isSubmitted && (
        <CardFooter className="p-4 pt-0 flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="border-gray-700 text-white hover:bg-gray-800 w-full sm:w-auto"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            ยกเลิก
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto"
            onClick={handleSubmit}
            disabled={!selectedFile || !transactionId || !amount || isSubmitting}
          >
            {isSubmitting ? "กำลังส่งข้อมูล..." : "ส่งหลักฐานการชำระเงิน"}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

