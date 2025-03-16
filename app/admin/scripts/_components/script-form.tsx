import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { scriptFormSchema } from "@/lib/validations/script"

interface ScriptFormProps {
  script?: any
}

export function ScriptForm({ script }: ScriptFormProps) {
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(scriptFormSchema),
    defaultValues: script ? {
      title: script.title,
      description: script.description,
      category: script.category,
      resourceName: script.resourceName,
      price: script.price,
      imageUrl: script.imageUrl,
      features: script.features || [],
      status: script.status,
    } : {
      title: "",
      description: "",
      category: "",
      resourceName: "",
      price: 0,
      imageUrl: "",
      features: [],
      status: "DRAFT",
    }
  })

  async function onSubmit(data: any) {
    try {
      const response = await fetch(script ? `/api/scripts/${script._id}` : "/api/scripts", {
        method: script ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("เกิดข้อผิดพลาดในการบันทึกข้อมูล")
      }

      toast.success(script ? "แก้ไขสคริปต์สำเร็จ" : "เพิ่มสคริปต์สำเร็จ")
      router.refresh()
      if (!script) {
        router.push("/admin/scripts")
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ชื่อสคริปต์</FormLabel>
              <FormControl>
                <Input placeholder="ชื่อสคริปต์" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>คำอธิบาย</FormLabel>
              <FormControl>
                <Textarea placeholder="คำอธิบายสคริปต์" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>หมวดหมู่</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกหมวดหมู่" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="SYSTEM">ระบบ</SelectItem>
                    <SelectItem value="MINIGAME">มินิเกม</SelectItem>
                    <SelectItem value="JOB">อาชีพ</SelectItem>
                    <SelectItem value="OTHER">อื่นๆ</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="resourceName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resource Name</FormLabel>
                <FormControl>
                  <Input placeholder="ชื่อ Resource" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ราคา (พอยท์)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(+e.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>สถานะ</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกสถานะ" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="DRAFT">แบบร่าง</SelectItem>
                    <SelectItem value="ACTIVE">เผยแพร่</SelectItem>
                    <SelectItem value="INACTIVE">ปิดการใช้งาน</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL รูปภาพ</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          {script ? "บันทึกการแก้ไข" : "เพิ่มสคริปต์"}
        </Button>
      </form>
    </Form>
  )
} 