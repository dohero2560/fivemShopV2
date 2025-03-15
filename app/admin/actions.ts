"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// Approve payment
export async function approvePayment(formData: FormData) {
  const admin = await requireAdmin()

  const paymentId = formData.get("paymentId") as string
  const adminNote = formData.get("adminNote") as string

  if (!paymentId) {
    throw new Error("ไม่พบข้อมูลการชำระเงิน")
  }

  const client = await clientPromise
  const db = client.db()

  // Get payment details
  const payment = await db.collection("payments").findOne({
    _id: new ObjectId(paymentId)
  })

  if (!payment) {
    throw new Error("ไม่พบข้อมูลการชำระเงิน")
  }

  // Update payment status and add points to user in a transaction
  const session = client.startSession()
  
  try {
    await session.withTransaction(async () => {
      // Update payment
      await db.collection("payments").updateOne(
        { _id: new ObjectId(paymentId) },
        { 
          $set: { 
            status: "APPROVED", 
            adminNote,
            updatedAt: new Date()
          } 
        },
        { session }
      )
      
      // Update user points
      await db.collection("users").updateOne(
        { _id: new ObjectId(payment.userId) },
        { $inc: { points: payment.points } },
        { session }
      )
    })
  } finally {
    await session.endSession()
  }

  revalidatePath("/admin")
  redirect("/admin?tab=payments")
}

// Reject payment
export async function rejectPayment(formData: FormData) {
  const admin = await requireAdmin()

  const paymentId = formData.get("paymentId") as string
  const adminNote = formData.get("adminNote") as string

  if (!paymentId) {
    throw new Error("ไม่พบข้อมูลการชำระเงิน")
  }

  const client = await clientPromise
  const db = client.db()

  // Update payment status
  await db.collection("payments").updateOne(
    { _id: new ObjectId(paymentId) },
    { 
      $set: { 
        status: "REJECTED", 
        adminNote,
        updatedAt: new Date()
      } 
    }
  )

  revalidatePath("/admin")
  redirect("/admin?tab=payments")
}

// Create script
export async function createScript(formData: FormData) {
  await requireAdmin()

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const fullDescription = formData.get("fullDescription") as string
  const category = formData.get("category") as string
  const pointsPrice = Number.parseInt(formData.get("pointsPrice") as string)
  const features = (formData.get("features") as string).split("\n").filter(Boolean)
  const requirements = (formData.get("requirements") as string).split("\n").filter(Boolean)

  if (!title || !description || !category || !pointsPrice) {
    throw new Error("กรุณากรอกข้อมูลให้ครบถ้วน")
  }

  const client = await clientPromise
  const db = client.db()

  await db.collection("scripts").insertOne({
    title,
    description,
    fullDescription,
    category,
    pointsPrice,
    price: pointsPrice / 100, // $1 = 100 points
    version: "1.0.0",
    features,
    requirements,
    status: "PUBLISHED",
    rating: 0,
    reviews: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  })

  revalidatePath("/admin")
  redirect("/admin?tab=products")
}

// Update user role
export async function updateUserRole(formData: FormData) {
  const admin = await requireAdmin()

  const userId = formData.get("userId") as string
  const role = formData.get("role") as string

  if (!userId || !role) {
    throw new Error("ข้อมูลไม่ครบถ้วน")
  }

  const client = await clientPromise
  const db = client.db()

  // Check if trying to modify a SUPER_ADMIN
  const targetUser = await db.collection("users").findOne(
    { _id: new ObjectId(userId) },
    { projection: { role: 1 } }
  )

  if (targetUser?.role === "SUPER_ADMIN" && admin.role !== "SUPER_ADMIN") {
    throw new Error("คุณไม่มีสิทธิ์แก้ไขผู้ดูแลระบบหลัก")
  }

  await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    { 
      $set: { 
        role,
        updatedAt: new Date()
      } 
    }
  )

  revalidatePath("/admin")
  redirect("/admin?tab=users")
}

