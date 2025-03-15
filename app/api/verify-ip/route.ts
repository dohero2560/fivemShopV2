import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

// POST /api/verify-ip - Verify server IP (called from FiveM server)
export async function POST(request: NextRequest) {
  try {
    const { scriptId, ipAddress, licenseKey } = await request.json()

    // Validate license key (this would be a more complex validation in a real system)
    if (!licenseKey || licenseKey !== process.env.LICENSE_VERIFICATION_KEY) {
      return NextResponse.json({ error: "Invalid license key" }, { status: 403 })
    }

    const client = await clientPromise
    const db = client.db()

    // Find server IP record
    const serverIp = await db.collection("serverIps").findOne({
      scriptId,
      ipAddress,
    })

    if (!serverIp) {
      return NextResponse.json({ error: "Server IP not found" }, { status: 404 })
    }

    // Update verification status
    await db.collection("serverIps").updateOne(
      { _id: serverIp._id },
      { 
        $set: { 
          isVerified: true,
          updatedAt: new Date()
        } 
      }
    )
    
    const updatedServerIp = await db.collection("serverIps").findOne({ _id: serverIp._id })

    return NextResponse.json({
      success: true,
      message: "Server IP verified successfully",
      serverIp: updatedServerIp,
    })
  } catch (error) {
    console.error("Error verifying server IP:", error)
    return NextResponse.json({ error: "Failed to verify server IP" }, { status: 500 })
  }
}

