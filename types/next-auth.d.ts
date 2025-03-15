import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      points: number
      discordId?: string
    } & DefaultSession["user"]
  }
}

