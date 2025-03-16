import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/options"
import { getDb } from "@/lib/db"
import { scriptSchema } from "@/lib/validations/script"
import { ObjectId } from "mongodb"

// GET /api/admin/scripts - Get all scripts
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.role?.includes("ADMIN")) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const db = await getDb()
    
    const scripts = await db.collection("scripts")
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(scripts)
  } catch (error) {
    console.error("[SCRIPTS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

// POST /api/admin/scripts - Create new script
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.role?.includes("ADMIN")) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()

    // Add default values for required fields
    const scriptData = {
      ...body,
      status: body.status || "DRAFT",
      version: body.version || "1.0.0",
      features: (body.features || []).filter((f: string) => f.trim() !== ""),
      requirements: (body.requirements || []).filter((r: string) => r.trim() !== ""),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Transform dates in versions array if present
    if (scriptData.versions) {
      scriptData.versions = scriptData.versions.map((v: any) => ({
        ...v,
        createdAt: v.createdAt ? new Date(v.createdAt) : new Date()
      }))
    }

    try {
      const validatedData = scriptSchema.parse(scriptData)
      const db = await getDb()
      const result = await db.collection("scripts").insertOne(validatedData)
      return NextResponse.json({ 
        success: true,
        message: "สร้างสคริปต์เรียบร้อย",
        id: result.insertedId 
      })
    } catch (validationError) {
      console.error("[SCRIPTS_POST_VALIDATION]", validationError)
      return new NextResponse(
        JSON.stringify({ 
          error: "ข้อมูลไม่ถูกต้อง",
          details: validationError
        }), 
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("[SCRIPTS_POST]", error)
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Error", 
      { status: 500 }
    )
  }
}

// PATCH /api/admin/scripts - Update script
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.role?.includes("ADMIN")) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { _id, ...updateData } = body

    if (!_id) {
      return new NextResponse("Script ID is required", { status: 400 })
    }

    // Add default values and clean up data
    const scriptData = {
      ...updateData,
      status: updateData.status || "DRAFT",
      version: updateData.version || "1.0.0",
      features: (updateData.features || []).filter((f: string) => f.trim() !== ""),
      requirements: (updateData.requirements || []).filter((r: string) => r.trim() !== ""),
      updatedAt: new Date()
    }

    // Transform dates in versions array if present
    if (scriptData.versions) {
      scriptData.versions = scriptData.versions.map((v: any) => ({
        ...v,
        createdAt: v.createdAt ? new Date(v.createdAt) : new Date()
      }))
    }

    try {
      const validatedData = scriptSchema.parse(scriptData)
      const db = await getDb()
      const result = await db.collection("scripts").updateOne(
        { _id: new ObjectId(_id) },
        { $set: validatedData }
      )

      if (!result.matchedCount) {
        return new NextResponse("Script not found", { status: 404 })
      }

      return NextResponse.json({
        success: true,
        message: "อัพเดทสคริปต์เรียบร้อย"
      })
    } catch (validationError) {
      console.error("[SCRIPTS_PATCH_VALIDATION]", validationError)
      return new NextResponse(
        JSON.stringify({ 
          error: "ข้อมูลไม่ถูกต้อง",
          details: validationError
        }), 
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("[SCRIPTS_PATCH]", error)
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Error", 
      { status: 500 }
    )
  }
} 