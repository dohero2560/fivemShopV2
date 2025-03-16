import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// PATCH /api/admin/users/[id]/points - Update user points (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const id = params.id
    const { points } = await request.json()

    if (typeof points !== "number") {
      return NextResponse.json(
        { error: "Points must be a number" },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db()

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          points,
          updatedAt: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Add points transaction record
    await db.collection("pointsTransactions").insertOne({
      userId: id,
      points: points,
      type: "ADMIN_UPDATE",
      createdAt: new Date()
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user points:", error)
    return NextResponse.json(
      { error: "Failed to update user points" },
      { status: 500 }
    )
  }
} 