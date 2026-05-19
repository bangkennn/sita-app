import { auth } from "@/auth"
import type { Role } from "@prisma/client"
import { NextResponse } from "next/server"

export async function requireSession() {
  const session = await auth()

  if (!session?.user) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      session: null,
    }
  }

  return { error: null, session }
}

export async function requireRole(allowedRole: Role) {
  const session = await auth()

  if (!session?.user) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      session: null,
    }
  }

  if (session.user.role !== allowedRole) {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      session: null,
    }
  }

  return { error: null, session }
}
