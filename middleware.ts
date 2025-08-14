import { auth } from "@/lib/auth-edge"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req
  const isAuthenticated = !!req.auth?.user

  const isAuthPage = nextUrl.pathname.startsWith("/auth")
  const isTestAPI = nextUrl.pathname.startsWith("/api/test")
  const isProtectedRoute = nextUrl.pathname.startsWith("/home") || 
                          nextUrl.pathname.startsWith("/onboarding") ||
                          nextUrl.pathname.startsWith("/profile") ||
                          nextUrl.pathname.startsWith("/scheduling") ||
                          nextUrl.pathname.startsWith("/swaps") ||
                          nextUrl.pathname.startsWith("/schedule") ||
                          nextUrl.pathname.startsWith("/preferences") ||
                          nextUrl.pathname.startsWith("/settings") ||
                          nextUrl.pathname.startsWith("/testing") ||
                          nextUrl.pathname.startsWith("/fairness")
  const isRootPath = nextUrl.pathname === "/"

  // Allow test APIs to bypass authentication (for development/testing)
  if (isTestAPI) {
    return NextResponse.next()
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/home", nextUrl))
  }

  // Redirect unauthenticated users from protected routes to login
  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl))
  }

  // Redirect authenticated users from root to home
  if (isAuthenticated && isRootPath) {
    return NextResponse.redirect(new URL("/home", nextUrl))
  }

  // Redirect unauthenticated users from root to login
  if (!isAuthenticated && isRootPath) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
