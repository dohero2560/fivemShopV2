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
      .project({
        _id: 1,
        userId: 1,
        amount: 1,
        points: 1,
        transactionId: 1,
        note: 1,
        adminNote: 1,
        status: 1,
        slipImage: 1,
        paymentMethod: 1,
        createdAt: 1,
        updatedAt: 1
      })
      .sort({ createdAt: -1 })
      .toArray()

    // Format the response
    const formattedPayments = payments.map(payment => ({
      id: payment._id.toString(),
      date: new Date(payment.createdAt).toLocaleString('th-TH'),
      transactionId: payment.transactionId || '-',
      amount: payment.amount,
      points: payment.points,
      status: payment.status,
      note: payment.note,
      adminNote: payment.adminNote,
      slipImage: payment.slipImage,
      paymentMethod: payment.paymentMethod,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt
    }))

    return NextResponse.json(formattedPayments)
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
    const transactionId = formData.get("transactionId") as string
    const note = formData.get("note") as string
    const paymentMethod = formData.get("paymentMethod") as string
    
    if (!amount || !slipImage) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 })
    }

    // Convert slip image to base64
    const imageBuffer = await slipImage.arrayBuffer()
    const base64Image = Buffer.from(imageBuffer).toString('base64')

    // Calculate points (1 บาท = 1 พอยท์)
    const points = amount

    const client = await clientPromise
    const db = client.db()

    // Create payment record
    const payment = {
      userId: user.id,
      amount,
      points,
      transactionId,
      note,
      status: "PENDING",
      slipImage: base64Image,
      paymentMethod,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection("payments").insertOne(payment)

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

