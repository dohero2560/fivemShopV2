import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET /api/admin/users/[id] - Get user details (admin only)
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()

    const id = params.id
    
    const client = await clientPromise
    const db = client.db()

    // Get user with related data
    const user = await db.collection("users").findOne({ _id: new ObjectId(id) })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    
    // Get user's purchases with script details
    const purchases = await db.collection("purchases").aggregate([
      { $match: { userId: id } },
      { $lookup: {
          from: "scripts",
          localField: "scriptId",
          foreignField: "_id",
          as: "script"
        }
      },
      { $unwind: "$script" },
      { $sort: { createdAt: -1 } }
    ]).toArray()
    
    // Get user's payments
    const payments = await db.collection("payments")
      .find({ userId: id })
      .sort({ createdAt: -1 })
      .toArray()
    
    // Get user's server IPs
    const serverIps = await db.collection("serverIps")
      .find({ userId: id })
      .toArray()
    
    // Combine all data
    const userData = {
      ...user,
      purchases,
      payments,
      serverIps
    }

    return NextResponse.json(userData)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

// PATCH /api/admin/users/[id] - Update user (admin only)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAdmin()

    const id = params.id
    const { role, points } = await request.json()
    
    const client = await clientPromise
    const db = client.db()

    // Check if trying to modify a SUPER_ADMIN
    const targetUser = await db.collection("users").findOne(
      { _id: new ObjectId(id) },
      { projection: { role: 1 } }
    )

    if (targetUser?.role === "SUPER_ADMIN" && admin.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Only SUPER_ADMIN can modify another SUPER_ADMIN" }, { status: 403 })
    }

    // Prepare update data
    const updateData = {}
    if (role) updateData.role = role
    if (points !== undefined) updateData.points = points
    updateData.updatedAt = new Date()
    
    // Update user
    await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )
    
    const updatedUser = await db.collection("users").findOne({ _id: new ObjectId(id) })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

