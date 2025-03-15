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

        // If this is a Discord sign in, store the Discord ID
        if (account?.provider === "discord" && account?.providerAccountId) {
          // Check if user exists before updating
          const client = await clientPromise
          const db = client.db()
          const existingUser = await db.collection("users").findOne({ _id: new ObjectId(user.id) })
          
          if (existingUser) {
            await db.collection("users").updateOne(
              { _id: new ObjectId(user.id) },
              { $set: { discordId: account.providerAccountId } }
            )
          }
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

