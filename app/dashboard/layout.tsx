import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import SiteHeader from "../components/site-header"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="relative min-h-screen bg-gray-900">
      <SiteHeader user={session.user} isDashboard={true} />
      <div className="container py-6">
        {children}
      </div>
    </div>
  )
}

