import type { Dosen } from "@prisma/client"
import { NextResponse } from "next/server"

import { requireRole } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

export async function requireDosen() {
  const { error, session } = await requireRole("DOSEN")

  if (error || !session) {
    return {
      error: error ?? NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      session: null,
      dosen: null,
    }
  }

  const dosen = await prisma.dosen.findUnique({
    where: { userId: session.user.id },
  })

  if (!dosen) {
    return {
      error: NextResponse.json(
        { success: false, message: "Profil dosen tidak ditemukan." },
        { status: 404 }
      ),
      session: null,
      dosen: null,
    }
  }

  return { error: null, session, dosen }
}

export async function getDosenByUserId(
  userId: string
): Promise<Dosen | null> {
  return prisma.dosen.findUnique({ where: { userId } })
}
