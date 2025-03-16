import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import clientPromise from "@/lib/mongodb"

// GET /api/admin/scripts - Get all scripts
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
    
    const scripts = await db.collection("scripts")
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(scripts)
  } catch (error) {
    console.error("[ADMIN_SCRIPTS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

// POST /api/admin/scripts - Create new script
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
    const { 
      title,
      description,
      price,
      category,
      downloadUrl,
      imageUrl
    } = body

    if (!title || !description || !price || !category || !downloadUrl) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    const script = await db.collection("scripts").insertOne({
      title,
      description,
      price,
      category,
      downloadUrl,
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json(script)
  } catch (error) {
    console.error("[ADMIN_SCRIPTS_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 