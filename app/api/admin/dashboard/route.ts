import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    // Check if user is admin
    await requireAdmin()

    const client = await clientPromise
    const db = client.db()

    // Get dashboard stats
    const [
      usersCount,
      ordersCount,
      scriptsCount,
      totalRevenue
    ] = await Promise.all([
      db.collection("users").countDocuments(),
      db.collection("purchases").countDocuments(),
      db.collection("scripts").countDocuments(),
      db.collection("payments")
        .find({ status: "APPROVED" })
        .toArray()
        .then(payments => 
          payments.reduce((sum, payment) => sum + (payment.amount || 0), 0)
        )
    ])

    return NextResponse.json({
      users: usersCount,
      orders: ordersCount,
      scripts: scriptsCount,
      revenue: totalRevenue
    })

  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    )
  }
} 