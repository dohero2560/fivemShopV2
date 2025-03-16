"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const versionFormSchema = z.object({
  version: z.string().min(1, "กรุณากรอกเวอร์ชัน"),
  downloadUrl: z.string().min(1, "กรุณากรอก URL สำหรับดาวน์โหลด"),
  releaseNotes: z.string().optional(),
})

type VersionFormValues = z.infer<typeof versionFormSchema>

interface VersionFormProps {
  scriptId: string
}

export function VersionForm({ scriptId }: VersionFormProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const form = useForm<VersionFormValues>({
    resolver: zodResolver(versionFormSchema),
    defaultValues: {
      version: "",
      downloadUrl: "",
      releaseNotes: "",
    },
  })

  async function onSubmit(data: VersionFormValues) {
    try {
      const response = await fetch(`/api/scripts/${scriptId}/versions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("เกิดข้อผิดพลาดในการเพิ่มเวอร์ชัน")
      }

      toast.success("เพิ่มเวอร์ชันสำเร็จ")
      form.reset()
      setOpen(false)
      router.refresh()
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการเพิ่มเวอร์ชัน")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>เวอร์ชัน</FormLabel>
                  <FormControl>
                    <Input placeholder="1.0.0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="downloadUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL สำหรับดาวน์โหลด</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/download" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="releaseNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Release Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="รายละเอียดการอัพเดทในเวอร์ชันนี้"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              บันทึก
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 