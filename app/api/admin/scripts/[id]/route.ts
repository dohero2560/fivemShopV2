import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../auth/[...nextauth]/route"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// PATCH /api/admin/scripts/[id] - Update script
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (session.user?.role !== "ADMIN" && session.user?.role !== "SUPER_ADMIN") {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const body = await req.json()
    const { title, description, price, category, downloadUrl, imageUrl } = body

    if (!title || !description || !price || !category || !downloadUrl) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    const updatedScript = await db.collection("scripts").findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          title,
          description,
          price,
          category,
          downloadUrl,
          imageUrl,
          updatedAt: new Date()
        }
      },
      { returnDocument: "after" }
    )

    if (!updatedScript.value) {
      return new NextResponse("Script not found", { status: 404 })
    }

    return NextResponse.json(updatedScript.value)
  } catch (error) {
    console.error("[ADMIN_SCRIPT_PATCH]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

// DELETE /api/admin/scripts/[id] - Delete script
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const result = await db.collection("scripts").deleteOne({
      _id: new ObjectId(params.id)
    })

    if (result.deletedCount === 0) {
      return new NextResponse("Script not found", { status: 404 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[ADMIN_SCRIPT_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 