import NextAuth from "next-auth"
import { NextResponse } from "next/server"

import { authConfig } from "@/auth.config"
import { getDashboardPath } from "@/lib/dashboard"
import type { Role } from "@prisma/client"

const { auth } = NextAuth(authConfig)

const publicPaths = ["/", "/login", "/register"]

function isPublicPath(pathname: string): boolean {
  if (publicPaths.includes(pathname)) {
    return true
  }
  return pathname.startsWith("/api/auth")
}

function getRequiredRole(pathname: string): Role | null {
  if (pathname.startsWith("/admin")) return "ADMIN"
  if (pathname.startsWith("/dosen")) return "DOSEN"
  if (pathname.startsWith("/mahasiswa")) return "MAHASISWA"
  return null
}

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth
  const isLoggedIn = Boolean(session?.user)

  if (pathname === "/login" && isLoggedIn && session?.user?.role) {
    return NextResponse.redirect(
      new URL(getDashboardPath(session.user.role), req.nextUrl.origin)
    )
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  const requiredRole = getRequiredRole(pathname)

  if (requiredRole) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", req.nextUrl.origin)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (session?.user?.role !== requiredRole && session?.user?.role) {
      return NextResponse.redirect(
        new URL(getDashboardPath(session.user.role), req.nextUrl.origin)
      )
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
