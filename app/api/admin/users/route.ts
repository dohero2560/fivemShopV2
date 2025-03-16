import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/options"
import clientPromise from "@/lib/mongodb"

// GET /api/admin/users - Get all users (admin only)
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (session.user?.role !== "ADMIN" && session.user?.role !== "SUPER_ADMIN") {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const client = await clientPromise
    const db = client.db()

    // Get users with their purchase counts
    const users = await db.collection("users").aggregate([
      {
        $addFields: {
          stringId: { $toString: "$_id" }
        }
      },
      {
        $lookup: {
          from: "purchases",
          localField: "stringId",
          foreignField: "userId",
          as: "purchases"
        }
      },
      {
        $addFields: {
          purchasedScripts: { $size: "$purchases" },
          createdAt: { 
            $dateToString: { 
              format: "%Y-%m-%dT%H:%M:%S.%LZ",
              date: "$createdAt",
              onNull: new Date()
            } 
          }
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          points: 1,
          role: 1,
          createdAt: 1,
          purchasedScripts: 1
        }
      }
    ]).toArray()

    return NextResponse.json(users)
  } catch (error) {
    console.error("[ADMIN_USERS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

// POST /api/admin/users - Create new user
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (session.user?.role !== "ADMIN" && session.user?.role !== "SUPER_ADMIN") {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const body = await req.json()
    const { name, email, role = "USER", points = 0 } = body

    if (!name || !email) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return new NextResponse("User already exists", { status: 400 })
    }

    const user = await db.collection("users").insertOne({
      name,
      email,
      role,
      points,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("[ADMIN_USERS_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

