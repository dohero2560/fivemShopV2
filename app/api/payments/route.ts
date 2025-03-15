import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
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

    const data = await request.json()
    
    const client = await clientPromise
    const db = client.db()
    
    const payment = {
      ...data,
      userId: user.id,
      status: "PENDING",
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection("payments").insertOne(payment)
    
    const createdPayment = await db.collection("payments").findOne({ _id: result.insertedId })

    return NextResponse.json(createdPayment, { status: 201 })
  } catch (error) {
    console.error("Error creating payment:", error)
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 })
  }
}

