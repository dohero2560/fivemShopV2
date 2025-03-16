import { Download, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Version {
  version: string
  downloadUrl: string
  releaseNotes?: string
  createdAt?: Date
}

interface VersionListProps {
  versions: Version[]
}

export function VersionList({ versions }: VersionListProps) {
  if (versions.length === 0) {
    return (
      <div className="text-center py-4 text-sm text-gray-500">
        ยังไม่มีเวอร์ชัน
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {versions.map((version) => (
        <div
          key={version.version}
          className="flex items-center justify-between p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
        >
          <div className="space-y-1">
            <div className="font-medium">เวอร์ชัน {version.version}</div>
            {version.releaseNotes && (
              <div className="text-sm text-gray-500">{version.releaseNotes}</div>
            )}
            {version.createdAt && (
              <div className="text-xs text-gray-500">
                เพิ่มเมื่อ {new Date(version.createdAt).toLocaleString()}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <a href={version.downloadUrl} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
} 