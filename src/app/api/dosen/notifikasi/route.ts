import { NextResponse } from "next/server"

import { requireDosen } from "@/lib/dosen/auth"
import type { NotifikasiItem } from "@/lib/dosen/types"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const { error, session } = await requireDosen()
  if (error || !session) return error

  try {
    const notifikasi = await prisma.notifikasi.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      success: true,
      data: notifikasi.map((n) => ({
        id: n.id,
        pesan: n.pesan,
        isRead: n.isRead,
        createdAt: n.createdAt.toISOString(),
      })) as NotifikasiItem[],
    })
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal memuat notifikasi." },
      { status: 500 }
    )
  }
}
