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
    async session({ session, token, user }) {
      if (session.user) {
        // Get fresh user data from database
        const client = await clientPromise
        const db = client.db()
        const dbUser = await db.collection("users").findOne({ 
          _id: new ObjectId(token.sub as string) 
        })

        if (dbUser) {
          session.user.id = dbUser._id.toString()
          session.user.role = dbUser.role || "USER"
          session.user.points = dbUser.points || 0
          session.user.discordId = dbUser.discordId
        }
      }
      return session
    },
    async jwt({ token, user, account, trigger }) {
      if (trigger === "signIn" || trigger === "signUp" || !token.role) {
        const client = await clientPromise
        const db = client.db()
        
        const dbUser = await db.collection("users").findOne({ 
          _id: new ObjectId(token.sub as string) 
        })
        
        if (dbUser) {
          // If user exists but missing required fields, update them
          if (!dbUser.role || !dbUser.hasOwnProperty('points')) {
            await db.collection("users").updateOne(
              { _id: new ObjectId(token.sub as string) },
              {
                $set: {
                  role: dbUser.role || "USER",
                  points: dbUser.points || 0,
                  updatedAt: new Date()
                }
              }
            )
          }
          
          token.role = dbUser.role || "USER"
          token.points = dbUser.points || 0
          token.discordId = dbUser.discordId
        }
      }

      return token
    },
  },
  events: {
    async signIn({ user, account }) {
      if (account?.provider === "discord" && account?.providerAccountId) {
        const client = await clientPromise
        const db = client.db()
        
        // First check if user exists
        const existingUser = await db.collection("users").findOne({ 
          _id: new ObjectId(user.id) 
        })

        if (!existingUser) {
          // If user doesn't exist, create new user with current date as createdAt
          await db.collection("users").updateOne(
            { _id: new ObjectId(user.id) },
            { 
              $set: { 
                name: user.name,
                email: user.email,
                image: user.image,
                discordId: account.providerAccountId,
                role: "USER",
                points: 0,
                createdAt: new Date(),
                updatedAt: new Date()
              }
            },
            { upsert: true }
          )
        } else {
          // If user exists, only update necessary fields
          await db.collection("users").updateOne(
            { _id: new ObjectId(user.id) },
            { 
              $set: { 
                name: user.name || existingUser.name,
                email: user.email || existingUser.email,
                image: user.image || existingUser.image,
                discordId: account.providerAccountId,
                updatedAt: new Date()
              }
            }
          )
        }
      }
    }
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

