import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET /api/scripts - Get all available scripts
export async function GET(request: NextRequest) {
  try {
    await requireAuth()
    
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit
    
    const client = await clientPromise
    const db = client.db()
    
    const [scripts, total] = await Promise.all([
      db.collection("scripts")
        .find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection("scripts").countDocuments()
    ])

    return NextResponse.json({
      scripts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching scripts:", error)
    return NextResponse.json({ error: "Failed to fetch scripts" }, { status: 500 })
  }
}

// POST /api/scripts - Create a new script (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    
    // Check if user is admin
    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const data = await request.json()
    
    const client = await clientPromise
    const db = client.db()
    
    const script = {
      ...data,
      createdBy: user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection("scripts").insertOne(script)
    
    const createdScript = await db.collection("scripts").findOne({ _id: result.insertedId })

    return NextResponse.json(createdScript, { status: 201 })
  } catch (error) {
    console.error("Error creating script:", error)
    return NextResponse.json({ error: "Failed to create script" }, { status: 500 })
  }
}

