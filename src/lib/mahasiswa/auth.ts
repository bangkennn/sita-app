import type { Mahasiswa } from "@prisma/client"
import { NextResponse } from "next/server"

import { requireRole } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

export async function requireMahasiswa() {
  const { error, session } = await requireRole("MAHASISWA")

  if (error || !session) {
    return {
      error: error ?? NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      session: null,
      mahasiswa: null,
    }
  }

  const mahasiswa = await prisma.mahasiswa.findUnique({
    where: { userId: session.user.id },
  })

  if (!mahasiswa) {
    return {
      error: NextResponse.json(
        { success: false, message: "Profil mahasiswa tidak ditemukan." },
        { status: 404 }
      ),
      session: null,
      mahasiswa: null,
    }
  }

  return { error: null, session, mahasiswa }
}

export async function getMahasiswaByUserId(
  userId: string
): Promise<Mahasiswa | null> {
  return prisma.mahasiswa.findUnique({ where: { userId } })
}
