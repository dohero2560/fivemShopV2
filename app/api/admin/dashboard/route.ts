import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import clientPromise from "@/lib/mongodb"

// GET /api/admin/dashboard - Get dashboard overview data
export async function GET() {
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
    
    // Get counts from different collections
    const [users, scripts, orders, payments] = await Promise.all([
      db.collection("users").countDocuments(),
      db.collection("scripts").countDocuments(),
      db.collection("orders").countDocuments(),
      db.collection("payments").aggregate([
        {
          $match: { status: "completed" }
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" }
          }
        }
      ]).toArray()
    ])

    const revenue = payments[0]?.total || 0

    return NextResponse.json({
      users,
      scripts,
      orders,
      revenue
    })
  } catch (error) {
    console.error("[ADMIN_DASHBOARD_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 