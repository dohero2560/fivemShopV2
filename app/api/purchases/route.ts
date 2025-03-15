import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET /api/purchases - Get user's purchases
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    
    const client = await clientPromise
    const db = client.db()
    
    const purchases = await db.collection("purchases").aggregate([
      { $match: { userId: user.id } },
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

    return NextResponse.json(purchases)
  } catch (error) {
    console.error("Error fetching purchases:", error)
    return NextResponse.json({ error: "Failed to fetch purchases" }, { status: 500 })
  }
}

// POST /api/purchases - Create a new purchase
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const searchParams = request.nextUrl.searchParams
    const scriptId = searchParams.get("scriptId")

    if (!scriptId) {
      return NextResponse.json({ error: "ไม่พบข้อมูลสคริปต์" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    // Get script details
    const script = await db.collection("scripts").findOne({
      _id: new ObjectId(scriptId)
    })

    if (!script) {
      return NextResponse.json({ error: "ไม่พบสคริปต์" }, { status: 404 })
    }

    // Check if user already purchased this script
    const existingPurchase = await db.collection("purchases").findOne({
      userId: user.id,
      scriptId: new ObjectId(scriptId)
    })

    if (existingPurchase) {
      return NextResponse.json({ error: "คุณมีสคริปต์นี้อยู่แล้ว" }, { status: 400 })
    }

    // Check if user has enough points
    const dbUser = await db.collection("users").findOne({ _id: new ObjectId(user.id) })
    
    if (!dbUser || dbUser.points < script.pointsPrice) {
      return NextResponse.json({ error: "พอยท์ไม่เพียงพอ" }, { status: 400 })
    }

    // Create purchase and deduct points in a transaction
    const session = client.startSession()
    
    try {
      await session.withTransaction(async () => {
        // Create purchase
        await db.collection("purchases").insertOne({
          userId: user.id,
          scriptId: new ObjectId(scriptId),
          price: script.pointsPrice,
          status: "COMPLETED",
          createdAt: new Date(),
          updatedAt: new Date()
        }, { session })
        
        // Update user points
        await db.collection("users").updateOne(
          { _id: new ObjectId(user.id) },
          { $inc: { points: -script.pointsPrice } },
          { session }
        )
      })
    } finally {
      await session.endSession()
    }

    return NextResponse.redirect(new URL("/dashboard", request.url))
  } catch (error) {
    console.error("Error creating purchase:", error)
    return NextResponse.json({ error: "ไม่สามารถดำเนินการซื้อได้" }, { status: 500 })
  }
}

