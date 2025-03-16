"use client"

import { useState } from "react"
import { notFound } from "next/navigation"
import { ObjectId } from "mongodb"
import { Plus } from "lucide-react"

import { getDb } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function EditScriptPage({ params }: { params: { id: string } }) {
  const [showVersionDialog, setShowVersionDialog] = useState(false)
  const [script, setScript] = useState<any>(null)

  async function loadScript() {
    const db = await getDb()
    const result = await db.collection("scripts").findOne({
      _id: new ObjectId(params.id)
    })
    if (!result) {
      notFound()
    }
    setScript(result)
  }

  if (!script) {
    loadScript()
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">แก้ไขสคริปต์</h1>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">ข้อมูลทั่วไป</h2>
            <div className="grid gap-4">
              <div>
                <Label>ชื่อสคริปต์</Label>
                <Input
                  defaultValue={script.title}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Resource Name</Label>
                <Input
                  defaultValue={script.resourceName}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>คำอธิบาย</Label>
                <Textarea
                  defaultValue={script.description}
                  className="mt-1"
                  rows={4}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">เวอร์ชัน</h2>
              <Dialog open={showVersionDialog} onOpenChange={setShowVersionDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    เพิ่มเวอร์ชัน
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>เพิ่มเวอร์ชันใหม่</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>เวอร์ชัน</Label>
                      <Input placeholder="1.0.0" className="mt-1" />
                    </div>
                    <div>
                      <Label>URL สำหรับดาวน์โหลด</Label>
                      <Input placeholder="https://example.com/download" className="mt-1" />
                    </div>
                    <div>
                      <Label>Release Notes</Label>
                      <Textarea
                        placeholder="รายละเอียดการอัพเดทในเวอร์ชันนี้"
                        className="mt-1"
                      />
                    </div>
                    <Button className="w-full">บันทึก</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {script.versions?.length ? (
                script.versions.map((version: any) => (
                  <div
                    key={version.version}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card"
                  >
                    <div>
                      <div className="font-medium">เวอร์ชัน {version.version}</div>
                      {version.releaseNotes && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {version.releaseNotes}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        แก้ไข
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        ลบ
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  ยังไม่มีเวอร์ชัน คลิกปุ่ม "เพิ่มเวอร์ชัน" เพื่อเพิ่มเวอร์ชันแรก
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div className="flex justify-end gap-4">
            <Button variant="outline">ยกเลิก</Button>
            <Button>บันทึก</Button>
          </div>
        </div>
      </Card>
    </div>
  )
} 