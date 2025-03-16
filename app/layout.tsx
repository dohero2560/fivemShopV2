import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { getServerSession } from "next-auth"
import SessionProvider from "./components/session-provider"
import SiteHeader from "./components/site-header"
import { headers } from "next/headers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DooDev",
  description: "ร้านขายสคริปต์ FiveM คุณภาพสูง",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()
  const headersList = await headers()
  const pathname = headersList.get("x-pathname") || "/"
  const isDashboard = pathname.startsWith("/dashboard")

  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-black`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="fivem-scripts-theme"
        >
          <SessionProvider session={session}>
            {!isDashboard && <SiteHeader />}
            {children}
          </SessionProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}