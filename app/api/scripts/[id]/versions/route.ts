import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { ObjectId } from "mongodb"
import { z } from "zod"

import { authOptions } from "@/lib/auth/options"
import { getDb } from "@/lib/db"

const versionSchema = z.object({
  version: z.string(),
  downloadUrl: z.string(),
  releaseNotes: z.string().optional(),
})

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { version, downloadUrl, releaseNotes } = versionSchema.parse(body)

    const db = await getDb()
    const scriptId = new ObjectId(params.id)

    // Check if version already exists
    const existingScript = await db.collection("scripts").findOne({
      _id: scriptId,
      "versions.version": version
    })

    if (existingScript) {
      return new NextResponse("Version already exists", { status: 400 })
    }

    // Add new version
    const result = await db.collection("scripts").updateOne(
      { _id: scriptId },
      {
        $push: {
          versions: {
            version,
            downloadUrl,
            releaseNotes,
            createdAt: new Date()
          }
        }
      }
    )

    if (!result.matchedCount) {
      return new NextResponse("Script not found", { status: 404 })
    }

    return new NextResponse("Version added successfully", { status: 200 })
  } catch (error) {
    console.error("[SCRIPTS_VERSIONS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const version = searchParams.get("version")

    if (!version) {
      return new NextResponse("Version is required", { status: 400 })
    }

    const db = await getDb()
    const scriptId = new ObjectId(params.id)

    // Remove version
    const result = await db.collection("scripts").updateOne(
      { _id: scriptId },
      {
        $pull: {
          versions: { version }
        }
      }
    )

    if (!result.matchedCount) {
      return new NextResponse("Script not found", { status: 404 })
    }

    return new NextResponse("Version deleted successfully", { status: 200 })
  } catch (error) {
    console.error("[SCRIPTS_VERSIONS_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 