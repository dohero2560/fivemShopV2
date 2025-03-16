"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { ImageIcon, Upload, Plus, Trash2 } from "lucide-react"

interface Version {
  version: string
  downloadUrl: string
  releaseNotes?: string
  createdAt?: Date
}

interface ScriptFormProps {
  isOpen: boolean
  onClose: () => void
  script?: {
    _id: string
    title: string
    description: string
    price: number
    pointsPrice?: number
    category: string
    imageUrl?: string
    status?: "ACTIVE" | "DRAFT"
    version?: string
    resourceName?: string
    features?: string[]
    requirements?: string[]
    installation?: string
    changelog?: string
    versions?: Version[]
  }
  onSuccess: () => void
}

export default function ScriptForm({ isOpen, onClose, script, onSuccess }: ScriptFormProps) {
  const [loading, setLoading] = useState(false)
  const [formattedDates, setFormattedDates] = useState<{ [key: string]: string }>({})
  const [formData, setFormData] = useState({
    title: "",
    description: `🎮 รายละเอียดสคริปต์:
- ระบบ...
- มีฟีเจอร์...
- สามารถ...

✨ จุดเด่น:
1. ใช้งานง่าย
2. ปรับแต่งได้
3. ประสิทธิภาพดี

🛠️ การตั้งค่า:
- ปรับแต่งได้ผ่านไฟล์ config.lua
- รองรับหลายภาษา
- ตั้งค่าสิทธิ์ได้`,
    price: 0,
    pointsPrice: 0,
    category: "GENERAL",
    imageUrl: "",
    status: "DRAFT",
    version: "1.0.0",
    resourceName: "",
    features: [
      "ระบบใช้งานง่าย เข้าใจได้ทันที",
      "มีระบบจัดการผ่าน Admin Menu",
      "ปรับแต่งได้ทั้งหมดผ่าน Config",
      "รองรับการแปลภาษา",
      "ประสิทธิภาพดี ไม่กินทรัพยากรเครื่อง"
    ],
    requirements: [
      "ESX Legacy 1.9.0 ขึ้นไป",
      "oxmysql",
      "es_extended"
    ],
    installation: `1. วาง resource ในโฟลเดอร์ [esx]

2. เพิ่มในไฟล์ server.cfg:
ensure script_name

3. นำเข้าไฟล์ SQL:
execute sql_file.sql

4. รีสตาร์ทเซิร์ฟเวอร์

หากต้องการความช่วยเหลือเพิ่มเติม:
- Discord: discord.gg/yourserver
- Documentation: docs.yoursite.com`,
    changelog: `🆕 เวอร์ชัน 1.0.0:
- เปิดตัวครั้งแรก
- ระบบพื้นฐานทั้งหมด
- การตั้งค่าผ่าน Config
- ระบบ Admin
- การแจ้งเตือนในเกม`,
    versions: [] as Version[]
  })

  // Add DateTimeFormatOptions type
  const dateFormatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }

  // Add function to get next version number
  const getNextVersion = (currentVersion: string) => {
    const parts = currentVersion.split('.');
    if (parts.length !== 3) return "1.0.0";
    
    const major = parseInt(parts[0]);
    const minor = parseInt(parts[1]);
    const patch = parseInt(parts[2]);
    
    // Increment patch version
    return `${major}.${minor}.${patch + 1}`;
  }

  useEffect(() => {
    if (script) {
      setFormData({
        title: script.title,
        description: script.description,
        price: script.price,
        pointsPrice: script.pointsPrice || 0,
        category: script.category,
        imageUrl: script.imageUrl || "",
        status: script.status || "DRAFT",
        version: script.version || "1.0.0",
        resourceName: script.resourceName || "",
        features: script.features || [""],
        requirements: script.requirements || [""],
        installation: script.installation || "",
        changelog: script.changelog || "",
        versions: script.versions || []
      })
    }
  }, [script])

  useEffect(() => {
    // Format dates on client side only
    if (formData.versions) {
      const dates = formData.versions.reduce((acc, version, index) => {
        if (version.createdAt) {
          acc[index] = new Date(version.createdAt).toLocaleString('th-TH', dateFormatOptions)
        }
        return acc
      }, {} as { [key: string]: string })
      setFormattedDates(dates)
    }
  }, [formData.versions])

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData({ ...formData, features: newFeatures })
  }

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...formData.requirements]
    newRequirements[index] = value
    setFormData({ ...formData, requirements: newRequirements })
  }

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] })
  }

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index)
    setFormData({ ...formData, features: newFeatures })
  }

  const addRequirement = () => {
    setFormData({ ...formData, requirements: [...formData.requirements, ""] })
  }

  const removeRequirement = (index: number) => {
    const newRequirements = formData.requirements.filter((_, i) => i !== index)
    setFormData({ ...formData, requirements: newRequirements })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    console.log("Form submitted")

    try {
      // Ensure all required fields are present
      if (!formData.title || !formData.description || !formData.category || !formData.resourceName || formData.price === undefined) {
        console.log("Missing required fields:", { 
          title: formData.title, 
          description: formData.description,
          category: formData.category,
          resourceName: formData.resourceName,
          price: formData.price 
        })
        toast.error("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน")
        setLoading(false)
        return
      }

      // Ensure price is a number
      const numericPrice = Number(formData.price)
      if (isNaN(numericPrice) || numericPrice < 0) {
        console.log("Invalid price:", formData.price)
        toast.error("ราคาต้องเป็นตัวเลขและไม่ต่ำกว่า 0")
        setLoading(false)
        return
      }

      // Prepare the data
      const scriptData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: numericPrice,
        pointsPrice: numericPrice,
        category: formData.category,
        resourceName: formData.resourceName.trim(),
        status: formData.status || "DRAFT",
        version: formData.version || "1.0.0",
        features: formData.features.filter(f => f.trim() !== ""),
        requirements: formData.requirements.filter(r => r.trim() !== ""),
        installation: formData.installation || "",
        changelog: formData.changelog || "",
        imageUrl: formData.imageUrl || "",
        versions: formData.versions.map(v => ({
          ...v,
          version: v.version.trim(),
          downloadUrl: v.downloadUrl.trim(),
          releaseNotes: v.releaseNotes?.trim() || "",
          createdAt: v.createdAt || new Date()
        }))
      }

      const endpoint = script?._id 
        ? `/api/admin/scripts/${script._id}`
        : '/api/admin/scripts'

      console.log("Sending request to:", endpoint)
      console.log("Request data:", scriptData)

      const response = await fetch(endpoint, {
        method: script?._id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scriptData),
        credentials: 'include',
      })

      console.log("Response status:", response.status)
      let responseData
      try {
        const text = await response.text()
        console.log("Response text:", text)
        try {
          responseData = JSON.parse(text)
        } catch {
          responseData = text
        }
      } catch (e) {
        console.error("Error reading response:", e)
      }

      if (!response.ok) {
        console.error("Error response:", response.status, responseData)
        if (response.status === 401) {
          toast.error("คุณไม่มีสิทธิ์ในการดำเนินการนี้")
        } else {
          const errorMessage = typeof responseData === 'object' && responseData.error 
            ? responseData.error 
            : typeof responseData === 'string' 
              ? responseData 
              : "เกิดข้อผิดพลาดในการบันทึกข้อมูล"
          toast.error(errorMessage)
        }
        setLoading(false)
        return
      }

      toast.success(script?._id ? "อัพเดทสคริปต์เรียบร้อย" : "เพิ่มสคริปต์เรียบร้อย")
      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error saving script:", error)
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{script ? "แก้ไขสคริปต์" : "เพิ่มสคริปต์ใหม่"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
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
              <label className="text-sm font-medium text-gray-200">Resource Name</label>
              <Input
                value={formData.resourceName}
                onChange={(e) => setFormData({ ...formData, resourceName: e.target.value })}
                className="bg-gray-900 border-gray-700 text-white"
                required
                placeholder="ชื่อโฟลเดอร์สคริปต์"
              />
            </div>
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

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">ราคา (พอยท์)</label>
              <Input
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="bg-gray-900 border-gray-700 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">เวอร์ชัน</label>
              <Input
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                className="bg-gray-900 border-gray-700 text-white"
                required
                placeholder="1.0.0"
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
                  <SelectItem value="HUD">HUD</SelectItem>
                  <SelectItem value="CHAT">แชท</SelectItem>
                  <SelectItem value="ADMIN">แอดมิน</SelectItem>
                  <SelectItem value="OTHER">อื่นๆ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">ฟีเจอร์</label>
            {formData.features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white"
                  placeholder="รายละเอียดฟีเจอร์..."
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-400"
                  onClick={() => removeFeature(index)}
                >
                  ✕
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addFeature}
              className="w-full mt-2 border-dashed border-gray-600"
            >
              + เพิ่มฟีเจอร์
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">ความต้องการของระบบ</label>
            {formData.requirements.map((requirement, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={requirement}
                  onChange={(e) => handleRequirementChange(index, e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white"
                  placeholder="ความต้องการของระบบ..."
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-400"
                  onClick={() => removeRequirement(index)}
                >
                  ✕
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addRequirement}
              className="w-full mt-2 border-dashed border-gray-600"
            >
              + เพิ่มความต้องการของระบบ
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">วิธีการติดตั้ง</label>
            <Textarea
              value={formData.installation}
              onChange={(e) => setFormData({ ...formData, installation: e.target.value })}
              className="bg-gray-900 border-gray-700 text-white min-h-[100px]"
              placeholder="ขั้นตอนการติดตั้งสคริปต์..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Changelog</label>
            <Textarea
              value={formData.changelog}
              onChange={(e) => setFormData({ ...formData, changelog: e.target.value })}
              className="bg-gray-900 border-gray-700 text-white min-h-[100px]"
              placeholder="รายละเอียดการอัพเดท..."
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-200">เวอร์ชัน</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  // Check if version already exists
                  const versionExists = formData.versions?.some(v => v.version === formData.version);
                  
                  if (versionExists) {
                    toast.error("เวอร์ชันนี้มีอยู่แล้ว กรุณาใช้เวอร์ชันอื่น");
                    return;
                  }

                  const newVersion = {
                    version: formData.version,
                    downloadUrl: "",
                    releaseNotes: formData.changelog,
                    createdAt: new Date()
                  }
                  
                  // Add new version and update version number
                  setFormData(prev => {
                    const updatedVersions = [...(prev.versions || []), newVersion];
                    return {
                      ...prev,
                      versions: updatedVersions,
                      version: getNextVersion(formData.version),
                      changelog: ""
                    };
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                เพิ่มเวอร์ชัน
              </Button>
            </div>

            <div className="space-y-2">
              {formData.versions?.map((version, index) => (
                <div
                  key={index}
                  className="flex flex-col p-4 rounded-lg border border-gray-700 bg-gray-900 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-white">เวอร์ชัน {version.version}</div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-400"
                      onClick={() => {
                        const newVersions = formData.versions?.filter((_, i) => i !== index) || []
                        setFormData({ ...formData, versions: newVersions })
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Input
                    value={version.downloadUrl}
                    onChange={(e) => {
                      const newVersions = [...(formData.versions || [])]
                      newVersions[index] = { ...version, downloadUrl: e.target.value }
                      setFormData({ ...formData, versions: newVersions })
                    }}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="ลิงก์ดาวน์โหลด..."
                    required
                  />

                  <Textarea
                    value={version.releaseNotes || ""}
                    onChange={(e) => {
                      const newVersions = [...(formData.versions || [])]
                      newVersions[index] = { ...version, releaseNotes: e.target.value }
                      setFormData({ ...formData, versions: newVersions })
                    }}
                    className="bg-gray-800 border-gray-600 text-white min-h-[100px]"
                    placeholder="รายละเอียดการอัพเดท..."
                  />
                  
                  {version.createdAt && (
                    <div className="text-xs text-gray-500">
                      เพิ่มเมื่อ {formattedDates[index] || ''}
                    </div>
                  )}
                </div>
              ))}
              {(!formData.versions || formData.versions.length === 0) && (
                <div className="text-center py-6 text-gray-400">
                  ยังไม่มีเวอร์ชัน คลิกปุ่ม "เพิ่มเวอร์ชัน" เพื่อเพิ่มเวอร์ชันแรก
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">ลิงก์รูปภาพ</label>
            <Input
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="bg-gray-900 border-gray-700 text-white"
              placeholder="ลิงก์รูปภาพหน้าปก..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="status"
              checked={formData.status === "ACTIVE"}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, status: checked ? "ACTIVE" : "DRAFT" })
              }
            />
            <Label htmlFor="status">เผยแพร่สคริปต์</Label>
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
              onClick={(e) => {
                console.log("Submit button clicked")
                handleSubmit(e)
              }}
            >
              {loading ? "กำลังบันทึก..." : script ? "อัพเดท" : "เพิ่ม"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 