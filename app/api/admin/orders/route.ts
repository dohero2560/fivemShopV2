import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/options"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

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

    // Fetch purchases with user and script details
    const purchases = await db.collection("purchases")
      .aggregate([
        {
          $addFields: {
            userObjId: { $toObjectId: "$userId" },
            scriptObjId: { $toObjectId: "$scriptId" }
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
          $lookup: {
            from: "scripts",
            localField: "scriptObjId",
            foreignField: "_id",
            as: "script"
          }
        },
        {
          $project: {
            _id: 1,
            userId: 1,
            userName: { $arrayElemAt: ["$user.name", 0] },
            scriptId: 1,
            scriptTitle: { $arrayElemAt: ["$script.title", 0] },
            price: 1,
            status: 1,
            createdAt: 1
          }
        },
        {
          $sort: { createdAt: -1 }
        }
      ])
      .toArray()

    return NextResponse.json(purchases)

  } catch (error) {
    console.error("Error in GET /api/admin/orders:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 