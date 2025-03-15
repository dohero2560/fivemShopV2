import { type NextRequest, NextResponse } from "next/server"
import { requireAuth, requireAdmin } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET /api/payments - Get user's payments
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    
    const client = await clientPromise
    const db = client.db()
    
    const payments = await db.collection("payments")
      .find({ userId: user.id })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(payments)
  } catch (error) {
    console.error("Error fetching payments:", error)
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 })
  }
}

// POST /api/payments - Create a new payment
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const formData = await request.formData()
    
    const amount = Number(formData.get("amount"))
    const slipImage = formData.get("slipImage") as File
    
    if (!amount || !slipImage) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 })
    }

    // Calculate points (1 บาท = 1 พอยท์)
    const points = amount

    const client = await clientPromise
    const db = client.db()

    // Create payment record
    const payment = {
      userId: user.id,
      amount,
      points, // ใช้จำนวนเงินเป็นจำนวนพอยท์โดยตรง
      status: "PENDING",
      slipImage: "", // จะอัพเดทหลังจากอัพโหลดรูป
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection("payments").insertOne(payment)
    
    // Upload slip image
    // ... existing image upload code ...

    return NextResponse.json({
      success: true,
      message: "บันทึกการชำระเงินเรียบร้อย กรุณารอการตรวจสอบ",
      payment: {
        id: result.insertedId,
        amount,
        points,
        status: "PENDING"
      }
    })

  } catch (error) {
    console.error("Error processing payment:", error)
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการบันทึกการชำระเงิน" }, { status: 500 })
  }
}

// PATCH /api/payments/[id] - Admin approve/reject payment
export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAdmin()
    const { id, status, adminNote } = await request.json()

    const client = await clientPromise
    const db = client.db()

    const payment = await db.collection("payments").findOne({
      _id: new ObjectId(id)
    })

    if (!payment) {
      return NextResponse.json({ error: "ไม่พบข้อมูลการชำระเงิน" }, { status: 404 })
    }

    if (status === "COMPLETED") {
      // Add points to user (1:1 ratio)
      await db.collection("users").updateOne(
        { _id: new ObjectId(payment.userId) },
        { 
          $inc: { points: payment.amount }, // เพิ่มพอยท์เท่ากับจำนวนเงิน
          $set: { updatedAt: new Date() }
        }
      )
    }

    // Update payment status
    await db.collection("payments").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status,
          adminNote,
          updatedAt: new Date()
        }
      }
    )

    return NextResponse.json({
      success: true,
      message: status === "COMPLETED" ? "อนุมัติการชำระเงินเรียบร้อย" : "ปฏิเสธการชำระเงินเรียบร้อย"
    })

  } catch (error) {
    console.error("Error updating payment:", error)
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการอัพเดทสถานะ" }, { status: 500 })
  }
}

