"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// Submit payment slip
export async function submitPaymentSlip(formData: FormData) {
  const user = await requireAuth()

  const transactionId = formData.get("transactionId") as string
  const amount = Number.parseFloat(formData.get("amount") as string)
  const note = formData.get("note") as string
  const slipImage = formData.get("slipImage") as File
  const paymentMethod = formData.get("paymentMethod") as string

  if (!transactionId || !amount || amount <= 0 || !slipImage || !paymentMethod) {
    throw new Error("กรุณากรอกข้อมูลให้ครบถ้วน")
  }

  // Calculate points (100 points per 1 baht)
  const points = Math.floor(amount * 1)
  // Calculate bonus points (5% bonus)
  const bonusPoints = Math.floor(points * 1)
  const totalPoints = points + bonusPoints

  // Convert image to base64
  const imageBuffer = await slipImage.arrayBuffer()
  const base64Image = Buffer.from(imageBuffer).toString('base64')

  const client = await clientPromise
  const db = client.db()

  // Create payment record
  await db.collection("payments").insertOne({
    userId: user.id,
    amount,
    points: totalPoints,
    transactionId,
    note,
    slipImage: base64Image,
    paymentMethod,
    status: "PENDING",
    createdAt: new Date(),
    updatedAt: new Date()
  })

  // Only revalidate the path, don't redirect
  revalidatePath("/dashboard")
  return { success: true }
}

// Update server IP
export async function updateServerIp(formData: FormData) {
  const user = await requireAuth()

  const scriptId = formData.get("scriptId") as string
  const ipAddress = formData.get("ipAddress") as string

  if (!scriptId || !ipAddress) {
    throw new Error("กรุณากรอกข้อมูลให้ครบถ้วน")
  }

  const client = await clientPromise
  const db = client.db()

  // Check if user owns the script
  const purchase = await db.collection("purchases").findOne({
    userId: user.id,
    scriptId: new ObjectId(scriptId),
    status: "COMPLETED",
  })

  if (!purchase) {
    throw new Error("คุณไม่มีสิทธิ์ในการตั้งค่า IP สำหรับสคริปต์นี้")
  }

  // Check if server IP already exists
  const existingServerIp = await db.collection("serverIps").findOne({
    userId: user.id,
    scriptId,
  })

  if (existingServerIp) {
    // Update existing server IP
    await db.collection("serverIps").updateOne(
      { _id: existingServerIp._id },
      { 
        $set: {
          ipAddress,
          isVerified: false, // Reset verification when IP is changed
          updatedAt: new Date()
        }
      }
    )
  } else {
    // Create new server IP
    await db.collection("serverIps").insertOne({
      userId: user.id,
      scriptId,
      ipAddress,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }

  revalidatePath("/dashboard")
  redirect("/dashboard?tab=settings")
}

// Purchase script
export async function purchaseScript(formData: FormData) {
  const user = await requireAuth()

  const scriptId = formData.get("scriptId") as string

  if (!scriptId) {
    throw new Error("ไม่พบข้อมูลสคริปต์")
  }

  const client = await clientPromise
  const db = client.db()

  // Get script details
  const script = await db.collection("scripts").findOne({
    _id: new ObjectId(scriptId)
  })

  if (!script) {
    throw new Error("ไม่พบสคริปต์")
  }

  // Check if user already purchased this script
  const existingPurchase = await db.collection("purchases").findOne({
    userId: user.id,
    scriptId: new ObjectId(scriptId)
  })

  if (existingPurchase) {
    throw new Error("คุณมีสคริปต์นี้อยู่แล้ว")
  }

  // Check if user has enough points
  const dbUser = await db.collection("users").findOne({ _id: new ObjectId(user.id) })
  
  if (!dbUser || dbUser.points < script.pointsPrice) {
    throw new Error("พอยท์ไม่เพียงพอ")
  }

  // Create purchase and deduct points in a transaction
  const session = client.startSession()
  
  try {
    await session.withTransaction(async () => {
      // Create purchase
      await db.collection("purchases").insertOne({
        userId: user.id,
        scriptId: new ObjectId(scriptId),
        price: script.pointsPrice,
        status: "COMPLETED",
        createdAt: new Date(),
        updatedAt: new Date()
      }, { session })
      
      // Update user points
      await db.collection("users").updateOne(
        { _id: new ObjectId(user.id) },
        { $inc: { points: -script.pointsPrice } },
        { session }
      )
    })
  } finally {
    await session.endSession()
  }

  revalidatePath("/dashboard")
  redirect("/dashboard")
}

