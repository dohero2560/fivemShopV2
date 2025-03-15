import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// This webhook would be called by a payment processor when a payment is completed
export async function POST(request: NextRequest) {
  try {
    // Verify that the request is coming from your payment processor
    const signature = request.headers.get("x-signature")

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 })
    }

    // In a real implementation, you would verify the signature here
    // using the payment processor's API key and the request body

    const data = await request.json()

    // Process the payment notification
    const { payment_id, status, transaction_id } = data

    if (!payment_id || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    // Find the payment in the database
    const payment = await db.collection("payments").findOne({
      $or: [
        { _id: new ObjectId(payment_id) }, 
        { transactionId: transaction_id }
      ]
    })

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    // Update payment status
    if (status === "completed" || status === "approved") {
      // Update payment status and add points to user in a transaction
      const session = client.startSession()
      
      try {
        await session.withTransaction(async () => {
          // Update payment
          await db.collection("payments").updateOne(
            { _id: payment._id },
            { 
              $set: { 
                status: "APPROVED",
                transactionId: transaction_id || payment.transactionId,
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
    } else if (status === "failed" || status === "rejected") {
      // Update payment status to rejected
      await db.collection("payments").updateOne(
        { _id: payment._id },
        { 
          $set: { 
            status: "REJECTED",
            transactionId: transaction_id || payment.transactionId,
            updatedAt: new Date()
          } 
        }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing payment webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

