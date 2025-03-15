import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// PATCH /api/admin/payments/[id] - Update payment status (admin only)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()

    const id = params.id
    const { status, adminNote } = await request.json()
    
    const client = await clientPromise
    const db = client.db()

    const payment = await db.collection("payments").findOne({
      _id: new ObjectId(id)
    })

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    // Update payment
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

    // If payment is approved, add points to user
    if (status === "APPROVED") {
      await db.collection("users").updateOne(
        { _id: new ObjectId(payment.userId) },
        { $inc: { points: payment.points } }
      )
    }
    
    const updatedPayment = await db.collection("payments").findOne({ _id: new ObjectId(id) })

    return NextResponse.json(updatedPayment)
  } catch (error) {
    console.error("Error updating payment:", error)
    return NextResponse.json({ error: "Failed to update payment" }, { status: 500 })
  }
}

