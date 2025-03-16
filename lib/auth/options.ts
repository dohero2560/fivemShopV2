import { NextAuthOptions } from "next-auth"
import DiscordProvider from "next-auth/providers/discord"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as string
        session.user.points = token.points as number
        session.user.discordId = token.discordId as string
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        // Get user from database
        const client = await clientPromise
        const db = client.db()
        const dbUser = await db.collection("users").findOne({ email: user.email })

        if (dbUser) {
          token.role = dbUser.role || "USER"
          token.points = dbUser.points || 0
          token.discordId = dbUser.discordId
        } else {
          // Create new user
          const newUser = {
            name: user.name,
            email: user.email,
            image: user.image,
            role: "USER",
            points: 0,
            discordId: user.id,
            createdAt: new Date(),
            updatedAt: new Date()
          }
          await db.collection("users").insertOne(newUser)
          token.role = "USER"
          token.points = 0
          token.discordId = user.id
        }
      }
      return token
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
} 