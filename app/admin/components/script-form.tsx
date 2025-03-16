"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface ScriptFormProps {
  isOpen: boolean
  onClose: () => void
  script?: {
    _id: string
    title: string
    description: string
    price: number
    category: string
    downloadUrl: string
    imageUrl?: string
  }
  onSuccess: () => void
}

export default function ScriptForm({ isOpen, onClose, script, onSuccess }: ScriptFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: script?.title || "",
    description: script?.description || "",
    price: script?.price || 0,
    category: script?.category || "GENERAL",
    downloadUrl: script?.downloadUrl || "",
    imageUrl: script?.imageUrl || ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)

      const response = await fetch(`/api/admin/scripts${script ? `/${script._id}` : ""}`, {
        method: script ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to save script")
      }

      toast.success(script ? "สคริปต์ถูกอัพเดทแล้ว" : "เพิ่มสคริปต์ใหม่แล้ว")
      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error saving script:", error)
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle>{script ? "แก้ไขสคริปต์" : "เพิ่มสคริปต์ใหม่"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">ชื่อสคริปต์</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-gray-900 border-gray-700 text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">คำอธิบาย</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-gray-900 border-gray-700 text-white min-h-[100px]"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">ราคา</label>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
              className="bg-gray-900 border-gray-700 text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">หมวดหมู่</label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="GENERAL">ทั่วไป</SelectItem>
                <SelectItem value="VEHICLE">ยานพาหนะ</SelectItem>
                <SelectItem value="WEAPON">อาวุธ</SelectItem>
                <SelectItem value="MAP">แผนที่</SelectItem>
                <SelectItem value="JOB">อาชีพ</SelectItem>
                <SelectItem value="SYSTEM">ระบบ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">ลิงก์ดาวน์โหลด</label>
            <Input
              value={formData.downloadUrl}
              onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
              className="bg-gray-900 border-gray-700 text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">ลิงก์รูปภาพ</label>
            <Input
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="bg-gray-900 border-gray-700 text-white"
              placeholder="ไม่จำเป็น"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-700 text-white hover:bg-gray-700"
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "กำลังบันทึก..." : script ? "อัพเดท" : "เพิ่ม"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 