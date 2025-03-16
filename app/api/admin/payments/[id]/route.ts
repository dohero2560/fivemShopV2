import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/options"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// PATCH /api/admin/payments/[id] - Update payment status (admin only)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    
    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const { action } = await request.json()
    
    if (!action || (action !== "approve" && action !== "reject")) {
      return new NextResponse("Invalid action", { status: 400 })
    }

    // Connect to database
    const client = await clientPromise
    const db = client.db()

    // Get payment details
    const payment = await db.collection("payments").findOne({
      _id: new ObjectId(params.id)
    })

    if (!payment) {
      return new NextResponse("Payment not found", { status: 404 })
    }

    if (payment.status !== "PENDING") {
      return new NextResponse("Payment is not in pending status", { status: 400 })
    }

    // Update payment status
    const newStatus = action === "approve" ? "COMPLETED" : "REJECTED"
    await db.collection("payments").updateOne(
      { _id: new ObjectId(params.id) },
      { 
        $set: { 
          status: newStatus,
          updatedAt: new Date()
        } 
      }
    )

    // If approved, add points to user
    if (action === "approve") {
      const points = Math.floor(payment.amount) // 1 บาท = 1 พ้อยท์
      await db.collection("users").updateOne(
        { _id: new ObjectId(payment.userId) },
        { 
          $inc: { points: points },
          $set: { updatedAt: new Date() }
        }
      )
    }

    return new NextResponse("Success", { status: 200 })

  } catch (error) {
    console.error("Error in PATCH /api/admin/payments/[id]:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

