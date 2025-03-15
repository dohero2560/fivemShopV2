import NextAuth, { type NextAuthOptions } from "next-auth"
import DiscordProvider from "next-auth/providers/discord"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      authorization: { params: { scope: "identify email guilds" } },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string

        // Fetch user from database to get role and points
        const client = await clientPromise
        const db = client.db()
        const dbUser = await db.collection("users").findOne({ _id: new ObjectId(token.sub) })

        if (dbUser) {
          session.user.role = dbUser.role
          session.user.points = dbUser.points
          session.user.discordId = dbUser.discordId
        }
      }
      return session
    },
    async jwt({ token, user, account }) { 
      if (user) {
        token.sub = user.id

        // Always check and update user data when signing in
        const client = await clientPromise
        const db = client.db()
        
        // Check if user exists and has required fields
        const existingUser = await db.collection("users").findOne({ _id: new ObjectId(user.id) })
        
        if (!existingUser) {
          // Create new user with default values
          await db.collection("users").insertOne({
            _id: new ObjectId(user.id),
            name: user.name,
            email: user.email,
            image: user.image,
            role: "USER",
            points: 0,
            discordId: account?.providerAccountId || null,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        } else if (!existingUser.role || !existingUser.points) {
          // Update existing user with missing fields
          await db.collection("users").updateOne(
            { _id: new ObjectId(user.id) },
            {
              $set: {
                role: existingUser.role || "USER",
                points: existingUser.points || 0,
                updatedAt: new Date()
              }
            }
          )
        }

        // If this is a Discord sign in, update Discord ID
        if (account?.provider === "discord" && account?.providerAccountId) {
          await db.collection("users").updateOne(
            { _id: new ObjectId(user.id) },
            { $set: { discordId: account.providerAccountId } }
          )
        }
      }
      return token
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

