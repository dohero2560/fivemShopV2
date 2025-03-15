import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get the token
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  // Check if the user is authenticated
  const isAuthenticated = !!token

  // Define protected routes
  const protectedRoutes = ["/dashboard", "/admin"]
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Define admin routes
  const adminRoutes = ["/admin"]
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))

  // Check if the user is an admin
  const isAdmin = token?.role === "ADMIN" || token?.role === "SUPER_ADMIN"

  // Redirect logic
  if (isProtectedRoute && !isAuthenticated) {
    // Redirect to login page if trying to access protected route without authentication
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (isAdminRoute && !isAdmin) {
    // Redirect to home page if trying to access admin route without admin privileges
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (pathname === "/login" && isAuthenticated) {
    // Redirect to dashboard if already authenticated
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login"],
}

