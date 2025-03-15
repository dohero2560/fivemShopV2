import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Check, Download, Star, Wallet, Shield } from "lucide-react"
import { notFound } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface PageProps {
  params: Promise<{ id: string }> | { id: string }
}

export default async function ProductDetailPage({ params }: PageProps) {
  // Await params first
  const resolvedParams = await params
  const session = await getServerSession(authOptions)
  
  // Fetch script from database
  const client = await clientPromise
  const db = client.db()

  let script
  try {
    script = await db.collection("scripts").findOne({
      _id: new ObjectId(resolvedParams.id)
    })
  } catch (error) {
    console.error("Error fetching script:", error)
    notFound()
  }

  if (!script) {
    notFound()
  }

  // Check if user has purchased this script
  let hasPurchased = false
  if (session?.user) {
    const purchase = await db.collection("purchases").findOne({
      userId: session.user.id,
      scriptId: new ObjectId(resolvedParams.id),
      status: "COMPLETED"
    })
    hasPurchased = !!purchase
  }

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
                {(session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN") && (
                  <Link href="/admin">
                    <Button variant="outline" className="border-red-600 text-white hover:bg-red-900/50">
                      <Shield className="mr-2 h-4 w-4" />
                      แอดมิน
                    </Button>
                  </Link>
                )}
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
          <div className="mb-6">
            <Link href="/products" className="inline-flex items-center text-blue-500 hover:text-blue-400">
              <ArrowLeft className="mr-2 h-4 w-4" />
              กลับไปยังสินค้า
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                <div className="relative aspect-video">
                  <Image src={script.image || "/placeholder.svg"} alt={script.title} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{script.title}</h1>
                      <div className="flex items-center gap-4">
                        <div className="flex">
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${
                                  i < (script.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
                                }`}
                              />
                            ))}
                        </div>
                        <span className="text-gray-400">({script.reviews || 0} รีวิว)</span>
                        <Badge className="bg-blue-600 hover:bg-blue-700">{script.category}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Wallet className="h-5 w-5 text-blue-400 mr-2" />
                      <span className="text-3xl font-bold text-white">{script.pointsPrice} พอยท์</span>
                    </div>
                  </div>

                  <Tabs defaultValue="description" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-gray-900">
                      <TabsTrigger value="description" className="data-[state=active]:bg-blue-600">
                        รายละเอียด
                      </TabsTrigger>
                      <TabsTrigger value="features" className="data-[state=active]:bg-blue-600">
                        คุณสมบัติ
                      </TabsTrigger>
                      <TabsTrigger value="requirements" className="data-[state=active]:bg-blue-600">
                        ความต้องการ
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="description" className="p-4 bg-gray-900 rounded-b-lg mt-2 text-gray-300">
                      <p className="mb-4">{script.fullDescription}</p>
                      <p>
                        สคริปต์นี้ออกแบบมาเพื่อยกระดับเซิร์ฟเวอร์ FiveM ของคุณด้วยระบบที่ครอบคลุมและเป็นมิตรกับผู้ใช้ซึ่งผู้เล่นจะชื่นชอบ
                        มีการปรับให้เหมาะสมสำหรับประสิทธิภาพและเข้ากันได้กับเฟรมเวิร์กยอดนิยมส่วนใหญ่
                      </p>
                    </TabsContent>
                    <TabsContent value="features" className="p-4 bg-gray-900 rounded-b-lg mt-2 text-gray-300">
                      <ul className="space-y-2">
                        {script.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                    <TabsContent value="requirements" className="p-4 bg-gray-900 rounded-b-lg mt-2 text-gray-300">
                      <ul className="space-y-2">
                        {script.requirements.map((req, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

              <div className="mt-8 bg-gray-800 rounded-lg overflow-hidden border border-gray-700 p-6">
                <h2 className="text-xl font-bold text-white mb-4">ภาพหน้าจอ</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-gray-700">
                      <Image
                        src="/placeholder.svg?height=400&width=600"
                        alt={`${script.title} ภาพหน้าจอ ${i}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 sticky top-24">
                <h2 className="text-xl font-bold text-white mb-4">การซื้อ</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-white">
                    <span>ราคา:</span>
                    <div className="flex items-center">
                      <Wallet className="h-4 w-4 text-blue-400 mr-2" />
                      <span className="font-bold">{script.pointsPrice} พอยท์</span>
                    </div>
                  </div>
                  <div className="bg-blue-900/30 p-3 rounded-md">
                    <div className="flex items-center mb-2">
                      <div className="h-2 w-2 rounded-full bg-blue-400 mr-2"></div>
                      <span className="text-sm text-blue-300 font-medium">ยอดคงเหลือของคุณ: {session?.user?.points || 0} พอยท์</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {session?.user?.points < script.pointsPrice
                        ? `คุณต้องการอีก ${script.pointsPrice - session?.user?.points} พอยท์เพื่อซื้อสคริปต์นี้`
                        : "คุณมีพอยท์เพียงพอที่จะซื้อสคริปต์นี้"}
                    </div>
                  </div>
                  <Separator className="bg-gray-700" />
                  <div className="space-y-2">
                    {session?.user ? (
                      hasPurchased ? (
                        <Link href="/dashboard">
                          <Button className="w-full bg-green-600 hover:bg-green-700">
                            ดูในแดชบอร์ด
                          </Button>
                        </Link>
                      ) : (
                        <form action={`/api/purchases?scriptId=${script._id}`} method="POST">
                          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                            ซื้อสคริปต์
                          </Button>
                        </form>
                      )
                    ) : (
                      <Link href="/login">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          เข้าสู่ระบบเพื่อซื้อ
                        </Button>
                      </Link>
                    )}
                    <Button variant="outline" className="w-full border-blue-600 text-white hover:bg-blue-900/50">
                      <Download className="mr-2 h-4 w-4" />
                      ดาวน์โหลดเดโม
                    </Button>
                  </div>
                  <Separator className="bg-gray-700" />
                  <div className="space-y-4 text-gray-300 text-sm">
                    <div className="flex items-start">
                      <Check className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                      <span>อัปเดตตลอดอายุการใช้งาน</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                      <span>การสนับสนุนพรีเมียม 6 เดือน</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                      <span>เอกสารประกอบที่สมบูรณ์</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                      <span>เข้ากันได้กับ ESX/QBCore</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

// Sample data
const scripts = [
  {
    id: "advanced-garage",
    title: "ระบบโรงรถขั้นสูง",
    description: "ระบบโรงรถที่ครอบคลุมพร้อมการปรับแต่งยานพาหนะ โรงรถหลายแห่ง และฟังก์ชันการยึดรถ",
    fullDescription:
      "ระบบโรงรถขั้นสูงเป็นโซลูชันที่สมบูรณ์สำหรับการจัดการยานพาหนะบนเซิร์ฟเวอร์ FiveM ของคุณ มันให้ผู้เล่นสามารถเก็บ เรียกคืน และปรับแต่งยานพาหนะของพวกเขาในโรงรถหลายแห่งทั่วแผนที่ ระบบนี้รวมถึงฟังก์ชันการยึดรถ การติดตามยานพาหนะ และการรวมเข้ากับเฟรมเวิร์กยอดนิยมส่วนใหญ่",
    price: 24.99,
    pointsPrice: 2499, // Added points price (100 points = $1)
    rating: 5,
    reviews: 128,
    category: "ยานพาหนะ",
    image: "/placeholder.svg?height=400&width=600",
    features: [
      "ตำแหน่งโรงรถหลายแห่งพร้อมจุดบนแผนที่ที่กำหนดเอง",
      "การปรับแต่งและอัพเกรดยานพาหนะ",
      "ระบบการยึดรถพร้อมค่าธรรมเนียม",
      "ระบบประกันยานพาหนะ",
      "แผงการจัดการสำหรับผู้ดูแลระบบ",
      "การแบ่งปันยานพาหนะกับผู้เล่นอื่น",
      "การใช้ทรัพยากรต่ำ (0.01ms เมื่อไม่ได้ใช้งาน)",
      "เอกสารประกอบโดยละเอียดและการสนับสนุน",
    ],
    requirements: [
      "เฟรมเวิร์ก ESX หรือ QBCore",
      "เซิร์ฟเวอร์ FiveM เวอร์ชัน 5181 หรือสูงกว่า",
      "ฐานข้อมูล MySQL",
      "ความรู้พื้นฐานเกี่ยวกับการดูแลเซิร์ฟเวอร์ FiveM",
    ],
  },
  {
    id: "police-job",
    title: "งานตำรวจที่สมบูรณ์",
    description: "งานตำรวจที่ครบถ้วนพร้อม MDT ระบบหลักฐาน การจับกุมขั้นสูง และการจัดการแผนก",
    fullDescription:
      "สคริปต์งานตำรวจที่สมบูรณ์เปลี่ยนประสบการณ์การบังคับใช้กฎหมายบนเซิร์ฟเวอร์ของคุณด้วยชุดคุณสมบัติที่ครอบคลุมซึ่งออกแบบมาสำหรับการเล่นบทบาทที่น่าดึงดูด ตั้งแต่ระบบ MDT ขั้นสูงไปจนถึงการเก็บและประมวลผลหลักฐานโดยละเอียด สคริปต์นี้มีทุกอย่างที่จำเป็นสำหรับงานตำรวจที่สมจริง",
    price: 34.99,
    pointsPrice: 3499, // Added points price (100 points = $1)
    rating: 4,
    reviews: 86,
    category: "อาชีพ",
    image: "/placeholder.svg?height=400&width=600",
    features: [
      "ระบบ MDT ขั้นสูงพร้อมประวัติอาชญากรรม",
      "การเก็บและประมวลผลหลักฐาน",
      "ระบบการจับกุมและการลงทะเบียนโดยละเอียด",
      "ยศและสิทธิ์ของแผนก",
      "การจัดการยานพาหนะและอุปกรณ์",
      "ระบบการส่งตำรวจแบบบูรณาการ",
      "เครื่องมือสืบสวนสถานที่เกิดเหตุ",
      "สถานีตำรวจและอุปกรณ์ที่ปรับแต่งได้",
    ],
    requirements: [
      "เฟรมเวิร์ก ESX หรือ QBCore",
      "เซิร์ฟเวอร์ FiveM เวอร์ชัน 5181 หรือสูงกว่า",
      "ฐานข้อมูล MySQL",
      "ความรู้พื้นฐานเกี่ยวกับการดูแลเซิร์ฟเวอร์ FiveM",
    ],
  },
]

