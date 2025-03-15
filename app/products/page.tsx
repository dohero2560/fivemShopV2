import Link from "next/link"
import Image from "next/image"
import { Star, Wallet } from "lucide-react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import clientPromise from "@/lib/mongodb"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function ProductsPage() {
  const session = await getServerSession(authOptions)
  
  // Fetch scripts from database
  const client = await clientPromise
  const db = client.db()

  const scripts = await db.collection("scripts")
    .find({ status: "PUBLISHED" })
    .sort({ createdAt: -1 })
    .toArray()

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <div className="font-bold text-2xl bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                FiveM Scripts
              </div>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/" className="text-sm font-medium text-white transition-colors hover:text-blue-500">
                หน้าหลัก
              </Link>
              <Link href="/products" className="text-sm font-medium text-blue-500 transition-colors hover:text-blue-500">
                สินค้า
              </Link>
              <Link href="/dashboard" className="text-sm font-medium text-white transition-colors hover:text-blue-500">
                แดชบอร์ด
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {session?.user ? (
              <>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-blue-900/30 px-3 py-1 rounded-full">
                    <Wallet className="h-4 w-4 text-blue-400 mr-2" />
                    <span className="text-blue-300 font-medium">{session.user.points || 0} พอยท์</span>
                  </div>
                  <Link href="/dashboard">
                    <Button variant="outline" className="border-blue-600 text-white hover:bg-blue-900/50">
                      <div className="flex items-center gap-2">
                        <Image
                          src={session.user.image || "/placeholder-user.jpg"}
                          alt={session.user.name || "Profile"}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <span>{session.user.name}</span>
                      </div>
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <Link href="/login">
                <Button className="bg-blue-600 text-white hover:bg-blue-700">เข้าสู่ระบบ</Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 bg-gray-900">
        <div className="container py-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter md:text-4xl text-white">สคริปต์ทั้งหมด</h1>
              <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed">
                เลือกจากคอลเลกชันสคริปต์ FiveM คุณภาพสูงของเรา
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scripts.map((script) => (
              <Link href={`/products/${script._id}`} key={script._id.toString()}>
                <Card className="overflow-hidden bg-gray-800 border-gray-700 transition-all hover:border-blue-600 hover:shadow-md hover:shadow-blue-900/20">
                  <div className="relative">
                    <Image
                      src={script.image || "/placeholder.svg"}
                      alt={script.title}
                      width={600}
                      height={400}
                      className="object-cover w-full h-48"
                    />
                    <Badge className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700">{script.category}</Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-xl font-bold text-white mb-2">{script.title}</h3>
                    <p className="text-gray-400 line-clamp-2">{script.description}</p>
                    <div className="flex items-center mt-4">
                      <div className="flex">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < (script.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
                              }`}
                            />
                          ))}
                      </div>
                      <span className="text-gray-400 text-sm ml-2">({script.reviews || 0})</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex items-center justify-between">
                    <div className="flex items-center">
                      <Wallet className="h-4 w-4 text-blue-400 mr-1.5" />
                      <span className="text-white font-bold">{script.pointsPrice} พอยท์</span>
                    </div>
                    <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                      ดูรายละเอียด
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <footer className="w-full border-t border-gray-800 bg-black py-6">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
          <p className="text-center text-sm text-gray-400">&copy; {new Date().getFullYear()} FiveM Scripts สงวนลิขสิทธิ์</p>
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

