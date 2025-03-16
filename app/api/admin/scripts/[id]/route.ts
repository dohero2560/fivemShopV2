import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/options"
import { getDb } from "@/lib/db"
import { scriptSchema } from "@/lib/validations/script"
import { ObjectId } from "mongodb"

// GET /api/admin/scripts/[id]
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.role?.includes("ADMIN")) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const db = await getDb()
    const script = await db.collection("scripts").findOne({
      _id: new ObjectId(params.id)
    })

    if (!script) {
      return new NextResponse("Script not found", { status: 404 })
    }

    return NextResponse.json(script)
  } catch (error) {
    console.error("[SCRIPT_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

// PUT /api/admin/scripts/[id]
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.role?.includes("ADMIN")) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()

    // Add default values and clean up data
    const scriptData = {
      ...body,
      status: body.status || "DRAFT",
      version: body.version || "1.0.0",
      features: (body.features || []).filter((f: string) => f.trim() !== ""),
      requirements: (body.requirements || []).filter((r: string) => r.trim() !== ""),
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
        { _id: new ObjectId(params.id) },
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
      console.error("[SCRIPT_UPDATE_VALIDATION]", validationError)
      return new NextResponse(
        JSON.stringify({ 
          error: "ข้อมูลไม่ถูกต้อง",
          details: validationError
        }), 
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("[SCRIPT_UPDATE]", error)
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Error", 
      { status: 500 }
    )
  }
}

// DELETE /api/admin/scripts/[id]
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.role?.includes("ADMIN")) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const db = await getDb()
    const result = await db.collection("scripts").deleteOne({
      _id: new ObjectId(params.id)
    })

    if (!result.deletedCount) {
      return new NextResponse("Script not found", { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "ลบสคริปต์เรียบร้อย"
    })
  } catch (error) {
    console.error("[SCRIPT_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 