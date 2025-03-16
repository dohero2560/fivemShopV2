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
          session.user.role = dbUser.role
          session.user.points = dbUser.points
          session.user.discordId = dbUser.discordId
        }
      }
      return session
    },
    async jwt({ token, user, account, trigger }) {
      if (trigger === "signIn" || trigger === "signUp" || !token.role) {
        // Always get fresh data from database when signing in or if role is missing
        const client = await clientPromise
        const db = client.db()
        
        const dbUser = await db.collection("users").findOne({ 
          _id: new ObjectId(token.sub as string) 
        })
        
        if (dbUser) {
          token.role = dbUser.role
          token.points = dbUser.points
          token.discordId = dbUser.discordId
        }
      }

      // If this is initial sign in
      if (user && !token.role) {
        const client = await clientPromise
        const db = client.db()
        
        // Create new user with default values if doesn't exist
        const newUser = {
          _id: new ObjectId(user.id),
          name: user.name,
          email: user.email,
          image: user.image,
          role: "USER",
          points: 0,
          discordId: account?.providerAccountId || null,
          createdAt: new Date(),
          updatedAt: new Date()
        }

        await db.collection("users").updateOne(
          { _id: new ObjectId(user.id) },
          { 
            $setOnInsert: newUser,
            $set: {
              name: user.name,
              email: user.email,
              image: user.image,
              updatedAt: new Date()
            }
          },
          { upsert: true }
        )

        token.role = newUser.role
        token.points = newUser.points
        token.discordId = newUser.discordId
      }

      return token
    },
  },
  events: {
    async signIn({ user, account }) {
      if (account?.provider === "discord" && account?.providerAccountId) {
        const client = await clientPromise
        const db = client.db()
        
        await db.collection("users").updateOne(
          { _id: new ObjectId(user.id) },
          { 
            $set: { 
              discordId: account.providerAccountId,
              updatedAt: new Date()
            } 
          }
        )
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

