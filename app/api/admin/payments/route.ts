import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

// GET /api/admin/payments - Get all payments (admin only)
export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const where = status ? { status } : {}
    
    const client = await clientPromise
    const db = client.db()

    const [payments, total] = await Promise.all([
      db.collection("payments").aggregate([
        { $match: where },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        { $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userInfo"
          }
        },
        { $unwind: "$userInfo" },
        { $project: {
            _id: 1,
            amount: 1,
            points: 1,
            transactionId: 1,
            slipImage: 1,
            note: 1,
            adminNote: 1,
            status: 1,
            createdAt: 1,
            updatedAt: 1,
            user: {
              id: "$userInfo._id",
              name: "$userInfo.name",
              email: "$userInfo.email",
              image: "$userInfo.image"
            }
          }
        }
      ]).toArray(),
      db.collection("payments").countDocuments(where),
    ])

    return NextResponse.json({
      payments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching payments:", error)
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 })
  }
}

