import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Load environment variables
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uri = process.env.DATABASE_URL
if (!uri) {
  console.error('DATABASE_URL is not defined in environment variables')
  process.exit(1)
}

const client = new MongoClient(uri)

async function updateUserRoles() {
  try {
    await client.connect()
    console.log('Connected to MongoDB')

    const db = client.db()
    const users = db.collection('users')

    // Add role field to all users that don't have it
    const result = await users.updateMany(
      { role: { $exists: false } },
      { $set: { role: 'USER' } }
    )

    console.log(`Updated ${result.modifiedCount} users with default role`)

    // Set specific user as ADMIN
    const adminResult = await users.updateOne(
      { email: 'dodospeedza@hotmail.co.th' },
      { $set: { role: 'ADMIN' } }
    )

    if (adminResult.modifiedCount > 0) {
      console.log('Successfully set admin role')
    } else {
      console.log('Admin user already has correct role or not found')
    }

  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  } finally {
    await client.close()
    console.log('Disconnected from MongoDB')
  }
}

updateUserRoles() 