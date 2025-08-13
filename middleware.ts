import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const session = await auth()
  
  // Check if the user is authenticated
  const isAuthenticated = !!session?.user
  
  // Define public routes that don't require authentication
  const publicRoutes = ["/auth/login", "/"]
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname)
  
  // Define protected routes that require authentication
  const protectedRoutes = ["/home"]
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )
  
  // If the user is not authenticated and trying to access a protected route
  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }
  
  // If the user is authenticated and trying to access the login page
  if (isAuthenticated && request.nextUrl.pathname === "/auth/login") {
    return NextResponse.redirect(new URL("/home", request.url))
  }
  
  // If the user is authenticated and on the base route, redirect to home
  if (isAuthenticated && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/home", request.url))
  }
  
  return NextResponse.next()
}

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
