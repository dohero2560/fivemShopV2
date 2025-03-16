import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/options"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET /api/admin/payments - Get all payments (admin only)
export async function GET() {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    
    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return new NextResponse("Forbidden", { status: 403 })
    }

    // Connect to database
    const client = await clientPromise
    const db = client.db()

    // Fetch payments with user details
    const payments = await db.collection("payments")
      .aggregate([
        {
          $addFields: {
            userObjId: { $toObjectId: "$userId" }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "userObjId",
            foreignField: "_id",
            as: "user"
          }
        },
        {
          $project: {
            _id: 1,
            userId: 1,
            userName: { $arrayElemAt: ["$user.name", 0] },
            amount: 1,
            method: 1,
            status: 1,
            createdAt: 1,
            slipImage: 1,
            paymentMethod: 1
          }
        },
        {
          $sort: { createdAt: -1 }
        }
      ])
      .toArray()

    return NextResponse.json(payments)

  } catch (error) {
    console.error("Error in GET /api/admin/payments:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

