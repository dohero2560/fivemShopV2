"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface UserFormProps {
  isOpen: boolean
  onClose: () => void
  user?: {
    _id: string
    name: string
    email: string
    role: string
    points: number
  }
  onSuccess: () => void
}

export default function UserForm({ isOpen, onClose, user, onSuccess }: UserFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "USER",
    points: user?.points || 0
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)

      const response = await fetch(`/api/admin/users${user ? `/${user._id}` : ""}`, {
        method: user ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to save user")
      }

      toast.success(user ? "ผู้ใช้ถูกอัพเดทแล้ว" : "เพิ่มผู้ใช้ใหม่แล้ว")
      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error saving user:", error)
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle>{user ? "แก้ไขผู้ใช้" : "เพิ่มผู้ใช้ใหม่"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">ชื่อ</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-gray-900 border-gray-700 text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">อีเมล</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-gray-900 border-gray-700 text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">ระดับ</label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">พอยท์</label>
            <Input
              type="number"
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
              className="bg-gray-900 border-gray-700 text-white"
              required
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
              {loading ? "กำลังบันทึก..." : user ? "อัพเดท" : "เพิ่ม"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 