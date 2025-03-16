import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface Version {
  version: string
  downloadUrl: string
  releaseNotes?: string
  createdAt?: Date
}

interface DownloadVersionDialogProps {
  isOpen: boolean
  onClose: () => void
  versions?: Version[]
  scriptName: string
}

export default function DownloadVersionDialog({
  isOpen,
  onClose,
  versions,
  scriptName
}: DownloadVersionDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle>เลือกเวอร์ชันที่ต้องการดาวน์โหลด - {scriptName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {versions?.map((version, index) => (
            <div
              key={index}
              className="flex flex-col p-4 rounded-lg border border-gray-700 bg-gray-900 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">เวอร์ชัน {version.version}</div>
                  {version.releaseNotes && (
                    <div className="text-sm text-gray-400 mt-1">
                      {version.releaseNotes}
                    </div>
                  )}
                  {version.createdAt && (
                    <div className="text-xs text-gray-500 mt-1">
                      เพิ่มเมื่อ {new Date(version.createdAt).toLocaleString('th-TH')}
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => {
                    window.open(version.downloadUrl, '_blank')
                    onClose()
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  ดาวน์โหลด
                </Button>
              </div>
            </div>
          ))}
          {(!versions || versions.length === 0) && (
            <div className="text-center py-6 text-gray-400">
              ไม่พบเวอร์ชันที่สามารถดาวน์โหลดได้
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 