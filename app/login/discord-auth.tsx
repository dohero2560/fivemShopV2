"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { DiscordIcon } from "./discord-icon"

export function DiscordAuth() {
  return (
    <Button
      className="w-full h-12 bg-[#5865F2] hover:bg-[#4752C4] text-white flex items-center justify-center gap-3"
      onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
    >
      <DiscordIcon className="h-5 w-5" />
      <span className="font-medium">เข้าสู่ระบบด้วย Discord</span>
    </Button>
  )
}

