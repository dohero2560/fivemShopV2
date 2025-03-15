import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

// GET /api/admin/users - Get all users (admin only)
export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || ""
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const client = await clientPromise
    const db = client.db()
    
    // Create search filter
    let filter = {}
    if (search) {
      filter = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ]
      }
    }

    const [users, total] = await Promise.all([
      db.collection("users").aggregate([
        { $match: filter },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        { $lookup: {
            from: "purchases",
            localField: "_id",
            foreignField: "userId",
            as: "purchasesData"
          }
        },
        { $lookup: {
            from: "payments",
            localField: "_id",
            foreignField: "userId",
            as: "paymentsData"
          }
        },
        { $project: {
            id: "$_id",
            _id: 1,
            name: 1,
            email: 1,
            image: 1,
            discordId: 1,
            points: 1,
            role: 1,
            createdAt: 1,
            _count: {
              purchases: { $size: "$purchasesData" },
              payments: { $size: "$paymentsData" }
            }
          }
        }
      ]).toArray(),
      db.collection("users").countDocuments(filter)
    ])

    return NextResponse.json({
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

