import Link from "next/link"
import Image from "next/image"
import { Star, Wallet, Package } from "lucide-react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/options"
import { getDb } from "@/lib/db"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function ProductsPage() {
  const session = await getServerSession(authOptions)
  
  // Fetch scripts from database
  const db = await getDb()

  const scripts = await db.collection("scripts")
    .find({ status: "ACTIVE" })
    .sort({ createdAt: -1 })
    .toArray()

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">สคริปต์ทั้งหมด</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scripts.map((script) => (
            <Link href={`/products/${script._id}`} key={script._id.toString()}>
              <Card className="overflow-hidden bg-gray-800 border-gray-700 transition-all hover:border-blue-600 hover:shadow-md hover:shadow-blue-900/20">
                <div className="relative">
                  <Image
                    src={script.imageUrl || "/placeholder.svg"}
                    alt={script.title}
                    width={600}
                    height={400}
                    className="object-cover w-full h-48"
                  />
                  <Badge className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700">
                    {script.category}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-xl font-bold text-white mb-2">{script.title}</h3>
                  <p className="text-gray-400 line-clamp-2">{script.description}</p>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">เวอร์ชัน</span>
                      <span className="text-white">{script.version || "1.0.0"}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Resource Name</span>
                      <span className="text-white">{script.resourceName}</span>
                    </div>
                  </div>

                  {script.features && script.features.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-400 mb-2">ฟีเจอร์</h4>
                      <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                        {script.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="line-clamp-1">{feature}</li>
                        ))}
                        {script.features.length > 3 && (
                          <li className="text-blue-400">และอีก {script.features.length - 3} รายการ</li>
                        )}
                      </ul>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="p-4 pt-0 flex items-center justify-between">
                  <div className="flex items-center">
                    <Package className="h-4 w-4 text-blue-400 mr-1.5" />
                    <span className="text-white font-bold">{script.price.toLocaleString()} พอยท์</span>
                  </div>
                  <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                    ดูรายละเอียด
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      <footer className="w-full border-t border-gray-800 bg-black py-6">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
          <p className="text-center text-sm text-gray-400">&copy; {new Date().getFullYear()} DooDev สงวนลิขสิทธิ์</p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-gray-400 hover:text-blue-500">
              เงื่อนไขการใช้งาน
            </Link>
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-blue-500">
              นโยบายความเป็นส่วนตัว
            </Link>
            <Link href="/contact" className="text-sm text-gray-400 hover:text-blue-500">
              ติดต่อเรา
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

